import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get all conversations grouped by wa_id
router.get('/conversations', async (req, res) => {
  try {
    console.log('📋 Fetching conversations...');

    const conversations = await Message.aggregate([
      {
        $group: {
          _id: '$wa_id',
          contactName: { $first: '$contactName' },
          lastMessage: { $last: '$content' },
          lastMessageTime: { $last: '$timestamp' },
          lastMessageStatus: { $last: '$status' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$direction', 'incoming'] },
                    { $ne: ['$status', 'read'] }
                  ]
                },
                1,
                0
              ]
            }
          },
          totalMessages: { $sum: 1 }
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      },
      {
        $project: {
          wa_id: '$_id',
          contactName: 1,
          lastMessage: 1,
          lastMessageTime: 1,
          lastMessageStatus: 1, // Corrected field name
          unreadCount: 1,
          totalMessages: 1,
          _id: 0
        }
      }
    ]);

    console.log(`📊 Found ${conversations.length} conversations. Sending:`, conversations);
    res.json(conversations);
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a specific conversation - FIXED ROUTE
router.get('/conversations/:wa_id/messages', async (req, res) => {
  try {
    const { wa_id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    console.log(`💬 Fetching messages for wa_id: ${wa_id}`);

    const messages = await Message.find({ wa_id })
      .sort({ timestamp: 1 }) // Oldest first for chat order
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-originalPayload'); // Exclude large payload data

    // Mark incoming messages as read
    await Message.updateMany(
      { wa_id, direction: 'incoming', status: { $ne: 'read' } },
      { status: 'read' }
    );

    console.log(`📨 Found ${messages.length} messages for ${wa_id}. Sending:`, messages);
    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;