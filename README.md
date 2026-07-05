# Chat Application

A full-stack real-time chat application built with the MERN stack.

## Features

- User authentication (register/login)
- Real-time messaging with Socket.IO
- MongoDB-backed message and user storage
- JWT-based authentication

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Socket.IO Client
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO
- Authentication: JSON Web Tokens (JWT)

## Project Structure

```text
client/   # React frontend
server/   # Express backend
```

## Installation

1. Clone the repository
2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd ../client
npm install
```

## Environment Variables

Create a `.env` file inside the `server` folder with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chat-app
JWT_SECRET=your_secret_key_here
```

## Running the Application

Start the backend server:

```bash
cd server
npm start
```

Start the frontend development server:

```bash
cd client
npm run dev
```


This project is for learning and development purposes.
