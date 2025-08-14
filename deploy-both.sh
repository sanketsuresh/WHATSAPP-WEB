#!/bin/bash

echo "🚀 Deploying WhatsApp Web Clone to Vercel + Netlify..."
echo "====================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists vercel; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
else
    echo -e "${GREEN}✅ Vercel CLI found${NC}"
fi

if ! command_exists netlify; then
    echo -e "${RED}❌ Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
else
    echo -e "${GREEN}✅ Netlify CLI found${NC}"
fi

# Build the project
echo ""
echo "📦 Building project..."
if npm run build; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Deploy to Vercel (Backend)
echo ""
echo "🌐 Deploying backend to Vercel..."
echo -e "${YELLOW}⚠️  Make sure you're logged into Vercel${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Vercel deployment successful!${NC}"
    echo -e "${YELLOW}📝 Don't forget to set MONGODB_URI in Vercel dashboard${NC}"
else
    echo -e "${RED}❌ Vercel deployment failed!${NC}"
    exit 1
fi

# Get Vercel URL
echo ""
echo "🔗 Please enter your Vercel URL (e.g., https://your-app.vercel.app):"
read VERCEL_URL

# Update netlify.toml with actual Vercel URL
if [ ! -z "$VERCEL_URL" ]; then
    echo ""
    echo "📝 Updating netlify.toml with Vercel URL..."
    sed -i "s|your-vercel-app.vercel.app|$(echo $VERCEL_URL | sed 's|https://||')|g" netlify.toml
    echo -e "${GREEN}✅ netlify.toml updated!${NC}"
fi

# Deploy to Netlify (Frontend)
echo ""
echo "🌐 Deploying frontend to Netlify..."
echo -e "${YELLOW}⚠️  Make sure you're logged into Netlify${NC}"
netlify deploy --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Netlify deployment successful!${NC}"
else
    echo -e "${RED}❌ Netlify deployment failed!${NC}"
    exit 1
fi

# Final instructions
echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
echo -e "${GREEN}✅ Backend deployed to: ${VERCEL_URL}${NC}"
echo -e "${GREEN}✅ Frontend deployed to: Your Netlify URL${NC}"
echo ""
echo "🔧 Next Steps:"
echo "1. Set MONGODB_URI in Vercel environment variables"
echo "2. Seed production database: npm run seed-production"
echo "3. Test your app at the Netlify URL"
echo ""
echo "🧪 Test your deployment:"
echo "• Backend health: ${VERCEL_URL}/api/health"
echo "• Frontend: Your Netlify URL"
echo ""
echo "🌍 Your WhatsApp Web Clone is now accessible worldwide!"
