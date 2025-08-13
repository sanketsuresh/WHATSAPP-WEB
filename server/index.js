import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import connectDB from './config/database.js';
import webhookRoutes from './routes/webhook.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/messages.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Connect to MongoDB
connectDB();

// ✅ Logging
app.use(morgan('dev'));

// ✅ Security
app.use(helmet({ crossOriginEmbedderPolicy: false }));

// ✅ Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ✅ CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// ✅ Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Socket.IO events
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('join-conversation', (wa_id) => {
    socket.join(`conversation-${wa_id}`);
    console.log(`📥 ${socket.id} joined conversation ${wa_id}`);
  });

  socket.on('leave-conversation', (wa_id) => {
    socket.leave(`conversation-${wa_id}`);
    console.log(`📤 ${socket.id} left conversation ${wa_id}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// ✅ API Routes
app.use('/api/webhook', webhookRoutes);
app.use('/api/chats', chatRoutes);

// 🔹 Messages route with logging
app.use('/api/messages', (req, res, next) => {
  console.log(`📩 ${req.method} ${req.originalUrl}`);
  next();
}, messageRoutes);

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ❌ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Start server
const PORT = process.env.PORT || 6002;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
