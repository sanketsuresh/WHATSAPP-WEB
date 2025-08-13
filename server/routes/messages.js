import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

/**
 * 📌 GET all messages (debugging)
 * Returns all seeded + new messages sorted oldest → newest.
 */
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).lean();
    res.status(200).json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * 📌 GET messages for a specific wa_id
 * This is what ChatWindow will call.
 */
router.get('/:wa_id', async (req, res) => {
  try {
    const { wa_id } = req.params;
    const messages = await Message.find({ wa_id })
      .sort({ timestamp: 1 })
      .lean();
    res.status(200).json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages by wa_id:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * 📌 Send a new message
 */
router.post('/send', async (req, res) => {
  try {
    const { wa_id, content, contactName } = req.body;
    const io = req.app.get('io');

    if (!wa_id || !content) {
      return res.status(400).json({ error: 'wa_id and content are required' });
    }

    console.log(`📤 Sending message to ${wa_id}: ${content}`);

    // Generate unique message ID
    const messageId = `wamid.${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;

    const message = new Message({
      messageId,
      metaMessageId: messageId,
      wa_id,
      contactName: contactName || wa_id,
      content,
      type: 'text',
      direction: 'outgoing',
      status: 'sent',
      timestamp: new Date(),
      businessPhone: '918329446654'
    });

    const savedMessage = await message.save();

    // Emit new message if Socket.IO is available
    if (io) {
      io.to(`conversation-${wa_id}`).emit('new-message', savedMessage);
    }

    // Simulate "delivered" status after 1 second
    setTimeout(async () => {
      try {
        savedMessage.status = 'delivered';
        await savedMessage.save();
        if (io) {
          io.to(`conversation-${wa_id}`).emit('message-status-update', {
            messageId: savedMessage.messageId,
            status: 'delivered',
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('❌ Error updating message status:', error);
      }
    }, 1000);

    console.log(`✅ Message sent successfully: ${savedMessage.messageId}`);
    res.status(201).json({ success: true, message: savedMessage });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
