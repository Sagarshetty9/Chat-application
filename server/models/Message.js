import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: { type: String, required: true }, 
  sender: { type: String, required: true },
  text: { type: String, required: true },
  
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent"
  },
  
  createdAt: { type: Date, default: Date.now } 
});

export default mongoose.model('Message', messageSchema);