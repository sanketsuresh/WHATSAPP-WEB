# WhatsApp Web Clone

A full-stack WhatsApp Web clone built with React, Node.js, Express, MongoDB, and Socket.IO. This application mimics the core functionality of WhatsApp Web with real-time messaging, conversation management, and message status tracking.

## 🚀 Features

### Backend Features
- **Webhook Processing**: Handles WhatsApp Business API webhook payloads
- **Real-time Messaging**: Socket.IO integration for instant message delivery
- **MongoDB Integration**: Stores conversations and messages with proper indexing
- **RESTful API**: Complete API for chat operations
- **Message Status Tracking**: Supports sent, delivered, read, and failed statuses
- **Security**: Helmet, CORS, and rate limiting

### Frontend Features
- **WhatsApp Web UI**: Pixel-perfect recreation of WhatsApp Web interface
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Real-time Updates**: Instant message delivery and status updates
- **Chat List**: Shows all conversations with last message preview
- **Message Bubbles**: Proper styling with timestamps and status indicators
- **Send Messages**: Beautiful input interface with send button animation

## 📁 Project Structure

```
whatsapp-web-clone/
├── server/
│   ├── index.js                 # Main server file
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   └── Message.js           # Message schema
│   ├── routes/
│   │   ├── webhook.js           # Webhook processing routes
│   │   ├── chat.js              # Conversation routes
│   │   └── messages.js          # Message routes
│   └── scripts/
│       └── loadSampleData.js    # Sample data loader
├── src/
│   ├── components/
│   │   ├── ChatList.tsx         # Chat list component
│   │   ├── ChatWindow.tsx       # Main chat interface
│   │   └── MessageBubble.tsx    # Individual message component
│   ├── services/
│   │   └── api.ts               # API service functions
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── App.tsx                  # Main React component
└── README.md
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd whatsapp-web-clone
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/whatsapp?retryWrites=true&w=majority
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Replace MongoDB credentials with your actual values.**

### 3. Database Setup
The application will automatically create the necessary collections and indexes when you start the server.

### 4. Load Sample Data (Optional)
```bash
node server/scripts/loadSampleData.js
```

### 5. Start Development Server
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend client (port 5173).

## 📡 API Endpoints

### Webhook Processing
- `POST /api/webhook/process` - Process WhatsApp webhook payloads

### Chat Management  
- `GET /api/chats/conversations` - Get all conversations
- `GET /api/chats/conversations/:wa_id/messages` - Get messages for a conversation

### Messaging
- `POST /api/messages/send` - Send a new message

### Health Check
- `GET /api/health` - Server health status

## 🔧 Usage

### Processing Webhook Payloads
Send a POST request to `/api/webhook/process` with the webhook payload:

```javascript
const payload = {
  "payload_type": "whatsapp_webhook",
  "_id": "unique-id",
  "metaData": {
    "entry": [
      {
        "changes": [
          {
            "field": "messages",
            "value": {
              "contacts": [
                {
                  "profile": { "name": "John Doe" },
                  "wa_id": "1234567890"
                }
              ],
              "messages": [
                {
                  "from": "1234567890",
                  "id": "unique-message-id",
                  "timestamp": "1699999999",
                  "text": { "body": "Hello World" },
                  "type": "text"
                }
              ]
            }
          }
        ]
      }
    ]
  }
};
```

### Frontend Usage
1. Open `http://localhost:5173` in your browser
2. Select a conversation from the chat list
3. View message history with proper timestamps and status
4. Send new messages using the input field
5. See real-time message delivery and status updates

## 🔌 Real-time Features

The application uses Socket.IO for real-time functionality:

- **New Messages**: Instantly appear in the chat window
- **Message Status**: Real-time status updates (sent → delivered → read)
- **Conversation Updates**: Chat list updates when new messages arrive
- **Connection Management**: Automatic reconnection handling

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Create a new web service
2. Connect your repository  
3. Set environment variables
4. Deploy automatically from main branch

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables for API URL

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri
NODE_ENV=production  
FRONTEND_URL=https://your-frontend-domain.com
```

## 🧪 Testing

### Manual Testing
1. Load sample data: `node server/scripts/loadSampleData.js`
2. Open multiple browser windows to test real-time features
3. Test webhook processing with sample payloads

### API Testing
Use Postman or curl to test the API endpoints:

```bash
# Get conversations
curl http://localhost:5000/api/chats/conversations

# Send a message
curl -X POST http://localhost:5000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{"wa_id":"1234567890","content":"Hello!","contactName":"John Doe"}'
```

## 🔒 Security Features

- **Helmet**: Security headers protection
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Prevents invalid data processing
- **Error Handling**: Secure error responses

## 📱 Mobile Responsiveness

The UI is fully responsive with breakpoints:
- **Mobile**: ≤ 768px - Full-screen chat interface
- **Tablet**: 768px - 1024px - Split view with collapsible sidebar  
- **Desktop**: ≥ 1024px - Full WhatsApp Web experience

## 🎨 Design Philosophy

Following WhatsApp Web's design principles:
- **Green Accent Color**: #25D366 for primary actions
- **Clean Typography**: Readable fonts with proper hierarchy
- **Subtle Animations**: Smooth transitions and micro-interactions
- **Message Bubbles**: Proper styling with rounded corners
- **Status Indicators**: Visual feedback for message states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper comments
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. WhatsApp is a trademark of Meta Platforms, Inc.

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Ensure MongoDB URI is correct
2. **Port Conflicts**: Change PORT in .env if 5000 is occupied
3. **CORS Errors**: Verify FRONTEND_URL matches your client URL
4. **Socket.IO Issues**: Check firewall settings for WebSocket connections

### Development Tips
- Use Chrome DevTools Network tab to monitor API calls
- Check browser console for React errors
- Monitor server logs for backend issues
- Use MongoDB Compass to inspect database collections

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console logs
3. Verify environment variables
4. Check API endpoint responses

---

Built with ❤️ using React, Node.js, MongoDB, and Socket.IO