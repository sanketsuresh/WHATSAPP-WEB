import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Message from "../models/Message.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();

async function loadData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const payloadDir = path.join(__dirname, "server", "payloads");
    const files = fs.readdirSync(payloadDir);

    for (const file of files) {
      if (file.endsWith(".json")) {
        console.log(`📂 Processing ${file}...`);
        const rawData = JSON.parse(fs.readFileSync(path.join(payloadDir, file)));

        const items = Array.isArray(rawData) ? rawData : [rawData];

        const transformed = items.map(item => {
          let messageContent =
            item.text?.trim() ||
            item.content?.trim() ||
            "[No content provided]";

          return {
            messageId:
              item.id ||
              `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            metaMessageId: item.metaMessageId || null,
            wa_id: item.wa_id || "unknown",
            contactName: item.name || "Unknown Contact",
            content: messageContent,
            type: item.type || "text",
            direction: item.direction || "incoming",
            status: item.status || "sent",
            timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
            businessPhone: item.businessPhone || "918329446654",
            originalPayload: item
          };
        });

        await Message.insertMany(transformed);
        console.log(`✅ Inserted ${transformed.length} messages from ${file}`);
      }
    }

    console.log("🎯 All payloads inserted successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error inserting payloads:", err);
    process.exit(1);
  }
}

loadData();
