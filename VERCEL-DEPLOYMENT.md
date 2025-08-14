# Vercel Deployment Guide for WhatsApp Web Clone

## 🚀 Quick Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel
```

### 4. Set Environment Variables
After deployment, go to your Vercel dashboard and set these environment variables:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
```

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

## 🔧 Important Configuration Notes

### Database Setup
- **MongoDB Atlas**: Use MongoDB Atlas for production database
- **Connection String**: Format: `mongodb+srv://username:password@cluster.mongodb.net/database`
- **Network Access**: Allow access from anywhere (0.0.0.0/0) in MongoDB Atlas

### Environment Variables
Create a `.env.local` file in your project root:
```env
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```

### Build Process
The project automatically:
1. Builds the React frontend to `/dist` folder
2. Creates serverless functions for the API
3. Routes all `/api/*` requests to the Node.js backend
4. Serves static files from the React build

## 🐛 Troubleshooting

### Messages Not Loading
1. Check MongoDB connection in Vercel logs
2. Verify environment variables are set
3. Check API endpoints in browser console

### CORS Issues
- The app automatically handles CORS for Vercel domains
- All origins are allowed in production

### Build Errors
1. Ensure all dependencies are in `package.json`
2. Check Node.js version compatibility
3. Verify import/export syntax

## 📱 Testing After Deployment

1. **Health Check**: Visit `/api/health` to verify backend is working
2. **Frontend**: Check if React app loads properly
3. **API Calls**: Test message loading and sending
4. **Database**: Verify data persistence

## 🔄 Redeployment

To update your deployment:
```bash
vercel --prod
```

## 📊 Monitoring

- Check Vercel dashboard for function logs
- Monitor MongoDB Atlas for database performance
- Use browser console for frontend debugging

## 🆘 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify MongoDB connection
3. Test API endpoints individually
4. Check browser console for errors
