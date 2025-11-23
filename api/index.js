// ===================================
// 🚀 PERGUNU EXPRESS.JS API SERVER
// ===================================
// Backend API using Express.js for Vercel deployment
// Replaces json-server with custom Express endpoints

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB, getDB } from './mongodb.js';

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
      // Remove dead connections - log error for debugging
      console.error('SSE client write error:', error.message);
      sseClients.delete(client);
    }
  });
};

// ===== MIDDLEWARE =====
// Secure CORS configuration with environment-based origins
const corsOptions = {
  origin: (origin, callback) => {
    // Log for debugging
    console.log('🔍 CORS check - Origin:', origin, 'NODE_ENV:', process.env.NODE_ENV);
    
    // Get allowed origins from environment
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
    
    // Allow same-origin requests (no origin header) - CRITICAL for Vercel
    if (!origin) {
      console.log('✅ CORS: Allowing same-origin request (no origin header)');
      return callback(null, true);
    }
    
    try {
      const url = new URL(origin);
      
      // In development, allow localhost origins
      if (process.env.NODE_ENV !== 'production') {
        const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
        if (isLocalhost) {
          console.log('✅ CORS: Allowing localhost origin');
          return callback(null, true);
        }
      }
      
      // Check against whitelist of allowed origins
      const allowList = new Set([
        ...allowedOrigins,
        process.env.FRONTEND_URL,
        'https://kp-mocha.vercel.app', // Production Vercel domain
        'https://kp-git-main-fairuzs-projects-d3e0b8cf.vercel.app', // Git deployment domain
        'https://kp-ue5wmj0ed-fairuzs-projects-d3e0b8cf.vercel.app' // Preview deployment domain
      ].filter(Boolean));
      
      console.log('🔍 CORS allowList:', Array.from(allowList));
      
      if (allowList.has(origin)) {
        console.log('✅ CORS: Origin in allowlist');
        return callback(null, true);
      }
      
      // In production, be more permissive with Vercel preview URLs
      if (origin.includes('vercel.app')) {
        console.log('✅ CORS: Allowing Vercel domain');
        return callback(null, true);
      }
      
      // Log rejected origins for debugging
      console.warn(`❌ CORS: Rejected origin ${origin}`);
      
    } catch (error) {
      console.error('❌ CORS: Invalid origin URL:', error.message);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  optionsSuccessStatus: 200, // Support legacy browsers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // ✅ Added PATCH
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'expires', 'cache-control', 'x-requested-with'],
  maxAge: 86400 // Cache preflight for 24 hours
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
// MongoDB connection state
let useMongoDB = false;
let mongoInitialized = false;

// Initialize MongoDB connection with retry
(async () => {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries && !mongoInitialized) {
    try {
      console.log(`🔄 Attempting to connect to MongoDB (attempt ${retries + 1}/${maxRetries})...`);
      console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
      
      const db = await connectDB();
      if (db) {
        useMongoDB = true;
        mongoInitialized = true;
        console.log('🍃 Using MongoDB for persistent storage');
        
        // Test connection by listing collections
        const collections = await db.listCollections().toArray();
        console.log('📊 Available collections:', collections.map(c => c.name).join(', ') || 'none');
        
        // Count documents in each collection
        for (const coll of ['users', 'news', 'applications', 'beasiswa']) {
          try {
            const count = await db.collection(coll).countDocuments();
            console.log(`  • ${coll}: ${count} documents`);
          } catch (e) {
            console.log(`  • ${coll}: collection not found`);
          }
        }
        break;
      } else {
        console.log('⚠️ MongoDB connection returned null, retrying...');
      }
    } catch (error) {
      console.error(`❌ MongoDB initialization error (attempt ${retries + 1}):`, error.message);
    }
    
    retries++;
    if (retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
    }
  }
  
  if (!mongoInitialized) {
    console.log('📄 Falling back to JSON file storage after all retries failed');
  }
})();

// Use /tmp in Vercel production (writable), local path in dev
const isVercel = process.env.VERCEL === '1';
const DB_SOURCE = join(__dirname, 'db.json');
const DB_PATH = isVercel ? '/tmp/db.json' : DB_SOURCE;

// Helper: Get collection from MongoDB or JSON
const getCollection = async (collectionName) => {
  // Check MongoDB availability directly (don't rely on useMongoDB flag due to async init)
  const db = getDB();
  if (db) {
    try {
      return await db.collection(collectionName).find({}).toArray();
    } catch (error) {
      console.error('MongoDB read error, falling back to JSON:', error.message);
    }
  }
  // Fallback to JSON
  const data = readDB();
  return data[collectionName] || [];
};

// Helper: Save collection to MongoDB or JSON
// Update a single document by ID (SAFE - doesn't affect other documents)
const updateDocument = async (collectionName, documentId, updates) => {
  const db = getDB();
  if (db) {
    try {
      const result = await db.collection(collectionName).updateOne(
        { id: documentId },
        { $set: { ...updates, updatedAt: new Date().toISOString() } },
        { writeConcern: { w: 'majority', j: true, wtimeout: 5000 } }
      );
      console.log(`✅ Updated document in ${collectionName}: id=${documentId}, matched=${result.matchedCount}, modified=${result.modifiedCount}`);
      return result;
    } catch (error) {
      console.error(`❌ MongoDB update error for ${collectionName}:`, error.message);
      throw error;
    }
  }
  
  // Fallback to JSON
  const data = readDB();
  const items = data[collectionName] || [];
  const index = items.findIndex(item => item.id === documentId);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    writeDB(data);
  }
};

