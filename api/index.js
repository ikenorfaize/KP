// ===================================
// 🚀 PERGUNU EXPRESS.JS API SERVER
// ===================================
// Backend API using Express.js for Vercel deployment
// Replaces json-server with custom Express endpoints

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Initialize Express app
const app = express();

// Store SSE clients
const sseClients = new Set();

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Server configuration
const PORT = process.env.PORT || 3001;

// Helper function to broadcast to all SSE clients
const broadcastToClients = (event, data) => {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(message);
    } catch (error) {
      // Remove dead connections
      sseClients.delete(client);
    }
  });
};

// ===== MIDDLEWARE =====
// Flexible CORS: allow localhost/127.0.0.1 on any port in development
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
      if (isLocalhost) return callback(null, true);
      // Allow specific production origins here if needed
      const allowList = new Set([
        'https://your-frontend-domain.vercel.app'
      ]);
      if (allowList.has(origin)) return callback(null, true);
    } catch {}
    return callback(null, false);
  },
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===== SSE ENDPOINT =====
app.get('/api/news/events', (req, res) => {
  console.log('🔔 New SSE client connected');
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Credentials': 'true'
  });

  // Add client to the set
  sseClients.add(res);

  // Send initial connection message
  res.write(`event: connected\ndata: {"message": "SSE connection established"}\n\n`);

  // Handle client disconnect
  req.on('close', () => {
    console.log('🔔 SSE client disconnected');
    sseClients.delete(res);
  });
});

// ===== DATABASE FUNCTIONS =====
const DB_PATH = join(__dirname, 'db.json');

// Read database
const readDB = () => {
  try {
    console.log('🔍 Attempting to read database from:', DB_PATH);
    console.log('🔍 File exists:', existsSync(DB_PATH));
    
    if (!existsSync(DB_PATH)) {
      console.log('❌ Database file not found at:', DB_PATH);
      // Create default db structure if file doesn't exist
      const defaultDB = {
        users: [],
        news: [],
        sessions: [],
        applications: []
      };
      writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
      return defaultDB;
    }
    
    const data = readFileSync(DB_PATH, 'utf8');
    console.log('✅ Database read successfully, size:', data.length, 'characters');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Database read error:', error.message);
    return { users: [], news: [], sessions: [], applications: [] };
  }
};

// Write database
const writeDB = (data) => {
  try {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log('✅ Database written successfully');
    return true;
  } catch (error) {
    console.error('❌ Database write error:', error.message);
    return false;
  }
};

// ===== NEWS ENDPOINTS =====

// GET /api/news - Get all news
app.get('/api/news', (req, res) => {
  const db = readDB();
  console.log('📰 Returning', db.news.length, 'news items');
  res.json(db.news || []);
});

// GET /api/news/:id - Get news by ID
app.get('/api/news/:id', (req, res) => {
  const db = readDB();
  const news = db.news.find(n => n.id === req.params.id);
  if (!news) {
    return res.status(404).json({ error: 'News not found' });
  }
  res.json(news);
});

// POST /api/news - Create new news
app.post('/api/news', (req, res) => {
  const db = readDB();
  const newNews = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    featured: req.body.featured || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.news.push(newNews);
  if (writeDB(db)) {
    broadcastToClients('news-added', newNews);
    res.status(201).json(newNews);
  } else {
    res.status(500).json({ error: 'Failed to save news' });
  }
});

