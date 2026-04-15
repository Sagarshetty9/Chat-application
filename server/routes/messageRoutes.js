import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Fetch history for a specific room ID
router.get("/:roomID", async (req, res) => {
  try {
    const { roomID } = req.params;
    // Find messages and sort by time (oldest first)
    const history = await Message.find({ room: roomID }).sort({ createdAt: 1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: "Error fetching chat history" });
  }
});

export default router;