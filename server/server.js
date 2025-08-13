// server.js
require('dotenv').config();
const mongoose = require('mongoose');

async function start() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set in .env');

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Atlas connected');

    // Simple test: show DB names (optional)
    const admin = mongoose.connection.db.admin();
    const info = await admin.serverStatus();
    console.log('Server info OK:', !!info.ok);

    // Keep process alive for testing
    process.stdin.resume();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}
start();
