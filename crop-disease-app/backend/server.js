require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const chatsRoutes = require('./routes/chats');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(passport.initialize());

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌱 Crop Disease Detection API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      chats: '/api/chats',
      upload: '/api/upload',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/upload', chatsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🌱 ====================================== 🌱
     Crop Disease Detection API Server
  🌱 ====================================== 🌱
  
  🚀 Server running on port ${PORT}
  📡 Environment: ${process.env.NODE_ENV || 'development'}
  🗃️  MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Using default localhost'}
  ☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Using demo mode'}
  
  📍 Endpoints:
     GET  /                    - Health check
     POST /api/auth/signup     - Register user
     POST /api/auth/login      - Login user
     POST /api/auth/google     - Google OAuth (mock)
     GET  /api/auth/me         - Get current user
     GET  /api/profile/:userId - Get profile
     PUT  /api/profile/:userId - Update profile
     POST /api/upload          - Upload & analyze image
     GET  /api/chats/:userId   - Get chat history
     POST /api/chats/sync      - Sync offline chats
  
  🌱 ====================================== 🌱
  `);
});

module.exports = app;
