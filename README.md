# Real-Time Chat Application

A full-stack real-time chat application built using the MERN stack and Socket.IO. Users can register, log in, create or join chat rooms, and exchange messages instantly.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Socket.IO Client
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- bcrypt

---

# Features

- User Registration & Login
- JWT Authentication
- Real-time messaging using Socket.IO
- Create and join chat rooms
- Persistent chat history using MongoDB
- Responsive user interface

---

# Project Setup

## 1. Clone the repository

```bash
git clone <repository-url>
cd chat-application
```

---

# Frontend Setup

Navigate to the frontend folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

The frontend runs on:

```
http://localhost:5173
```

---

# Backend Setup

Navigate to the backend folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

The backend runs on:

```
http://localhost:5000
```

---

# Environment Variables

## Frontend

| Variable | Description |
|----------|-------------|
| VITE_BACKEND_URL | Backend API URL |

## Backend

| Variable | Description |
|----------|-------------|
| PORT | Server Port |
| MONGO_URI | MongoDB Connection String |
| JWT_SECRET | JWT Secret Key |
| CLIENT_URL | Frontend URL for CORS |

---

# Design Decisions

- Used JWT for authentication.
- Used Socket.IO for real-time communication.
- MongoDB stores user accounts and chat messages.
- REST API is used for authentication and fetching messages.
- Socket.IO handles instant message delivery.
- Frontend and backend are deployed separately.

---

# Assumptions

- Every user must register before logging in.
- Messages belong to a chat room.
- Internet connection is available during chatting.
- MongoDB is accessible through the provided connection string.
- Only authenticated users can send messages.

---

# Live Demo

## Frontend

https://chat-application-1-sooty.vercel.app

## Backend

https://chat-application-626w.onrender.com

---

# Future Improvements

- Typing indicator
- Online/offline user status
- Read/Delivered message status
- Image and file sharing
- Emoji support
- Group chat management
- Push notifications
- Message search

---

# Author

**Sagar Shetty**
