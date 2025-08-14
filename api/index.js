import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import connectDB from '../server/config/database.js';
import webhookRoutes from '../server/routes/webhook.js';
import chatRoutes from '../server/routes/chat.js';
import messageRoutes from '../server/routes/messages.js';

const app = express();

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

// ✅ CORS for Vercel
app.use(cors({
  origin: true,
  credentials: true
}));

// ✅ Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use('/api/webhook', webhookRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export for Vercel
export default app;
