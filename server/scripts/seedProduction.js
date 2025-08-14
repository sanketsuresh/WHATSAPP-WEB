import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Message from "../models/Message.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();

async function seedProductionData() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("❌ MONGODB_URI environment variable not set");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");

    // Clear existing data
    await Message.deleteMany({});
    console.log("🗑️ Cleared existing messages");

    // 8 unique conversations with different contacts
    const sampleMessages = [
      // Conversation 1: Ravi Kumar
      {
        messageId: "wamid.msg1.123456789",
        metaMessageId: "wamid.msg1.123456789",
        wa_id: "919937320320",
        contactName: "Ravi Kumar",
        content: "Hi, I'd like to know more about your services.",
        type: "text",
        direction: "incoming",
        status: "delivered",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        businessPhone: "918329446654"
      },
      {
        messageId: "wamid.msg2.123456790",
        metaMessageId: "wamid.msg2.123456790",
        wa_id: "919937320320",
        contactName: "Ravi Kumar",
        content: "Sure! We offer web development, mobile apps, and digital marketing services.",
        type: "text",
        direction: "outgoing",
        status: "sent",
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        businessPhone: "918329446654"
      },

      // Conversation 2: Neha Joshi
      {
        messageId: "wamid.msg3.123456791",
        metaMessageId: "wamid.msg3.123456791",
        wa_id: "929967673820",
        contactName: "Neha Joshi",
        content: "Hi, I saw your ad. Can you share more details?",
        type: "text",
        direction: "incoming",
        status: "delivered",
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        businessPhone: "918329446654"
      },
      {
        messageId: "wamid.msg4.123456792",
        metaMessageId: "wamid.msg4.123456792",
        wa_id: "929967673820",
        contactName: "Neha Joshi",
        content: "Of course! What specific service are you interested in?",
        type: "text",
        direction: "outgoing",
        status: "sent",
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        businessPhone: "918329446654"
      },

      // Conversation 3: Amit Patel
      {
        messageId: "wamid.msg5.123456793",
        metaMessageId: "wamid.msg5.123456793",
        wa_id: "919876543210",
        contactName: "Amit Patel",
        content: "Hello! I need help with my website redesign.",
        type: "text",
        direction: "incoming",
        status: "delivered",
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        businessPhone: "918329446654"
      },

      // Conversation 4: Priya Sharma
      {
        messageId: "wamid.msg6.123456794",
        metaMessageId: "wamid.msg6.123456794",
        wa_id: "919876543211",
        contactName: "Priya Sharma",
        content: "Hi there! Looking for mobile app development services.",
        type: "text",
        direction: "incoming",
        status: "delivered",
        timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
        businessPhone: "918329446654"
      },

      // Conversation 5: Rajesh Verma
      {
        messageId: "wamid.msg7.123456795",
        metaMessageId: "wamid.msg7.123456795",
        wa_id: "919876543212",
        contactName: "Rajesh Verma",
        content: "Good morning! I want to discuss a project.",
        type: "text",
        direction: "incoming",
        status: "delivered",
        timestamp: new Date(Date.now() - 10800000), // 3 hours ago
        businessPhone: "918329446654"
      },

      // Conversation 6: Sita Devi
      {
        messageId: "wamid.msg8.123456796",
        metaMessageId: "wamid.msg8.123456796",
        wa_id: "919876543213",
        contactName: "Sita Devi",
        content: "Hi! I need help with digital marketing.",
        type: "text",
        direction: "incoming",
        status: "delivered",
        timestamp: new Date(Date.now() - 12600000), // 3.5 hours ago
        businessPhone: "918329446654"
      },

      // Conversation 7: Kumar Singh
      {
        messageId: "wamid.msg9.123456797",
        metaMessageId: "wamid.msg9.123456797",
        wa_id: "919876543214",
        contactName: "Kumar Singh",
        content: "Hello! Looking for SEO services.",
        type: "text",
        direction: "incoming",
        status: "delivered",
        timestamp: new Date(Date.now() - 14400000), // 4 hours ago
        businessPhone: "918329446654"
      },

      // Conversation 8: Meera Kapoor
      {
        messageId: "wamid.msg10.123456798",
        metaMessageId: "wamid.msg10.123456798",
        wa_id: "919876543215",
        contactName: "Meera Kapoor",
        content: "Hi! I need a consultation for my business.",
        type: "text",
        direction: "incoming",
        status: "delivered",
        timestamp: new Date(Date.now() - 16200000), // 4.5 hours ago
        businessPhone: "918329446654"
      }
    ];

    // Insert sample messages
    await Message.insertMany(sampleMessages);
    console.log(`✅ Inserted ${sampleMessages.length} sample messages`);

    // Verify data
    const totalMessages = await Message.countDocuments();
    console.log(`📊 Total messages in database: ${totalMessages}`);

    // Check unique conversations
    const uniqueConversations = await Message.aggregate([
      {
        $group: {
          _id: '$wa_id',
          contactName: { $first: '$contactName' },
          messageCount: { $sum: 1 }
        }
      }
    ]);

    console.log(`💬 Unique conversations created: ${uniqueConversations.length}`);
    uniqueConversations.forEach(conv => {
      console.log(`  - ${conv.contactName} (${conv._id}): ${conv.messageCount} messages`);
    });

    console.log("🎯 Production data seeded successfully!");
    console.log("🌐 You should now see 8 different chats in your app!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding production data:", err);
    process.exit(1);
  }
}

seedProductionData();
