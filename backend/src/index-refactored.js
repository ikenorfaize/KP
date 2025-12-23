// ===================================
// 🚀 PERGUNU EXPRESS.JS API SERVER (REFACTORED)
// ===================================

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { config } from './config/database.js';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import beasiswaRoutes from './routes/beasiswa.js';
import usersRoutes from './routes/users.js';
import applicationsRoutes from './routes/applications.js';

const app = express();
const PORT = config.port;

// ===== MIDDLEWARE =====
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/beasiswa', beasiswaRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/applications', applicationsRoutes);

// Serve uploaded files from project uploads folder (bind-mounted at /app/uploads)
const PROJECT_UPLOADS = join(process.cwd(), 'uploads');
app.use('/uploads', express.static(PROJECT_UPLOADS));

// ===== IMAGE UPLOAD (compatibility for frontend) =====
const IMAGES_DIR = join(PROJECT_UPLOADS, 'images');
if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR, { recursive: true });

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, IMAGES_DIR),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const rand = Math.random().toString(36).substring(2, 12);
    const ext = file.originalname.includes('.') ? file.originalname.slice(file.originalname.lastIndexOf('.')) : '';
    cb(null, `${timestamp}_${rand}${ext}`);
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
    cb(null, allowed.includes(file.mimetype));
  }
});

// Accept POST /api/upload/image (frontend expects this path)
app.post('/api/upload/image', imageUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
  const url = `/uploads/images/${req.file.filename}`;
  res.json({ success: true, filename: req.file.filename, url });
});

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===== DB STATUS ENDPOINT =====
app.get('/api/admin/db-status', async (req, res) => {
  try {
    const { getCollection } = await import('./utils/database.js');
    
    const status = {
      useMongoDB: false,
      isConnected: false,
      mongodbUriExists: false,
      collections: {
        users: getCollection('users').length,
        news: getCollection('news').length,
        beasiswa: getCollection('beasiswa').length,
        applications: getCollection('applications').length,
        beasiswa_applications: getCollection('beasiswa_applications').length
      }
    };
    
    res.json(status);
  } catch (error) {
    console.error('❌ DB status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== SSE ENDPOINT FOR NEWS UPDATES =====
const sseClients = new Set();

app.get('/api/news/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial connection message
  res.write('data: {"type":"connected","message":"SSE connection established"}\n\n');

  // Add client to set
  sseClients.add(res);

  // Remove client on disconnect
  req.on('close', () => {
    sseClients.delete(res);
  });
});

// Helper function to broadcast SSE updates
export const broadcastNewsUpdate = (event, data) => {
  const message = `data: ${JSON.stringify({ type: event, data })}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(message);
    } catch (error) {
      sseClients.delete(client);
    }
  });
};

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== SERVER START =====
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const host = process.env.HOST || 'localhost';
  app.listen(PORT, () => {
    console.log('🚀 ===== PERGUNU API SERVER STARTED =====');
    console.log(`🌐 Server running on http://${host}:${PORT}`);
    console.log(`📡 SSE endpoint: http://${host}:${PORT}/api/news/events`);
    console.log(`🔧 Environment: ${config.nodeEnv}`);
    console.log(`🔗 CORS Origins: ${config.corsOrigins.join(', ')}`);
    console.log('📝 API Routes:');
    console.log('  🔐 /api/auth/*        - Authentication');
    console.log('  📰 /api/news/*        - News management');
    console.log('  🎓 /api/beasiswa/*    - Beasiswa management');
    console.log('  👥 /api/users/*       - User management');
    console.log('  📋 /api/applications/* - Application management');
    console.log('🎯 Ready to serve!');
  });
}

// Export for Vercel
export default app;
