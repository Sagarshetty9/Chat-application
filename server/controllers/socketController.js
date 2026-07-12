import Message from "../models/Message.js";

const onlineUsers = {}; 

export const handleSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("user_connected", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("update_online_users", Object.keys(onlineUsers));
    });

    socket.on("join_room", (roomID) => {
      socket.join(roomID);
    });

    // 🟢 UPDATED: Checks if receiver is online to set status
    socket.on("send_message", async (data) => {
      try {
        // Look up if the target user is currently in our onlineUsers cache
        const isReceiverOnline = Object.keys(onlineUsers).includes(data.receiverId);
        const currentStatus = isReceiverOnline ? "delivered" : "sent";

        const newMessage = new Message({
          room: data.room,
          sender: data.sender,
          text: data.message,
          status: currentStatus // Ensure your Mongoose Schema has: status: { type: String, default: "sent" }
        });

        await newMessage.save();

        io.to(data.room).emit("receive_message", {
          ...data,
          _id: newMessage._id,
          status: currentStatus
        });
      } catch (err) {
        console.error("Failed to save message:", err);
      }
    });

   socket.on("mark_as_read", async ({ room, userId }) => {
  try {
    console.log("mark_as_read received:", room, userId);

    const result = await Message.updateMany(
      {
        room,
        sender: { $ne: userId },
        status: { $ne: "read" },
      },
      {
        $set: { status: "read" },
      }
    );

    console.log("Update result:", result);

    io.to(room).emit("messages_marked_read", { room });

    console.log("messages_marked_read emitted");
  } catch (err) {
    console.error("Error marking read:", err);
  }
});

    socket.on("typing", (roomID) => { socket.to(roomID).emit("user_typing"); });
    socket.on("stop_typing", (roomID) => { socket.to(roomID).emit("user_stop_typing"); });

    socket.on("disconnect", () => {
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
      io.emit("update_online_users", Object.keys(onlineUsers));
    });
  });
};