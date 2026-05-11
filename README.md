# 💬 Chat Application

A real-time chat application built using modern web technologies, offering a seamless messaging experience with features like user authentication, real-time updates, and responsive UI.

## 🚀 Features

- 🔐 User Authentication (Signup/Login)
- 💬 Real-time messaging using WebSockets
- 👥 One-to-one chat support
- 📲 Responsive UI for both desktop and mobile
- 🕒 Timestamps and online status indicators

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS / CSS Modules
- **Backend:** Node.js, Express.js
- **Real-time:** Socket.IO
- **Database:** MongoDB 
- **Authentication:** JWT 

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/akashgorai077/chat-app.git

# Navigate to the project directory
cd chat-app

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

```

---

## 🔐 Environment Variables Setup


✅ client/.env

- VITE_DB_URL="your-backend-api-url"
- VITE_DB_ORIGIN="your-socket-server-origin"

✅ server/.env

- MONGODB_URL="your-mongodb-connection-string"
- JWT_SECRET="your-jwt-secret"
- JWT_EXPIRES="in-days"
- COOKIE_EXPIRES=in-days
- CLIENT_URL="your-frontend-url"  # Or your deployed frontend URL


---

## 🧪 Running Locally

```bash
# Start Backend Server-
  cd server
  npm run dev

# Start Frontend-
  cd ../client
  npm run dev

 ```
---


## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository, open issues, or submit pull requests.

---

Made with ❤️ by [@akashgorai077](https://github.com/akashgorai077)
