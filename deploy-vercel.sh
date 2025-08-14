#!/bin/bash

echo "🚀 Deploying WhatsApp Web Clone to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "🔗 Check your Vercel dashboard for the public URL"
echo "📝 Don't forget to set MONGODB_URI environment variable in Vercel dashboard"
echo "🌱 Run 'npm run seed-production' after setting environment variables"
