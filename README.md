# QR-Flow 🚀

QR-Flow is an advanced, full-stack MERN application for managing dynamic QR codes with integrated AI-powered insights. By leveraging the **Groq API**, the platform automatically analyzes URLs to generate metadata, while an **AI Assistant** provides real-time support on the dashboard.

---

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Axios.
- **Backend**: Node.js, Express.js (serving static frontend files in production).
- **Database**: MongoDB Atlas.
- **AI Integration**: Groq API (Llama 3 / Mixtral).
- **Deployment**: Render (Unified Monolith).

---

## 🌟 Key Features
- **Dynamic QR Generation**: Create QR codes that point to trackable redirection links.
- **AI Metadata Extraction**: Automatically generates titles, categories, and descriptions for your URLs.
- **Interactive AI Assistant**: A custom chatbot that recognizes users by name (e.g., "Hey Gadi Satwika") and assists with QR management.
- **Real-time Analytics**: Tracks scan counts, device types (Mobile/Desktop), and timestamps.
- **Adaptive Networking**: Configured to switch seamlessly between `localhost` and production domains using `window.location.origin`.

---

## 📁 Project Structure
```text
qr-flow/
├── client/           # React Frontend (Vite)
│   ├── src/
│   │   ├── api/      # Axios config (Handles /api base URL)
│   │   ├── config.js # Dynamic URL logic for QR generation
│   │   └── components/
└── server/           # Node.js Backend
    ├── controllers/  # Logic for QR scans, AI, and Auth
    ├── models/       # Mongoose Schemas (User & QR)
    ├── routes/       # API endpoints (Auth, QR, Chat)
    └── index.js      # Server entry point & static hosting logic
```

## ⚙️ Setup & Installation

1. Backend Setup

  cd server
  npm install
  ### Configure your .env with:
  ### MONGO_URI, JWT_SECRET, GROQ_API_KEY, NODE_ENV=production
  npm start
  
2. Frontend Setup
   
  cd client
  npm install
  npm run dev
  🚀 Deployment on Render
  This project is optimized for a Unified Deployment. The backend is configured to serve the frontend from the client/dist folder.

## Settings:

Root Directory: server

Build Command: npm install && cd ../client && npm install && npm run build

Start Command: node index.js

Environment Variables: Ensure NODE_ENV is set to production and MONGO_URI is whitelisted.

👨‍💻 Author
Gadi Satwika

Computer Science and Engineering Student at RGUKT RK Valley.
