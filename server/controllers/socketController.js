import Message from "../models/Message.js"

export const handleSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // User joins a specific private room
    socket.on("join_room", (roomID) => {
      socket.join(roomID);
      console.log(`User joined room: ${roomID}`);
    });

    // Handling private messages (Changed to async)
    socket.on("send_message", async (data) => {
      try {
        // 1. Save to MongoDB first
        const newMessage = new Message({
          room: data.room,
          sender: data.sender, // The ID or username from your frontend
          text: data.message,  // Note: Ensure frontend sends 'message' or 'text'
        });

        await newMessage.save();
        console.log("Message saved to DB");

        // 2. Emit to the other person in the room
        socket.to(data.room).emit("receive_message", data);
        
      } catch (err) {
        console.error("Failed to save message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
};