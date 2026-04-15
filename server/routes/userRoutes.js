import express from 'express';
import { register, login } from '../controllers/authController.js';
import { searchUser, addContact } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Routes
router.get('/search', verifyToken, searchUser);
router.post('/add', verifyToken, addContact);

router.get("/", async (req, res) => {
  const users = await User.find({}, "username _id"); // Only send what's needed
  res.json(users);
});

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