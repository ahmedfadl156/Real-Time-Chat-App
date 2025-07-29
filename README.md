💬 ChatFree: Your Real-time Chat Application
Welcome to ChatFree! This is a modern, minimalist, and real-time web chat application designed for instant communication. It allows multiple users to join a chat room, send messages, and see them appear instantly for everyone connected. This project showcases the power of WebSockets for live, bidirectional communication.

✨ Features
Real-time Messaging: Send and receive messages instantly with all connected users. 🚀

User Identification: Enter your unique username upon joining to identify your messages. 👤

Dynamic Avatars: Messages from different users are distinguished by unique, randomly generated avatars (initials with a background color). 🎨

Message Distinction: Your own messages are visually distinct (e.g., aligned to the right, different background color) from messages sent by others. ➡️⬅️

Auto-Scroll: The chat area automatically scrolls to the latest message, ensuring you always see the most recent conversation. ⬇️

Online Users List: See a real-time list of all users currently connected to the chat. 👥

Connection Status Indicator: A visual indicator shows whether you are connected to the chat server or not. 🟢🔴

Persistent Username: Your username is saved locally, so you don't have to re-enter it every time you open the app. 💾

Responsive Design: Enjoy a seamless chat experience across various devices (desktop, tablet, mobile). 📱💻

Auto-Resizing Input: The message input field automatically adjusts its height as you type longer messages. 📏

🚀 Technologies Used
HTML5: For the core structure of the web application.

Tailwind CSS: For rapid, utility-first styling and responsive design, giving the app a clean and modern look. 🎨

JavaScript (Vanilla JS): The core logic for handling UI interactions, message display, and WebSocket communication on the client-side. 🧠

Node.js: Used to build the simple backend server that facilitates WebSocket connections and message broadcasting. 🖥️

ws Library: A popular Node.js library for implementing WebSocket servers. 🌐

Express.js: A lightweight Node.js framework, used to create the HTTP server that the WebSocket is attached to. 🌐

Railway.app: A free and reliable hosting platform that hosts the Node.js WebSocket backend server. 🚀

GitHub Pages: Used to host the static frontend files. 📄

Font Awesome: For crisp and functional icons used throughout the UI (e.g., send, users, status). ✨

💻 How to Use
To get this project up and running on your local machine, you'll need to set up both the Client (Frontend) and the Server (Backend).

1. Backend Server Setup on Railway.app
Clone the Repository:

git clone https://github.com/ahmedfadl156/Real-Time-Chat-App.git
cd Real-Time-Chat-App/chat-server

Install Dependencies:

npm install

Deploy the Server on Railway.app:

Go to https://railway.app/ and sign in (using your GitHub account).

Create a new project ("New Project") and choose "Deploy from GitHub repo".

Select your repository: ahmedfadl156/Real-Time-Chat-App.

In the Deployment Settings:

Root Directory: Ensure it's chat-server.

Build Command: Ensure it's npm install.

Start Command: Ensure it's npm start.

Wait for the deployment to complete successfully.

Get the Public Server URL: After deployment, go to the "Networking" section in your service settings on Railway.app. Click "Generate Domain" (if you haven't already) and copy the public service URL (it will look something like https://your-service-name-xxxx.up.railway.app).

2. Frontend Client Setup and Update
Edit public/script.js:

In your local project, open Real-Time-Chat-App/public/script.js.

Find the line that defines WEBSOCKET_URL.

Replace the existing URL with the one you obtained from Railway.app.

Ensure the URL starts with wss:// (e.g., const WEBSOCKET_URL = 'wss://real-time-chat-app-production-db4d.up.railway.app';).

Save Changes and Push to GitHub:

Open your Terminal in the root directory of your project (Real-Time-Chat-App/).

  git add .
  git commit -m "Update WebSocket URL to Railway.app deployment"
  git push origin main # or master

Deploy the Frontend to GitHub Pages:

Go to your repository page on GitHub.

Navigate to Settings -> Pages.

Ensure "Branch" is set to main (or master) and the "Folder" is set to /public.

Click "Save".

After deployment, you will get your GitHub Pages site link (usually https://ahmedfadl156.github.io/Real-Time-Chat-App/).

3. Start Chatting!
Open the link you obtained from GitHub Pages in your browser.

Open the same link in another browser tab or window (or a different browser entirely).

Enter a username in each window.

Send messages from both windows and watch them appear in real-time in the other!

Monitor the "Online Users" list to see connected usernames.

📂 Project Structure
Real_Time_Chat_App/
├── chat-server/            # Node.js backend for WebSocket communication
│   ├── server.js           # WebSocket server logic
│   ├── package.json        # Server dependencies (ws, express)
│   └── Procfile            # Specifies how the server should be run on hosting platforms
├── public/                 # Frontend client files
│   ├── index.html          # Main chat application HTML file
│   ├── style.css           # Custom CSS (including Tailwind output)
│   ├── script.js           # All JavaScript logic for the client
│   └── images/             # Folder for images (e.g., logo)
├── .gitignore              # Specifies intentionally untracked files to ignore
├── package.json            # Frontend project configuration (if using npm for Tailwind build)
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file!

💡 Future Enhancements (Ideas for further development)
User Authentication: Implement real user login/registration. 🔐

Chat Rooms: Allow users to create and join different chat rooms. 🚪

Direct Messaging: Enable one-on-one private conversations. 🤫

Message History: Store messages persistently in a database (e.g., MongoDB, Firestore). 📜

Typing Indicator: Show when other users are typing. ✍️

Emojis/File Sharing: Add support for rich media in messages. 😄📎

Notifications: Desktop or in-app notifications for new messages. 🔔

User Status: Display user status (online/offline/away). 🟢🟡⚫

👨‍💻 Author
Ahmed Fadl

Happy Chatting! 🚀
