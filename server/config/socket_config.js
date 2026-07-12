import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL], 
      credentials: true,
    },
  });
};

export const getIO = () => io;