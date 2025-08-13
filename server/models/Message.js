import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // WhatsApp message ID
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  // Meta message ID for status updates
  metaMessageId: {
    type: String,
    index: true
  },
  // WhatsApp ID of the contact
  wa_id: {
    type: String,
    required: true,
    index: true
  },
  // Contact name
  contactName: {
    type: String,
    required: true
  },
  // Message content
  content: {
    type: String,
    required: true
  },
  // Message type (text, image, etc.)
  type: {
    type: String,
    default: 'text',
    enum: ['text', 'image', 'document', 'audio', 'video']
  },
  // Direction: incoming (from user) or outgoing (to user)
  direction: {
    type: String,
    required: true,
    enum: ['incoming', 'outgoing']
  },
  // Message status
  status: {
    type: String,
    default: 'sent',
    enum: ['sent', 'delivered', 'read', 'failed']
  },
  // WhatsApp timestamp
  timestamp: {
    type: Date,
    required: true
  },
  // Business phone number
  businessPhone: {
    type: String,
    default: '918329446654'
  },
  // Original webhook payload for reference
  originalPayload: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Compound indexes for efficient querying
messageSchema.index({ wa_id: 1, timestamp: -1 });
messageSchema.index({ messageId: 1, metaMessageId: 1 });

const Message = mongoose.model('messages', messageSchema);


export default Message;