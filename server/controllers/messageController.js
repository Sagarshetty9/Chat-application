import Message from "../models/Message.js"


export const fetchHistory = async (req, res) => {
  try {
    
    const { roomID } = req.params;
    // Find messages and Sort
    const history = await Message.find({ room: roomID }).sort({ createdAt: 1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: "Error fetching chat history" });
  }
};