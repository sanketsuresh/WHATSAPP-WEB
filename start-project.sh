#!/bin/bash

echo "🚀 Starting WhatsApp Web Clone Project..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On Ubuntu/Debian: sudo systemctl start mongod"
    echo "   On macOS: brew services start mongodb-community"
    echo "   Or start manually: mongod"
    exit 1
fi

echo "✅ MongoDB is running"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Seed the database with 8 conversations
echo "🌱 Seeding database with 8 conversations..."
npm run seed-local

# Start the development server
echo "🚀 Starting development server..."
echo "🌐 Frontend will be available at: http://localhost:5173"
echo "🔧 Backend will be available at: http://localhost:9000"
echo "📱 You should see 8 different chats in the app!"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
