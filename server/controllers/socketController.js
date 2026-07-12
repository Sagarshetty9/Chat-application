import Message from "../models/Message.js"


export const handleSocket = (io) => {

  //When a socket/User connects 
  io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    //Joining a room Private
    socket.on("join_room", (roomID) => {
      socket.join(roomID);
      console.log(`User joined room: ${roomID}`);
    });


    //Handling all messaging stuff 
    socket.on("send_message", async (data) => {
      try {
        const newMessage = new Message({
          room: data.room,
          sender: data.sender,
          text: data.message,
        });

        await newMessage.save();

        console.log("Message saved to DB");

        io.to(data.room).emit("receive_message", data);
        //socket.to(data.room).emit("receive_message", data);

      } catch (err) {
        console.error("Failed to save message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.id}`);
    });
  });
};