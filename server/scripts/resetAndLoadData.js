import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Message from '../models/Message.js';

dotenv.config();

const __dirname = path.resolve();

async function resetAndLoadData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // Clear existing data
    await Message.deleteMany({});
    console.log('🗑️ Cleared existing messages');
    
    // Load sample data from sample-data directory
    const sampleDataDir = path.join(__dirname, 'server', 'sample-data');
    const files = fs.readdirSync(sampleDataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json')).sort();
    
    console.log(`📂 Found ${jsonFiles.length} payload files`);
    
    for (const file of jsonFiles) {
      console.log(`🔄 Processing ${file}...`);
      
      const filePath = path.join(sampleDataDir, file);
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Process the webhook payload directly
      await processWebhookPayload(payload);
      
      console.log(`✅ Processed ${file}`);
    }
    
    // Get final count
    const messageCount = await Message.countDocuments();
    console.log(`🎯 Loaded ${messageCount} messages successfully`);
    
    // Show some sample data
    const conversations = await Message.aggregate([
      { $group: { _id: '$wa_id', count: { $sum: 1 }, contactName: { $first: '$contactName' } } }
    ]);
    
    console.log('📊 Conversations loaded:');
    conversations.forEach(conv => {
      console.log(`  - ${conv.contactName} (${conv._id}): ${conv.count} messages`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function processWebhookPayload(payload) {
  if (!payload.metaData || !payload.metaData.entry) {
    console.log('⚠️ Invalid payload structure, skipping');
    return;
  }
  
  for (const entry of payload.metaData.entry) {
    for (const change of entry.changes) {
      if (change.field === 'messages') {
        const value = change.value;
        
        // Process incoming messages
        if (value.messages) {
          await processMessages(value.messages, value.contacts, payload);
        }
        
        // Process message statuses
        if (value.statuses) {
          await processStatuses(value.statuses);
        }
      }
    }
  }
}

async function processMessages(messages, contacts, payload) {
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
      await messageDoc.save();
      console.log(`💾 Saved ${direction} message: ${messageDoc.content.substring(0, 50)}...`);

    } catch (error) {
      if (error.code === 11000) {
        console.log('⚠️ Duplicate message, skipping:', message.id);
      } else {
        console.error('❌ Error processing message:', error);
      }
    }
  }
}

async function processStatuses(statuses) {
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
        console.log(`📊 Updated message status: ${status.id} -> ${status.status}`);
      } else {
        console.log('⚠️ Message not found for status update:', status.id);
      }
    } catch (error) {
      console.error('❌ Error processing status:', error);
    }
  }
}

resetAndLoadData();
