const express = require('express');
const router = express.Router();
const Message = require('../model/messageData');
const { protect, adminOnly } = require('../middleware/auth');
const User=require('../model/userData')

router.post('/send', protect, async (req, res) => {
  try {
    console.log('User sending message:', req.user);  
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const newMessage = new Message({
      sender: req.user._id, 
      receiver: admin._id,
      content,
      name: req.user.name,
      email: req.user.email,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Admin views messages from users
router.get('/user-messages', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user._id })
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/send-to-user/:userId', protect, adminOnly, async (req, res) => {
  try {
    const receiver = await User.findById(req.params.userId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { content,replyTo } = req.body;
    const newMessage = new Message({
      sender: req.user._id,
      receiver: receiver._id,
      content,
      replyTo:replyTo || null,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent to user' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// User fetches messages from admin (notifications)
router.get('/notifications', protect, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user._id })
      .populate('sender', 'name role')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark message as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (!message.receiver.equals(req.user._id))
      return res.status(403).json({ message: 'Not authorized' });

    message.read = true;
    await message.save();
    res.json({ message: 'Message marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/send-public', async (req, res) => {
  try {
    const { name, email, content } = req.body;
    if (!name || !email || !content) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const newMessage = new Message({
      name,
      email,
      content,
      receiver: admin._id,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
