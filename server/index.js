
import express from "express";  
import connectDB from "./config/database_config.js"
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http";
import { initSocket } from "./config/socket_config.js";
import { handleSocket } from "./controllers/socketController.js";

import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from './routes/userRoutes.js';


// Load env vars
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000
const server = http.createServer(app);
const io = initSocket(server);



// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL
  ],
  credentials: true
}));

app.use(express.json());


// Basic Check Route
app.get('/', (req, res) => {
  res.send("Server is up and running ✅");
});

app.use('/api/users', userRoutes);
app.use("/api/messages", messageRoutes);


handleSocket(io);

 connectDB().then(()=>{
  server.listen(PORT, ()=> {
    console.log(`Server listening on http://localhost:${PORT}` )
  })
})