// Delete a single document by ID (SAFE - doesn't affect other documents)
const deleteDocument = async (collectionName, documentId) => {
  const db = getDB();
  if (db) {
    try {
      const result = await db.collection(collectionName).deleteOne(
        { id: documentId },
        { writeConcern: { w: 'majority', j: true, wtimeout: 5000 } }
      );
      console.log(`✅ Deleted document from ${collectionName}: id=${documentId}, deleted=${result.deletedCount}`);
      return result;
    } catch (error) {
      console.error(`❌ MongoDB delete error for ${collectionName}:`, error.message);
      throw error;
    }
  }
  
  // Fallback to JSON
  const data = readDB();
  const items = data[collectionName] || [];
  data[collectionName] = items.filter(item => item.id !== documentId);
  writeDB(data);
};

const saveCollection = async (collectionName, items) => {
  // Check MongoDB availability directly (don't rely on useMongoDB flag due to async init)
  const db = getDB();
  if (db) {
    try {
      // ATOMIC UPSERT OPERATIONS with WRITE CONCERN - Prevents race conditions
      // Instead of delete+insert, we upsert each document individually
      const bulkOps = items.map(item => ({
        replaceOne: {
          filter: { _id: item._id },
          replacement: item,
          upsert: true
        }
      }));
      
      if (bulkOps.length > 0) {
        // Add write concern to ensure data is written to MongoDB
        const result = await db.collection(collectionName).bulkWrite(bulkOps, { 
          writeConcern: { w: 'majority', j: true, wtimeout: 5000 }
        });
        console.log(`✅ Saved ${items.length} items to MongoDB collection: ${collectionName}`);
        console.log(`   - Inserted: ${result.upsertedCount}`);
        console.log(`   - Updated: ${result.modifiedCount}`);
        console.log(`   - Matched: ${result.matchedCount}`);
        
        // Verify write succeeded
        const count = await db.collection(collectionName).countDocuments();
        console.log(`   - Verified count in DB: ${count}`);
      } else {
        console.log(`⚠️ No items to save for collection: ${collectionName}`);
      }
      return;
    } catch (error) {
      console.error(`❌ MongoDB write error for ${collectionName}:`, error.message);
      console.error('   Full error:', error);
      throw error; // Re-throw to let caller know write failed
    }
  }
  
  // Fallback to JSON if MongoDB not available
  console.log(`⚠️ MongoDB not available, using JSON fallback for ${collectionName}`);
  const data = readDB();
  data[collectionName] = items;
  writeDB(data);
};

// Read database (JSON fallback)
const readDB = () => {
  try {
    console.log('🔍 Attempting to read database from:', DB_PATH);
    console.log('🔍 Vercel environment:', isVercel);
    console.log('🔍 MongoDB enabled:', useMongoDB);
    
    // CRITICAL: Check if MongoDB is ACTUALLY connected (not just flag)
    const db = getDB();
    const mongoActuallyConnected = db !== null;
    
    console.log('🔍 MongoDB actual connection status:', mongoActuallyConnected);
    
    // NEVER copy source if MongoDB URI exists (even if not connected yet)
    // This prevents stale data resurrection on cold starts
    if (process.env.MONGODB_URI) {
      console.log('⚠️ MongoDB URI exists - skipping source copy to prevent data resurrection');
      
      // If MongoDB URI exists but not connected, use empty structure
      // MongoDB will be used once connection is established
      if (!mongoActuallyConnected && !existsSync(DB_PATH)) {
        console.log('📝 Creating empty fallback structure (MongoDB will be primary)');
        const emptyDB = {
          users: [],
          news: [],
          sessions: [],
          applications: [],
          beasiswa: [],
          beasiswa_applications: []
        };
        writeFileSync(DB_PATH, JSON.stringify(emptyDB, null, 2));
        return emptyDB;
      }
    }
    
    // Only copy from source if ABSOLUTELY NO MongoDB configuration exists
    if (!useMongoDB && !process.env.MONGODB_URI && isVercel && !existsSync(DB_PATH) && existsSync(DB_SOURCE)) {
      console.log('📋 No MongoDB configured, copying source db.json to /tmp for Vercel...');
      const sourceData = readFileSync(DB_SOURCE, 'utf8');
      writeFileSync(DB_PATH, sourceData);
    }
    
    if (!existsSync(DB_PATH)) {
      console.log('❌ Database file not found at:', DB_PATH);
      // Create default db structure if file doesn't exist
      const defaultDB = {
        users: [],
        news: [],
        sessions: [],
        applications: [],
        beasiswa: [],
        beasiswa_applications: []
      };
      writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
      return defaultDB;
    }
    
    const data = readFileSync(DB_PATH, 'utf8');
    console.log('✅ Database read successfully, size:', data.length, 'characters');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Database read error:', error.message);
    return { users: [], news: [], sessions: [], applications: [], beasiswa: [], beasiswa_applications: [] };
  }
};

