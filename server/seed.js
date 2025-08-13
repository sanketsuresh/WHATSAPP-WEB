// server/seed.js
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const dbName = "whatsapp";
const payloadsDir = path.join(process.cwd(), "server", "payloads");

async function seed() {
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);
    const messagesCollection = db.collection("messages");
    const statusesCollection = db.collection("statuses");

    // Clear old data
    await messagesCollection.deleteMany({});
    await statusesCollection.deleteMany({});
    console.log("🗑 Cleared existing messages and statuses");

    // Read payload files
    const files = fs.readdirSync(payloadsDir);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(payloadsDir, file);
      const rawData = fs.readFileSync(filePath, "utf-8");
      const jsonData = JSON.parse(rawData);

      // Insert into correct collection
      if (file.includes("message")) {
        await messagesCollection.insertOne(jsonData);
        console.log(`📥 Inserted ${file} into messages`);
      } else if (file.includes("status")) {
        await statusesCollection.insertOne(jsonData);
        console.log(`📥 Inserted ${file} into statuses`);
      } else {
        console.log(`⚠️ Skipped ${file} (unknown type)`);
      }
    }

    console.log("✅ Seeding complete!");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    await client.close();
  }
}

seed();
