// server.js
const WebSocket = require('ws');

// استخدام process.env.PORT لكي يعمل على Render.com أو 8080 محلياً
const PORT = process.env.PORT || 8080; 

const wss = new WebSocket.Server({ port: PORT });

const clients = new Set();
const onlineUsers = new Map();

console.log(`WebSocket server started on port ${PORT}`);

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
                ws.username = parsedMessage.username;
                onlineUsers.set(parsedMessage.username, ws);
                console.log(`User ${parsedMessage.username} joined.`);
                broadcastOnlineUsers();
            } else if (parsedMessage.type === 'chat_message') { // تأكد من التعامل مع رسائل الدردشة
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

console.log('WebSocket server is running...');
