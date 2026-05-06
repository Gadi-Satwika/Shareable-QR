const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth'); // Ensure only logged-in users chat

// This line tells the server: "When someone POSTS to /api/chat/assistant, 
// use the chatWithAssistant function from the controller."
router.post('/assistant', protect, chatController.chatWithAssistant);

module.exports = router;