// PUT /api/news/:id - Update news
app.put('/api/news/:id', (req, res) => {
  const db = readDB();
  const newsIndex = db.news.findIndex(n => n.id === req.params.id);
  
  if (newsIndex === -1) {
    return res.status(404).json({ error: 'News not found' });
  }
  
  const updatedNews = {
    ...db.news[newsIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  db.news[newsIndex] = updatedNews;
  
  if (writeDB(db)) {
    broadcastToClients('news-updated', updatedNews);
    res.json(updatedNews);
  } else {
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// DELETE /api/news/:id - Delete news
app.delete('/api/news/:id', (req, res) => {
  const db = readDB();
  const newsIndex = db.news.findIndex(n => n.id === req.params.id);
  
  if (newsIndex === -1) {
    return res.status(404).json({ error: 'News not found' });
  }
  
  const deletedNews = db.news[newsIndex];
  db.news.splice(newsIndex, 1);
  
  if (writeDB(db)) {
    broadcastToClients('news-deleted', { id: req.params.id });
    res.json({ message: 'News deleted successfully', deletedNews });
  } else {
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

// PUT /api/news/:id/feature - Set featured status
app.put('/api/news/:id/feature', (req, res) => {
  const db = readDB();
  const newsIndex = db.news.findIndex(n => n.id === req.params.id);
  
  if (newsIndex === -1) {
    return res.status(404).json({ error: 'News not found' });
  }
  
  db.news[newsIndex].featured = req.body.featured;
  db.news[newsIndex].updatedAt = new Date().toISOString();
  
  if (writeDB(db)) {
    broadcastToClients('news-featured', db.news[newsIndex]);
    res.json(db.news[newsIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update featured status' });
  }
});

// ===== USER ENDPOINTS =====

// POST /api/register - User registration
app.post('/api/register', async (req, res) => {
  const db = readDB();
  const { email, password, fullName } = req.body;
  
  // Check if user already exists
  const existingUser = db.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    fullName,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  
  if (writeDB(db)) {
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } else {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// POST /api/login - User login (email only)
app.post('/api/login', async (req, res) => {
  const db = readDB();
  const { email, password } = req.body;
  
  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create session
  const sessionId = Date.now().toString() + Math.random().toString(36);
  const session = {
    id: sessionId,
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };
  
  if (!db.sessions) db.sessions = [];
  db.sessions.push(session);
  writeDB(db);
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, sessionId });
});

// ===== AUTH ENDPOINTS =====

// POST /api/auth/login - User login (username or email)
app.post('/api/auth/login', async (req, res) => {
  console.log('🔐 Login attempt:', req.body);
  const db = readDB();
  const { username, password } = req.body;
  
  // Find user by username or email
  const user = db.users.find(u => 
    u.username === username || 
    u.email === username
  );
  
  if (!user) {
    console.log('❌ User not found:', username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  console.log('👤 Found user:', user.username, 'Email:', user.email);
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    console.log('❌ Invalid password for user:', user.username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  console.log('✅ Password valid for user:', user.username);
  
  // Create session
  const sessionId = Date.now().toString() + Math.random().toString(36);
  const session = {
    id: sessionId,
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };
  
  if (!db.sessions) db.sessions = [];
  db.sessions.push(session);
  writeDB(db);
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({ 
    success: true,
    user: userWithoutPassword, 
    token: sessionId,
    message: `Welcome back, ${user.fullName}!`
  });
});

// POST /api/auth/register - User registration
app.post('/api/auth/register', async (req, res) => {
  console.log('📝 Registration attempt:', req.body);
  const db = readDB();
  const { email, password, fullName, username } = req.body;
  
  // Check if user already exists
  const existingUser = db.users.find(u => u.email === email || u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = {
    id: Date.now().toString(),
    fullName,
    email,
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    role: 'user',
    certificates: [],
    downloads: 0,
    lastDownload: null,
    downloadHistory: [],
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0F7536&color=fff`
  };
  
  db.users.push(newUser);
  const success = writeDB(db);
  
  if (success) {
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      message: 'User registered successfully'
    });
  } else {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// ===== APPLICATION ENDPOINTS =====

// POST /api/applications - Submit application
app.post('/api/applications', (req, res) => {
  const db = readDB();
  
  const newApplication = {
    id: Date.now().toString(),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (!db.applications) db.applications = [];
  db.applications.push(newApplication);
  
  if (writeDB(db)) {
    res.status(201).json(newApplication);
  } else {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// GET /api/applications - Get all applications (admin only)
app.get('/api/applications', (req, res) => {
  const db = readDB();
  res.json(db.applications || []);
});

// GET /api/applications/user/:userId - Get applications by user
app.get('/api/applications/user/:userId', (req, res) => {
  const db = readDB();
  const userApplications = (db.applications || []).filter(app => app.userId === req.params.userId);
  res.json(userApplications);
});

// PUT /api/applications/:id/status - Update application status
app.put('/api/applications/:id/status', (req, res) => {
  const db = readDB();
  const appIndex = db.applications.findIndex(app => app.id === req.params.id);
  
  if (appIndex === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  db.applications[appIndex].status = req.body.status;
  db.applications[appIndex].updatedAt = new Date().toISOString();
  
  if (writeDB(db)) {
    res.json(db.applications[appIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// ===== USER MANAGEMENT ENDPOINTS =====

// GET /api/users - Get all users (for admin dashboard)
app.get('/api/users', (req, res) => {
  const db = readDB();
  console.log('👥 Returning', db.users.length, 'users');
  
  // Remove passwords from response
  const usersWithoutPasswords = db.users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json(usersWithoutPasswords);
});

// GET /api/users/:id - Get user by ID
app.get('/api/users/:id', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// PUT /api/users/:id - Update user
app.put('/api/users/:id', async (req, res) => {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const updatedUser = {
    ...db.users[userIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  // If password is being updated, hash it
  if (req.body.password) {
    updatedUser.password = await bcrypt.hash(req.body.password, 10);
  }
  
  db.users[userIndex] = updatedUser;
  
  if (writeDB(db)) {
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } else {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete user
app.delete('/api/users/:id', (req, res) => {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = db.users[userIndex];
  db.users.splice(userIndex, 1);
  
  if (writeDB(db)) {
    const { password, ...userWithoutPassword } = deletedUser;
    res.json({ message: 'User deleted successfully', deletedUser: userWithoutPassword });
  } else {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ===== SERVER START =====
app.listen(PORT, () => {
  console.log('🚀 ===== PERGUNU API SERVER STARTED =====');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔔 SSE endpoint: http://localhost:${PORT}/api/news/events`);
  console.log('📰 News API endpoints:');
  console.log('  GET /api/news - Get all news');
  console.log('  GET /api/news/:id - Get news by ID');
  console.log('  POST /api/news - Create new news');
  console.log('  PUT /api/news/:id - Update news');
  console.log('  DELETE /api/news/:id - Delete news');
  console.log('  PUT /api/news/:id/feature - Set as featured');
  console.log('🌟 Ready to serve!');
});

export default app;