// Write database (JSON fallback)
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
app.get('/api/news', async (req, res) => {
  try {
    const news = await getCollection('news');
    console.log('📰 Returning', news.length, 'news items');
    res.json(news || []);
  } catch (error) {
    console.error('Error getting news:', error);
    res.status(500).json({ error: 'Failed to get news' });
  }
});

// GET /api/news/:id - Get news by ID
app.get('/api/news/:id', async (req, res) => {
  try {
    const news = await getCollection('news');
    const item = news.find(n => n.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error getting news:', error);
    res.status(500).json({ error: 'Failed to get news' });
  }
});

// POST /api/news - Create new news
app.post('/api/news', async (req, res) => {
  try {
    const news = await getCollection('news');
    
    // Get image path from request body (uploaded via file-server)
    const imagePath = req.body.image || null;
    
    // Use provided ID (for import) or generate new one (for user creation)
    const newsId = req.body.id || Date.now().toString();
    
    // Check for duplicate ID
    const existingIndex = news.findIndex(n => n.id === newsId);
    if (existingIndex !== -1) {
      return res.status(409).json({ error: 'News with this ID already exists', id: newsId });
    }
    
    const newNews = {
      id: newsId,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author || '',
      category: req.body.category || 'general',
      image: imagePath,
      featured: req.body.featured || false,
      createdAt: req.body.createdAt || new Date().toISOString(),
      updatedAt: req.body.updatedAt || new Date().toISOString()
    };
    
    console.log('📰 Creating new news:', {
      title: newNews.title,
      hasImage: !!imagePath,
      imagePath: imagePath
    });
    
    news.push(newNews);
    await saveCollection('news', news);
    broadcastToClients('news-added', newNews);
    res.status(201).json(newNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: 'Failed to create news: ' + error.message });
  }
});

// PUT /api/news/:id - Update news
app.put('/api/news/:id', async (req, res) => {
  try {
    const news = await getCollection('news');
    const existingNews = news.find(n => n.id === req.params.id);
    
    if (!existingNews) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    // Get image path from request body (uploaded via file-server) or keep existing
    let imagePath = existingNews.image; // Keep existing image by default
    
    if (req.body.image !== undefined) {
      // Image field provided in JSON (could be null to remove image, or filename from file-server)
      imagePath = req.body.image;
    }
    
    const updates = {
      title: req.body.title || existingNews.title,
      content: req.body.content || existingNews.content,
      author: req.body.author !== undefined ? req.body.author : existingNews.author,
      category: req.body.category || existingNews.category,
      image: imagePath,
      featured: req.body.featured !== undefined ? req.body.featured : existingNews.featured
    };
    
    console.log('📰 Updating news:', {
      id: req.params.id,
      title: updates.title,
      imagePath: imagePath
    });
    
    // SAFE UPDATE - only updates THIS document, doesn't affect others
    await updateDocument('news', req.params.id, updates);
    
    const updatedNews = { ...existingNews, ...updates, updatedAt: new Date().toISOString() };
    broadcastToClients('news-updated', updatedNews);
    res.json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Failed to update news: ' + error.message });
  }
});

