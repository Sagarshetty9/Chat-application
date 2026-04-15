import User from '../models/User.js';

export const searchUser = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username }).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addContact = async (req, res) => {
  try {
    const { userId, contactId } = req.body;
    await User.findByIdAndUpdate(userId, { $addToSet: { contacts: contactId } });
    res.json({ message: "Contact added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};