import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      // 🟢 CHANGED: Match your frontend production URL instead of using "*"
      origin: [process.env.CLIENT_URL], 
      credentials: true,
    },
  });
};

export const getIO = () => io;