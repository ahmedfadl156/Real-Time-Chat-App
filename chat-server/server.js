    // server.js
    const WebSocket = require('ws');

    const PORT = process.env.PORT || 8080;
    const wss = new WebSocket.Server({ port: PORT });

    const clients = new Set();
    const onlineUsers = new Map(); // <--- جديد: لتخزين المستخدمين المتصلين (username -> WebSocket instance)

    console.log(`WebSocket server started on port ${PORT}`);

    // دالة لإرسال قائمة المستخدمين المتصلين إلى جميع العملاء
    function broadcastOnlineUsers() {
        const usersArray = Array.from(onlineUsers.keys()); // الحصول على أسماء المستخدمين
        const message = JSON.stringify({
            type: 'online_users', // نوع الرسالة
            users: usersArray
        });
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    wss.on('connection', ws => {
        console.log('Client connected');
        clients.add(ws);

        // عند استلام رسالة من العميل
        ws.on('message', message => {
            const messageString = message.toString();
            console.log(`Received: ${messageString}`);

            try {
                const parsedMessage = JSON.parse(messageString);

                // <--- جديد: التعامل مع رسالة "user_joined" لإضافة المستخدم لقائمة المتصلين
                if (parsedMessage.type === 'user_joined' && parsedMessage.username) {
                    ws.username = parsedMessage.username; // حفظ اسم المستخدم على كائن الـ WebSocket
                    onlineUsers.set(parsedMessage.username, ws); // إضافة المستخدم للخريطة
                    console.log(`User ${parsedMessage.username} joined.`);
                    broadcastOnlineUsers(); // إرسال القائمة المحدثة للجميع
                } else {
                    // إذا كانت رسالة دردشة عادية، أضف المرسل إليها قبل البث
                    // (هذا يضمن أن الخادم هو من يحدد المرسل، وليس العميل فقط)
                    const messageToBroadcast = {
                        type: 'chat_message', // <--- جديد: تحديد نوع الرسالة كـ 'chat_message'
                        sender: parsedMessage.sender || 'Anonymous', // استخدم المرسل من الرسالة أو 'Anonymous'
                        content: parsedMessage.content
                    };

                    clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(messageToBroadcast));
                        }
                    });
                }
            } catch (e) {
                console.error("Failed to parse message or invalid message format:", messageString, e);
            }
        });

        // عند إغلاق اتصال العميل
        ws.on('close', () => {
            console.log('Client disconnected');
            clients.delete(ws);
            // <--- جديد: إزالة المستخدم من قائمة المتصلين عند الانفصال
            if (ws.username) {
                onlineUsers.delete(ws.username);
                console.log(`User ${ws.username} disconnected.`);
                broadcastOnlineUsers(); // إرسال القائمة المحدثة للجميع
            }
        });

        ws.on('error', error => {
            console.error('WebSocket error:', error);
        });
    });

    console.log('WebSocket server is running...');
    