// DELETE /api/news/:id - Delete news
app.delete('/api/news/:id', async (req, res) => {
  try {
    const news = await getCollection('news');
    const existingNews = news.find(n => n.id === req.params.id);
    
    if (!existingNews) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    console.log('🗑️  Deleting news:', { id: req.params.id, title: existingNews.title });
    
    // SAFE DELETE - only deletes THIS document, doesn't affect others
    await deleteDocument('news', req.params.id);
    
    broadcastToClients('news-deleted', { id: req.params.id });
    res.json({ message: 'News deleted successfully', deletedNews: existingNews });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

// PUT /api/news/:id/feature - Set featured status
app.put('/api/news/:id/feature', async (req, res) => {
  try {
    const news = await getCollection('news');
    const newsIndex = news.findIndex(n => n.id === req.params.id);
    
    if (newsIndex === -1) {
      return res.status(404).json({ error: 'News not found' });
    }

    // Jika akan set featured true, maka reset yang lain menjadi false
    if (req.body.featured === true) {
      news.forEach((item, index) => {
        if (index !== newsIndex) {
          item.featured = false;
        }
      });
    }
    
    news[newsIndex].featured = req.body.featured;
    news[newsIndex].updatedAt = new Date().toISOString();
    
    await saveCollection('news', news);
    broadcastToClients('news-featured', news[newsIndex]);
    res.json(news[newsIndex]);
  } catch (error) {
    console.error('Error updating featured status:', error);
    res.status(500).json({ error: 'Failed to update featured status' });
  }
});

// ===== USER ENDPOINTS =====

// POST /api/register - User registration
app.post('/api/register', async (req, res) => {
  try {
    const users = await getCollection('users');
    const { email, password, fullName } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
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
    
    users.push(newUser);
    await saveCollection('users', users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// POST /api/login - User login (email only)
app.post('/api/login', async (req, res) => {
  try {
    const users = await getCollection('users');
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
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
    
    const sessions = await getCollection('sessions');
    sessions.push(session);
    await saveCollection('sessions', sessions);
    
    const { password: _pwd, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, sessionId });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ===== AUTH ENDPOINTS =====

// POST /api/auth/login - User login (username or email)
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body);
    const users = await getCollection('users');
    const { username, password } = req.body;
    
    // Find user by username or email
    const user = users.find(u => 
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
    
    const sessions = await getCollection('sessions');
    sessions.push(session);
    await saveCollection('sessions', sessions);
    
    const { password: _pwd, ...userWithoutPassword } = user;
    res.json({ 
      success: true,
      user: userWithoutPassword, 
      token: sessionId,
      message: `Welcome back, ${user.fullName}!`
    });
  } catch (error) {
    console.error('Error during auth login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/register - User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body);
    const users = await getCollection('users');
    const { email, password, fullName, username } = req.body;
    
    // NEW LOGIC: Block registration if email already exists (no update allowed)
    const registeredEmailCheck = users.find(u => u.email === email);
    if (registeredEmailCheck) {
      console.log('❌ Registration blocked: Email already registered:', email);
      return res.status(409).json({ 
        error: 'Email already registered',
        message: 'This email is already in use. Please use a different email address.',
        type: 'EMAIL_ALREADY_EXISTS'
      });
    }
  
    // Check if USERNAME already exists (different from email check)
    const existingUserByUsername = users.find(u => u.username === username);
    if (existingUserByUsername) {
      // Username conflict - let frontend retry with different username
      return res.status(409).json({ 
        error: 'Username already exists',
        existingUser: {
          id: existingUserByUsername.id,
          email: existingUserByUsername.email,
          username: existingUserByUsername.username,
          fullName: existingUserByUsername.fullName
        }
      });
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
    
    users.push(newUser);
    await saveCollection('users', users);
    
    const { password: _pwd, ...userWithoutPassword } = newUser;
    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ===== BEASISWA ENDPOINTS =====
// Function untuk menghitung status otomatis berdasarkan tanggal
const calculateBeasiswaStatus = (tanggal_mulai, deadline) => {
  const now = new Date();
  const startDate = new Date(tanggal_mulai);
  const endDate = new Date(deadline);
  
  if (now < startDate) {
    return 'Segera'; // Belum dimulai
  } else if (now >= startDate && now <= endDate) {
    return 'Buka'; // Sedang berlangsung
  } else {
    return 'Tutup'; // Sudah berakhir
  }
};

// GET /api/beasiswa - Get all beasiswa with auto-calculated status
app.get('/api/beasiswa', async (req, res) => {
  try {
    const beasiswa = await getCollection('beasiswa');
    
    // Update status otomatis untuk semua beasiswa
    const beasiswaWithStatus = beasiswa.map(b => ({
      ...b,
      status: calculateBeasiswaStatus(b.tanggal_mulai, b.deadline)
    }));
    
    console.log('🎓 Returning', beasiswaWithStatus.length, 'beasiswa items');
    res.json(beasiswaWithStatus);
  } catch (error) {
    console.error('Error fetching beasiswa:', error);
    res.status(500).json({ error: 'Failed to fetch beasiswa' });
  }
});

// GET /api/beasiswa/:id - Get beasiswa by ID with auto-calculated status
app.get('/api/beasiswa/:id', async (req, res) => {
  try {
    const beasiswa = await getCollection('beasiswa');
    const foundBeasiswa = beasiswa.find(b => b.id === req.params.id);
    
    if (!foundBeasiswa) {
      return res.status(404).json({ error: 'Beasiswa not found' });
    }
    
    // Update status otomatis
    const beasiswaWithStatus = {
      ...foundBeasiswa,
      status: calculateBeasiswaStatus(foundBeasiswa.tanggal_mulai, foundBeasiswa.deadline)
    };
    
    res.json(beasiswaWithStatus);
  } catch (error) {
    console.error('Error fetching beasiswa:', error);
    res.status(500).json({ error: 'Failed to fetch beasiswa' });
  }
});

// POST /api/beasiswa - Create new beasiswa
app.post('/api/beasiswa', async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['judul', 'nominal', 'deadline', 'tanggal_mulai', 'deskripsi', 'persyaratan', 'kategori'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Field ${field} is required` });
      }
    }
    
    // Use provided ID (for import) or generate new one (for user creation)
    const beasiswaId = req.body.id || Date.now().toString();
    
    const beasiswa = await getCollection('beasiswa');
    
    // Check for duplicate ID
    const existingIndex = beasiswa.findIndex(b => b.id === beasiswaId);
    if (existingIndex !== -1) {
      return res.status(409).json({ error: 'Beasiswa with this ID already exists', id: beasiswaId });
    }
    
    const newBeasiswa = {
      id: beasiswaId,
      judul: req.body.judul,
      nominal: req.body.nominal,
      deadline: req.body.deadline,
      tanggal_mulai: req.body.tanggal_mulai,
      status: req.body.status || calculateBeasiswaStatus(req.body.tanggal_mulai, req.body.deadline),
      deskripsi: req.body.deskripsi,
      persyaratan: Array.isArray(req.body.persyaratan) ? req.body.persyaratan : [req.body.persyaratan],
      kategori: req.body.kategori,
      createdAt: req.body.createdAt || new Date().toISOString(),
      updatedAt: req.body.updatedAt || new Date().toISOString()
    };
    
    beasiswa.push(newBeasiswa);
    await saveCollection('beasiswa', beasiswa);
    
    broadcastToClients('beasiswa-added', newBeasiswa);
    res.status(201).json(newBeasiswa);
  } catch (error) {
    console.error('Error creating beasiswa:', error);
    res.status(500).json({ error: 'Failed to save beasiswa' });
  }
});

// PUT /api/beasiswa/:id - Update beasiswa
app.put('/api/beasiswa/:id', async (req, res) => {
  try {
    const beasiswa = await getCollection('beasiswa');
    const existing = beasiswa.find(b => b.id === req.params.id);
    
    if (!existing) {
      return res.status(404).json({ error: 'Beasiswa not found' });
    }
    
    const updates = {
      ...req.body,
      // Auto-calculate status jika tanggal diubah
      status: calculateBeasiswaStatus(
        req.body.tanggal_mulai || existing.tanggal_mulai,
        req.body.deadline || existing.deadline
      )
    };
    
    // SAFE UPDATE - only updates THIS document
    await updateDocument('beasiswa', req.params.id, updates);
    
    const updatedBeasiswa = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    
    broadcastToClients('beasiswa-updated', updatedBeasiswa);
    res.json(updatedBeasiswa);
  } catch (error) {
    console.error('Error updating beasiswa:', error);
    res.status(500).json({ error: 'Failed to update beasiswa' });
  }
});

// DELETE /api/beasiswa/:id - Delete beasiswa
app.delete('/api/beasiswa/:id', async (req, res) => {
  try {
    const beasiswa = await getCollection('beasiswa');
    const existing = beasiswa.find(b => b.id === req.params.id);
    
    if (!existing) {
      return res.status(404).json({ error: 'Beasiswa not found' });
    }
    
    console.log('🗑️  Deleting beasiswa:', { id: req.params.id, judul: existing.judul });
    
    // SAFE DELETE - only deletes THIS document
    await deleteDocument('beasiswa', req.params.id);
    
    broadcastToClients('beasiswa-deleted', { id: req.params.id });
    res.status(204).send(); // No content response for successful deletion
  } catch (error) {
    console.error('Error deleting beasiswa:', error);
    res.status(500).json({ error: 'Failed to delete beasiswa' });
  }
});

// GET /api/beasiswa/kategori/:kategori - Get beasiswa by kategori
app.get('/api/beasiswa/kategori/:kategori', async (req, res) => {
  try {
    const beasiswa = await getCollection('beasiswa');
    const kategori = req.params.kategori;
    
    let filteredBeasiswa = beasiswa;
    
    // Filter by kategori (case insensitive), kecuali "Semua Program"
    if (kategori !== 'Semua Program') {
      filteredBeasiswa = filteredBeasiswa.filter(b => 
        b.kategori.toLowerCase() === kategori.toLowerCase()
      );
    }
    
    // Update status otomatis untuk semua hasil
    const beasiswaWithStatus = filteredBeasiswa.map(b => ({
      ...b,
      status: calculateBeasiswaStatus(b.tanggal_mulai, b.deadline)
    }));
    
    console.log('🎓 Returning', beasiswaWithStatus.length, 'beasiswa items for kategori:', kategori);
    res.json(beasiswaWithStatus);
  } catch (error) {
    console.error('Error fetching beasiswa by kategori:', error);
    res.status(500).json({ error: 'Failed to fetch beasiswa' });
  }
});

// ===== BEASISWA APPLICATION ENDPOINTS =====
// POST /api/beasiswa-applications - Submit beasiswa application
app.post('/api/beasiswa-applications', async (req, res) => {
  try {
    // Validate required fields for beasiswa application
    const requiredFields = ['beasiswaId', 'beasiswaTitle', 'fullName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Field ${field} is required` });
      }
    }
    
    const newApplication = {
      id: Date.now().toString(),
      beasiswaId: req.body.beasiswaId,
      beasiswaTitle: req.body.beasiswaTitle,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      education: req.body.education || '',
      gpa: req.body.gpa || '',
      motivation: req.body.motivation || '',
      status: 'pending',
      submittedAt: req.body.submittedAt || new Date().toISOString(),
      processedAt: null,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const applications = await getCollection('beasiswa_applications');
    applications.push(newApplication);
    await saveCollection('beasiswa_applications', applications);
    
    broadcastToClients('beasiswa-application-added', newApplication);
    res.status(201).json({
      message: 'Pendaftaran beasiswa berhasil dikirim',
      application: newApplication
    });
  } catch (error) {
    console.error('Error saving beasiswa application:', error);
    res.status(500).json({ error: 'Failed to save beasiswa application' });
  }
});

// GET /api/beasiswa-applications - Get all beasiswa applications (admin only)
app.get('/api/beasiswa-applications', async (req, res) => {
  try {
    const applications = await getCollection('beasiswa_applications');
    res.json(applications);
  } catch (error) {
    console.error('Error fetching beasiswa applications:', error);
    res.status(500).json({ error: 'Failed to fetch beasiswa applications' });
  }
});

// GET /api/beasiswa-applications/user/:email - Get applications by user email
app.get('/api/beasiswa-applications/user/:email', async (req, res) => {
  try {
    const applications = await getCollection('beasiswa_applications');
    const userApplications = applications.filter(app => app.email === req.params.email);
    res.json(userApplications);
  } catch (error) {
    console.error('Error fetching user beasiswa applications:', error);
    res.status(500).json({ error: 'Failed to fetch user applications' });
  }
});

// PUT /api/beasiswa-applications/:id/status - Update application status
app.put('/api/beasiswa-applications/:id/status', async (req, res) => {
  try {
    const applications = await getCollection('beasiswa_applications');
    const appIndex = applications.findIndex(app => app.id === req.params.id);
    
    if (appIndex === -1) {
      return res.status(404).json({ error: 'Beasiswa application not found' });
    }
    
    applications[appIndex].status = req.body.status;
    applications[appIndex].processedAt = new Date().toISOString();
    applications[appIndex].notes = req.body.notes || '';
    applications[appIndex].updatedAt = new Date().toISOString();
    
    await saveCollection('beasiswa_applications', applications);
    
    broadcastToClients('beasiswa-application-updated', applications[appIndex]);
    res.json(applications[appIndex]);
  } catch (error) {
    console.error('Error updating beasiswa application:', error);
    res.status(500).json({ error: 'Failed to update beasiswa application status' });
  }
});

// ===== APPLICATION ENDPOINTS =====

// POST /api/applications - Submit application
app.post('/api/applications', async (req, res) => {
  try {
    const applications = await getCollection('applications');
    
    // Use provided ID (for import) or generate new one (for user submission)
    const appId = req.body.id || Date.now().toString();
    
    // Check for duplicate ID
    const existingIndex = applications.findIndex(a => a.id === appId);
    if (existingIndex !== -1) {
      return res.status(409).json({ error: 'Application with this ID already exists', id: appId });
    }
    
    const newApplication = {
      id: appId,
      ...req.body,
      status: req.body.status || 'pending',
      createdAt: req.body.createdAt || new Date().toISOString(),
      updatedAt: req.body.updatedAt || new Date().toISOString()
    };
    
    applications.push(newApplication);
    await saveCollection('applications', applications);
    
    res.status(201).json(newApplication);
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// GET /api/applications - Get all applications (admin only)
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await getCollection('applications');
    res.json(applications || []);
  } catch (error) {
    console.error('Error getting applications:', error);
    res.status(500).json({ error: 'Failed to get applications' });
  }
});

// GET /api/applications/user/:userId - Get applications by user
app.get('/api/applications/user/:userId', async (req, res) => {
  try {
    const applications = await getCollection('applications');
    const userApplications = applications.filter(app => app.userId === req.params.userId);
    res.json(userApplications);
  } catch (error) {
    console.error('Error getting user applications:', error);
    res.status(500).json({ error: 'Failed to get applications' });
  }
});

// PUT /api/applications/:id/status - Update application status
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const applications = await getCollection('applications');
    const appIndex = applications.findIndex(app => app.id === req.params.id);
    
    if (appIndex === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    applications[appIndex].status = req.body.status;
    applications[appIndex].updatedAt = new Date().toISOString();
    
    await saveCollection('applications', applications);
    res.json(applications[appIndex]);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// DELETE /api/applications/:id - Delete application (remove from history)
app.delete('/api/applications/:id', async (req, res) => {
  try {
    const applications = await getCollection('applications');
    const existing = applications.find(app => app.id === req.params.id);
    
    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    console.log(`🗑️ Deleting application: ${req.params.id}`);
    
    // SAFE DELETE - only deletes THIS document
    await deleteDocument('applications', req.params.id);
    
    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// PATCH /api/applications/:id - Update application (for approve/reject with notes)
app.patch('/api/applications/:id', async (req, res) => {
  try {
    const applications = await getCollection('applications');
    const appIndex = applications.findIndex(app => app.id === req.params.id);
    
    if (appIndex === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // Update application with new data
    const updatedApp = {
      ...applications[appIndex],
      ...req.body,
      processedAt: new Date().toISOString()
    };
    
    applications[appIndex] = updatedApp;
    await saveCollection('applications', applications);
    
    console.log(`✅ Application ${req.params.id} updated:`, req.body.status || 'data updated');
    
    // Broadcast real-time update
    broadcastToClients('application-updated', updatedApp);
    
    // Return in format expected by frontend: { application: updatedApp }
    res.json({ application: updatedApp });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// ===== STATUS CHECK ENDPOINT =====
// GET /api/check-status/:email - Check application status by email (public endpoint)
app.get('/api/check-status/:email', async (req, res) => {
  try {
    const applications = await getCollection('applications');
    const email = decodeURIComponent(req.params.email).toLowerCase().trim();
    
    console.log(`🔍 Checking application status for email: ${email}`);
    
    // Search for application by email (case-insensitive)
    const application = applications.find(
      app => app.email && app.email.toLowerCase().trim() === email
    );
  
  if (!application) {
    console.log(`❌ No application found for email: ${email}`);
    return res.json({
      success: false,
      message: 'Email tidak terdaftar dalam sistem',
      application: null
    });
  }
  
  // Generate status message based on application status
  let statusMessage = '';
  switch (application.status) {
    case 'pending':
      statusMessage = 'Pendaftaran Anda sedang diproses oleh admin. Harap tunggu maksimal 2x24 jam untuk konfirmasi.';
      break;
    case 'approved':
      statusMessage = 'Selamat! Pendaftaran Anda telah disetujui. Silakan cek email untuk username dan password login.';
      break;
    case 'rejected':
      statusMessage = 'Pendaftaran Anda perlu diperbaiki. Silakan cek email untuk detail dan daftar ulang dengan data yang benar.';
      break;
    default:
      statusMessage = 'Status pendaftaran Anda sedang dalam review.';
  }
  
  console.log(`✅ Application found - Status: ${application.status}`);
  
    res.json({
      success: true,
      message: statusMessage,
      application: {
        id: application.id,
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        position: application.position || 'N/A',
        school: application.school || 'N/A',
        status: application.status,
        submittedAt: application.submittedAt,
        processedAt: application.processedAt || null,
        notes: application.notes || '',
        // Hide sensitive data
        credentials: undefined,
        pw: undefined,
        pc: undefined
      }
    });
  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// ===== USER MANAGEMENT ENDPOINTS =====

// GET /api/users - Get all users (for admin dashboard)
app.get('/api/users', async (req, res) => {
  try {
    const users = await getCollection('users');
    console.log('👥 Returning', users.length, 'users');
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password: _pwd, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// GET /api/users/:id - Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await getCollection('users');
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password from response
    const { password: _pwd, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// PUT /api/users/:id - Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const users = await getCollection('users');
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    // If password is being updated, hash it
    if (req.body.password) {
      updatedUser.password = await bcrypt.hash(req.body.password, 10);
    }
    
    users[userIndex] = updatedUser;
    await saveCollection('users', users);
    
    const { password: _pwd, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const users = await getCollection('users');
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    await saveCollection('users', users);
    
    const { password: _pwd, ...userWithoutPassword } = deletedUser;
    res.json({ message: 'User deleted successfully', deletedUser: userWithoutPassword });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ===== IMAGE UPLOAD ENDPOINTS =====
import { uploadImage } from './cloudinaryService.js';
import multer from 'multer';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// POST /api/upload/image - Upload image to Cloudinary
app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  try {
    console.log('📸 === Image Upload Request ===');
    console.log('File received:', req.file ? 'YES' : 'NO');
    
    if (!req.file || !req.file.buffer) {
      console.error('❌ No image file in request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `${timestamp}_${randomString}`;
    
    console.log('📸 Uploading image to Cloudinary:', {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      generatedFilename: filename
    });

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadImage(req.file.buffer, filename);
    
    console.log('✅ Image uploaded successfully to:', cloudinaryUrl);
    
    // Return proxied URL to bypass SSL issues
    const baseUrl = process.env.VERCEL ? 'https://kp-mocha.vercel.app' : `http://localhost:${PORT}`;
    const proxiedUrl = `${baseUrl}/api/proxy-image?url=${encodeURIComponent(cloudinaryUrl)}`;
    
    res.json({
      success: true,
      filename: filename,
      url: proxiedUrl, // Return proxied URL
      originalUrl: cloudinaryUrl // Keep original for reference
    });
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image: ' + error.message });
  }
});

// GET /api/proxy-image - Proxy Cloudinary images to bypass SSL issues
app.get('/api/proxy-image', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    // Fetch image from Cloudinary via server (no SSL issues server-side)
    const https = await import('https');
    const http = await import('http');
    
    const protocol = imageUrl.startsWith('https') ? https : http;
    
    protocol.get(imageUrl, (imageResponse) => {
      // Set headers
      res.setHeader('Content-Type', imageResponse.headers['content-type'] || 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache 1 year
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // Pipe image data to response
      imageResponse.pipe(res);
    }).on('error', (err) => {
      console.error('❌ Proxy image error:', err);
      res.status(500).json({ error: 'Failed to proxy image' });
    });
  } catch (error) {
    console.error('❌ Proxy image error:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
});

// GET /uploads/images/:filename - Redirect for backward compatibility
app.get('/uploads/images/:filename', (req, res) => {
  console.log('⚠️ Old image URL accessed:', req.params.filename);
  res.status(410).json({
    error: 'This endpoint is deprecated',
    message: 'Images are now served from Cloudinary. Please update your image URLs.',
    filename: req.params.filename
  });
});

// ===== ADMIN MIGRATION ENDPOINT =====
app.post('/api/admin/migrate', async (req, res) => {
  try {
    // Ensure MongoDB connection (reconnect if needed)
    let db = getDB();
    if (!db) {
      console.log('🔄 MongoDB not connected, attempting to connect...');
      db = await connectDB();
      if (!db) {
        return res.status(503).json({ 
          error: 'MongoDB not connected',
          message: 'Cannot migrate data without MongoDB connection. MONGODB_URI may be missing or invalid.'
        });
      }
    }

    // Read source data from db.json
    const sourceData = readFileSync(DB_SOURCE, 'utf-8');
    const data = JSON.parse(sourceData);
    
    const results = {};
    
    // Migrate users
    if (data.users && data.users.length > 0) {
      await db.collection('users').deleteMany({});
      await db.collection('users').insertMany(data.users);
      results.users = data.users.length;
    }
    
    // Migrate news
    if (data.news && data.news.length > 0) {
      await db.collection('news').deleteMany({});
      await db.collection('news').insertMany(data.news);
      results.news = data.news.length;
    }
    
    // Migrate beasiswa
    if (data.beasiswa && data.beasiswa.length > 0) {
      await db.collection('beasiswa').deleteMany({});
      await db.collection('beasiswa').insertMany(data.beasiswa);
      results.beasiswa = data.beasiswa.length;
    }
    
    // Migrate applications
    if (data.applications && data.applications.length > 0) {
      await db.collection('applications').deleteMany({});
      await db.collection('applications').insertMany(data.applications);
      results.applications = data.applications.length;
    }
    
    // Migrate beasiswa_applications
    if (data.beasiswa_applications && data.beasiswa_applications.length > 0) {
      await db.collection('beasiswa_applications').deleteMany({});
      await db.collection('beasiswa_applications').insertMany(data.beasiswa_applications);
      results.beasiswa_applications = data.beasiswa_applications.length;
    }
    
    console.log('✅ Migration completed:', results);
    
    res.json({ 
      success: true,
      message: 'Data migrated successfully from db.json to MongoDB',
      migrated: results
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({ 
      error: 'Migration failed',
      message: error.message 
    });
  }
});

// GET /api/admin/db-status - Check database status
app.get('/api/admin/db-status', async (req, res) => {
  try {
    const db = getDB();
    const mongoConnected = db !== null;
    
    const status = {
      useMongoDB: mongoConnected, // Use actual DB connection status, not the flag
      isConnected: mongoConnected,
      mongodbUriExists: !!process.env.MONGODB_URI,
      collections: {}
    };
    
    if (db) {
      // Get counts from MongoDB
      try {
        status.collections.users = await db.collection('users').countDocuments();
        status.collections.news = await db.collection('news').countDocuments();
        status.collections.beasiswa = await db.collection('beasiswa').countDocuments();
        status.collections.applications = await db.collection('applications').countDocuments();
        status.collections.beasiswa_applications = await db.collection('beasiswa_applications').countDocuments();
      } catch (countError) {
        console.error('Error counting documents:', countError.message);
        status.error = countError.message;
      }
    } else {
      // Get counts from JSON
      const data = readDB();
      status.collections.users = (data.users || []).length;
      status.collections.news = (data.news || []).length;
      status.collections.beasiswa = (data.beasiswa || []).length;
      status.collections.applications = (data.applications || []).length;
      status.collections.beasiswa_applications = (data.beasiswa_applications || []).length;
    }
    
    res.json(status);
  } catch (error) {
    console.error('❌ DB status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/clear-collection - Clear a specific collection
app.post('/api/admin/clear-collection', async (req, res) => {
  try {
    const { collectionName } = req.body;
    
    if (!collectionName) {
      return res.status(400).json({ error: 'collectionName is required' });
    }
    
    const db = getDB();
    if (!db) {
      return res.status(500).json({ error: 'MongoDB not connected' });
    }
    
    const result = await db.collection(collectionName).deleteMany({});
    
    res.json({ 
      success: true, 
      collectionName,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('❌ Clear collection error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/deduplicate - Remove duplicates from a collection
app.post('/api/admin/deduplicate', async (req, res) => {
  try {
    const { collectionName } = req.body;
    
    if (!collectionName) {
      return res.status(400).json({ error: 'collectionName is required' });
    }
    
    const db = getDB();
    if (!db) {
      return res.status(500).json({ error: 'MongoDB not connected' });
    }
    
    // Get all documents
    const collection = db.collection(collectionName);
    const allDocs = await collection.find({}).toArray();
    
    // Group by _id (as string)
    const grouped = {};
    allDocs.forEach(doc => {
      const id = doc._id.toString();
      if (!grouped[id]) {
        grouped[id] = [];
      }
      grouped[id].push(doc);
    });
    
    let duplicatesRemoved = 0;
    
    // For each _id group with duplicates, keep only the first one
    for (const [id, docs] of Object.entries(grouped)) {
      if (docs.length > 1) {
        // Delete all duplicates except the first one
        const duplicateIds = docs.slice(1).map(d => d._id);
        const result = await collection.deleteMany({ _id: { $in: duplicateIds } });
        duplicatesRemoved += result.deletedCount;
      }
    }
    
    const finalCount = await collection.countDocuments();
    
    res.json({ 
      success: true, 
      collectionName,
      originalCount: allDocs.length,
      duplicatesRemoved,
      finalCount
    });
  } catch (error) {
    console.error('❌ Deduplicate error:', error);
    res.status(500).json({ error: error.message });
  }
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

// ===== SERVER START =====
// Only start server in local development (not on Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
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
}

// Export for Vercel serverless function
export default app;
