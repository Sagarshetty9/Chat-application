
import express from "express";  
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import messageRoutes from "./routes/messageRoutes.js";

import userRoutes from './routes/userRoutes.js';
import { handleSocket } from './controllers/socketController.js';

// Load env vars
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://chat-application-1-sooty.vercel.app"
  ],
  credentials: true
}));
app.use(express.json()); // Essential for parsing req.body



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));



// Basic Check Route
app.get('/', (req, res) => {
  res.send("Server is up and running! 🚀");
});

app.use('/api/users', userRoutes);
app.use("/api/messages", messageRoutes);



handleSocket(io);

server.listen(PORT, () => {
  console.log(`📡 Server listening on http://localhost:${PORT}`);
});

