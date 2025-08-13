import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Process WhatsApp webhook payload
router.post('/process', async (req, res) => {
  try {
    const payload = req.body;
    const io = req.app.get('io');
    
    console.log('📨 Processing webhook payload:', payload._id);

    if (!payload.metaData || !payload.metaData.entry) {
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    for (const entry of payload.metaData.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const value = change.value;

          // Process incoming messages
          if (value.messages) {
            await processMessages(value.messages, value.contacts, payload, io);
          }

          // Process message statuses
          if (value.statuses) {
            await processStatuses(value.statuses, io);
          }
        }
      }
    }

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Helper function to process messages
async function processMessages(messages, contacts, payload, io) {
  for (const message of messages) {
    try {
      // Find contact info
      const contact = contacts?.find(c => c.wa_id === message.from) || 
                     { profile: { name: message.from }, wa_id: message.from };

      // Determine direction based on sender
      const businessPhone = '918329446654';
      const direction = message.from === businessPhone ? 'outgoing' : 'incoming';

      // Create message document
      const messageDoc = new Message({
        messageId: message.id,
        metaMessageId: message.id,
        wa_id: direction === 'outgoing' ? message.to || contact.wa_id : message.from,
        contactName: contact.profile?.name || message.from,
        content: message.text?.body || message.caption || 'Media message',
        type: message.type || 'text',
        direction,
        status: 'sent',
        timestamp: new Date(parseInt(message.timestamp) * 1000),
        businessPhone,
        originalPayload: payload
      });

      // Save to database
      const savedMessage = await messageDoc.save();
      console.log(`💾 Saved ${direction} message:`, savedMessage.messageId);

      // Emit real-time update
      io.to(`conversation-${savedMessage.wa_id}`).emit('new-message', {
        _id: savedMessage._id,
        messageId: savedMessage.messageId,
        wa_id: savedMessage.wa_id,
        contactName: savedMessage.contactName,
        content: savedMessage.content,
        type: savedMessage.type,
        direction: savedMessage.direction,
        status: savedMessage.status,
        timestamp: savedMessage.timestamp,
        createdAt: savedMessage.createdAt
      });

    } catch (error) {
      if (error.code === 11000) {
        console.log('⚠️ Duplicate message, skipping:', message.id);
      } else {
        console.error('❌ Error processing message:', error);
      }
    }
  }
}

// Helper function to process status updates
async function processStatuses(statuses, io) {
  for (const status of statuses) {
    try {
      // Find message by ID or meta_msg_id
      const message = await Message.findOne({
        $or: [
          { messageId: status.id },
          { metaMessageId: status.meta_msg_id }
        ]
      });

      if (message) {
        message.status = status.status;
        await message.save();

        console.log(`📊 Updated message status:`, status.id, status.status);

        // Emit status update
        io.to(`conversation-${message.wa_id}`).emit('message-status-update', {
          messageId: message.messageId,
          status: status.status,
          timestamp: new Date(parseInt(status.timestamp) * 1000)
        });
      } else {
        console.log('⚠️ Message not found for status update:', status.id);
      }
    } catch (error) {
      console.error('❌ Error processing status:', error);
    }
  }
}

export default router;