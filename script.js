// Helper functions for animated background and textarea auto-resize
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return; // Ensure element exists

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 6;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${posX}%;
            top: ${posY}%;
            animation-delay: ${delay}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Auto-resize textarea
function setupTextareaAutoResize() {
    const textarea = document.getElementById('message-input');
    if (!textarea) return; // Ensure element exists

    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}


// DOM Elements
const MessagesContainer = document.getElementById('messages-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const userNameModal = document.getElementById('username-modal');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const currentUserNameDisplay = document.getElementById('current-username');
const connectionStatus = document.getElementById('connection-status'); 
const onlineUsersSidebar = document.getElementById('online-users-sidebar'); 
const usersList = document.getElementById('users-list'); 


let currentUser = 'Guest';
const messages = [];


let ws; 
const WEBSOCKET_URL = 'ws://localhost:8080';


const userAvatarColors = {};

function getRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FCEA2B',
        '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
        '#10AC84', '#EE5A24', '#0652DD', '#9C88FF', '#FFC312'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function generateAvatarProperties(username) {
    const initial = username.charAt(0).toUpperCase();
    if (!userAvatarColors[username]) {
        userAvatarColors[username] = getRandomColor();
    }
    const bgColor = userAvatarColors[username];
    return { initial, bgColor };
}

function showUsernameModal() {
    userNameModal.classList.remove('hidden');
}

function hideUsernameModal() {
    userNameModal.classList.add('hidden');
}

function loadUsername() {
    const username = localStorage.getItem('chatAppUsername');
    if (username) {
        currentUser = username;
        currentUserNameDisplay.textContent = username; 
        hideUsernameModal();
        generateAvatarProperties(currentUser); 
        connectWebSocket(); 
    } else {
        showUsernameModal(); 
    }
}

function saveUsername() {
    localStorage.setItem('chatAppUsername', usernameInput.value);
}

function updateConnectionStatus(connected) {
    if (connectionStatus) { 
        const icon = connectionStatus.querySelector('i');
        if (connected) {
            connectionStatus.className = 'connection-status connected';
            connectionStatus.innerHTML = '<i class="fas fa-circle"></i> Connected';
        } else {
            connectionStatus.className = 'connection-status disconnected';
            connectionStatus.innerHTML = '<i class="fas fa-circle"></i> Disconnected';
        }
    }
}

function displayMessages() {
    MessagesContainer.innerHTML = '';

    messages.forEach(msg => {
        const isCurrentUserMessage = msg.sender === currentUser;
        const { initial, bgColor } = generateAvatarProperties(msg.sender);

        const messageHTML = `
            <div class="message ${isCurrentUserMessage ? 'own' : 'other'}">
                <div class="message-content">
                    <img src="https://placehold.co/48x48/${bgColor.substring(1)}/FFFFFF?text=${initial}" 
                         alt="${msg.sender}" class="message-avatar">
                    <div class="message-bubble ${isCurrentUserMessage ? 'own' : 'other'}">
                        <div class="message-sender">${msg.sender}</div>
                        <div class="message-text">${msg.content}</div>
                    </div>
                </div>
            </div>
        `;
        MessagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    });
    MessagesContainer.scrollTop = MessagesContainer.scrollHeight;
}

function addMessage(sender, content) {
    const newMsg = { sender: sender, content: content };
    messages.push(newMsg);
    displayMessages();
}

function displayOnlineUsers(users) {
    usersList.innerHTML = '';
    if (users.length === 0) {
        usersList.innerHTML = '<li class="text-gray-500 text-sm p-2 text-center">No other users online.</li>';
        return;
    }
    users.forEach(username => {
        const { initial, bgColor } = generateAvatarProperties(username);
        const userItemHTML = `
            <li class="user-item">
                <img src="https://placehold.co/40x40/${bgColor.substring(1)}/FFFFFF?text=${initial}" alt="${username}" class="user-avatar-small">
                <span>${username}</span>
            </li>
        `;
        usersList.insertAdjacentHTML('beforeend', userItemHTML);
    });
}




function connectWebSocket() {
    if (ws && ws.readyState !== WebSocket.CLOSED) {
        ws.close();
    }

    ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
        updateConnectionStatus(true);
        ws.send(JSON.stringify({ type: 'user_joined', username: currentUser }));
    };

    ws.onmessage = event => {
        const receivedData = JSON.parse(event.data); 

        if (receivedData.type === 'chat_message') { 
            addMessage(receivedData.sender, receivedData.content);
        } else if (receivedData.type === 'online_users') { 
            displayOnlineUsers(receivedData.users);
        }
    };

    // On connection close
    ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
        updateConnectionStatus(false);
        setTimeout(connectWebSocket, 5000);
    };

    // On error
    ws.onerror = error => {
        console.error('WebSocket error:', error);
        updateConnectionStatus(false);
    };
}

// --- Event Listeners ---
usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const getUsername = usernameInput.value.trim();

    if (!getUsername) {
        console.error('Username cannot be empty.');
        return;
    } else {
        currentUser = getUsername;
        hideUsernameModal();
        saveUsername();
        currentUserNameDisplay.textContent = currentUser; 
        generateAvatarProperties(currentUser); 
        connectWebSocket(); 
        displayMessages(); 
    }
});

// Handle message form submission
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageContent = messageInput.value.trim();

    if (!messageContent) {
        console.error('Message cannot be empty.');
        return;
    } else {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const messageToSend = {
                type: 'chat_message',
                sender: currentUser,
                content: messageContent
            };
            ws.send(JSON.stringify(messageToSend));
            messageInput.value = ''; 
            messageInput.style.height = 'auto'; 
        } else {
            console.error('WebSocket is not connected. Message added locally for demo.');
            addMessage(currentUser, messageContent);
            messageInput.value = '';
            messageInput.style.height = 'auto';
        }
    }
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); 
        messageForm.dispatchEvent(new Event('submit')); 
    }
});


window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupTextareaAutoResize();
    loadUsername(); 
});
