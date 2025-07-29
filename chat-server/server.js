// server.js
const express = require('express'); // استيراد Express
const WebSocket = require('ws');    // استيراد مكتبة WebSocket

const app = express(); // إنشاء تطبيق Express
const PORT = process.env.PORT || 8080; // استخدام البورت من متغيرات البيئة أو 8080 محلياً

// <--- جديد: لخدمة الملفات الثابتة (لو عايز تخدم الـ frontend من نفس الخادم)
// app.use(express.static('public')); // لو مجلد الـ public في نفس مستوى الـ chat-server

// تشغيل خادم HTTP باستخدام Express
const server = app.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
});

// إنشاء خادم WebSocket وربطه بخادم HTTP الموجود
const wss = new WebSocket.Server({ server }); // <--- هنا بنربط الـ WebSocket بخادم Express

const clients = new Set();
const onlineUsers = new Map();

console.log('WebSocket server is running...');

// دالة لإرسال قائمة المستخدمين المتصلين إلى جميع العملاء
function broadcastOnlineUsers() {
    const usersArray = Array.from(onlineUsers.keys());
    const message = JSON.stringify({
        type: 'online_users',
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

    ws.on('message', message => {
        const messageString = message.toString();
        console.log(`Received: ${messageString}`);

        try {
            const parsedMessage = JSON.parse(messageString);

            if (parsedMessage.type === 'user_joined' && parsedMessage.username) {
                ws.username = parsedMessage.username; // حفظ اسم المستخدم على كائن الـ WebSocket
                onlineUsers.set(parsedMessage.username, ws); // إضافة المستخدم للخريطة
                console.log(`User ${parsedMessage.username} joined.`);
                broadcastOnlineUsers(); // إرسال القائمة المحدثة للجميع
            } else if (parsedMessage.type === 'chat_message') {
                const messageToBroadcast = {
                    type: 'chat_message',
                    sender: parsedMessage.sender || 'Anonymous',
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

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
        if (ws.username) {
            onlineUsers.delete(ws.username);
            console.log(`User ${ws.username} disconnected.`);
            broadcastOnlineUsers();
        }
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

// <--- جديد: التعامل مع طلبات HTTP الأساسية (اختياري)
// هذا السطر مهم لكي لا يظهر Railway خطأ "No exposed ports"
// ويمكنك استخدامه لتقديم صفحة بسيطة إذا تم الوصول إلى الخادم عبر HTTP
app.get('/', (req, res) => {
    res.send('WebSocket server is running. Connect via WebSocket client.');
});

