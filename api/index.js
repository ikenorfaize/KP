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

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARE =====
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app' // Update this with your frontend URL
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
        applications: [],
        statistics: {}
      };
      writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
      console.log('✅ Created new database file');
      return defaultDB;
    }
    
    const data = readFileSync(DB_PATH, 'utf8');
    console.log('📄 File size:', data.length, 'characters');
    
    const parsed = JSON.parse(data);
    console.log('✅ Database loaded successfully');
    console.log('📊 Database keys:', Object.keys(parsed));
    console.log(`📊 Users: ${parsed.users?.length || 0}, News: ${parsed.news?.length || 0}, Applications: ${parsed.applications?.length || 0}`);
    
    if (parsed.users && parsed.users.length > 0) {
      console.log('👤 Sample users:', parsed.users.slice(0, 3).map(u => ({ id: u.id, username: u.username, role: u.role })));
    }
    
    return parsed;
  } catch (error) {
    console.error('❌ Error reading database:', error);
    console.error('❌ Error details:', error.message);
    return { users: [], news: [], sessions: [], applications: [], statistics: {} };
  }
};

// Write database
const writeDB = (data) => {
  try {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// ===== API ROUTES =====

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PERGUNU API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ===== USER ROUTES =====

// Get all users
app.get('/api/users', (req, res) => {
  try {
    console.log('📊 GET /api/users - Reading database...');
    const db = readDB();
    console.log('📊 Database structure:', Object.keys(db));
    console.log('📊 Users found:', db.users?.length || 0);
    
    if (db.users && db.users.length > 0) {
      console.log('📊 First user preview:', {
        id: db.users[0].id,
        username: db.users[0].username,
        email: db.users[0].email
      });
    }
    
    res.json(db.users || []);
  } catch (error) {
    console.error('❌ Error in GET /api/users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  try {
    const db = readDB();
    const user = db.users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send password in response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// User authentication/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const db = readDB();
    const user = db.users.find(u => 
      u.username === username || u.email === username
    );
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token: `user_${user.id}_${Date.now()}` // Simple token for demo
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, username, password, position, address, phone } = req.body;
    
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
    const db = readDB();
    
    // Check if user already exists
    const existingUser = db.users.find(u => 
      u.username === username || u.email === email
    );
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      fullName,
      email,
      username,
      password: hashedPassword,
      position: position || '',
      address: address || '',
      phone: phone || '',
      status: 'active',
      role: 'user',
      createdAt: new Date().toISOString(),
      certificates: [],
      downloads: 0,
      lastDownload: null,
      downloadHistory: [],
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0F7536&color=fff`
    };
    
    db.users.push(newUser);
    const success = writeDB(db);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to save user' });
    }
    
    // Don't send password in response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updates = req.body;
    
    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }
    
    // Update user
    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    const success = writeDB(db);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to update user' });
    }
    
    // Don't send password in response
    const { password, ...userWithoutPassword } = db.users[userIndex];
    res.json({
      message: 'User updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// PATCH user (partial update) - untuk update certificates tanpa touch password
app.patch('/api/users/:id', async (req, res) => {
  try {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updates = req.body;
    
    // For PATCH, NEVER auto-hash password - only if explicitly requested
    if (updates.password && updates.hashPassword === true) {
      updates.password = await bcrypt.hash(updates.password, 12);
      delete updates.hashPassword; // Remove the flag
    }
    
    // Merge updates (partial update)
    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    const success = writeDB(db);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to update user' });
    }
    
    // Don't send password in response
    const { password, ...userWithoutPassword } = db.users[userIndex];
    res.json({
      message: 'User updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ===== NEWS ROUTES =====

// Get all news
app.get('/api/news', (req, res) => {
  try {
    const db = readDB();
    res.json(db.news || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get news by ID
app.get('/api/news/:id', (req, res) => {
  try {
    const db = readDB();
    const news = (db.news || []).find(n => n.id === req.params.id);
    
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Create news (admin only)
app.post('/api/news', (req, res) => {
  try {
    const { title, content, author, category } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const db = readDB();
    if (!db.news) db.news = [];
    
    const newNews = {
      id: Date.now().toString(),
      title,
      content,
      author: author || 'Admin',
      category: category || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.news.push(newNews);
    const success = writeDB(db);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to save news' });
    }
    
    res.status(201).json({
      message: 'News created successfully',
      news: newNews
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create news' });
  }
});

// ===== APPLICATION ROUTES =====

// Get all applications
app.get('/api/applications', (req, res) => {
  try {
    const db = readDB();
    res.json(db.applications || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get application by ID
app.get('/api/applications/:id', (req, res) => {
  try {
    const db = readDB();
    const appItem = (db.applications || []).find(a => a.id === req.params.id);
    if (!appItem) return res.status(404).json({ error: 'Application not found' });
    res.json(appItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Create application
app.post('/api/applications', (req, res) => {
  try {
    const applicationData = req.body;
    
    const db = readDB();
    if (!db.applications) db.applications = [];
    
    const newApplication = {
      id: Date.now().toString(),
      ...applicationData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.applications.push(newApplication);
    const success = writeDB(db);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to save application' });
    }
    
    res.status(201).json({
      message: 'Application submitted successfully',
      application: newApplication
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// Update (partial) application e.g. approve/reject
app.patch('/api/applications/:id', (req, res) => {
  try {
    const updates = req.body || {};
    const db = readDB();
    if (!db.applications) db.applications = [];
    const idx = db.applications.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Application not found' });

    // Auto set processedAt if status transitions away from pending and not provided
    const prev = db.applications[idx];
    const nextStatus = updates.status ?? prev.status;
    const isProcessed = nextStatus !== 'pending';
    const patch = { ...updates };
    if (isProcessed && !patch.processedAt) {
      patch.processedAt = new Date().toISOString();
    }

    db.applications[idx] = { ...prev, ...patch, updatedAt: new Date().toISOString() };
    const success = writeDB(db);
    if (!success) return res.status(500).json({ error: 'Failed to update application' });

    res.json({
      message: 'Application updated successfully',
      application: db.applications[idx]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Delete application
app.delete('/api/applications/:id', (req, res) => {
  try {
    const db = readDB();
    if (!db.applications) db.applications = [];
    const before = db.applications.length;
    db.applications = db.applications.filter(a => a.id !== req.params.id);
    const after = db.applications.length;
    const success = writeDB(db);
    if (!success) return res.status(500).json({ error: 'Failed to delete application' });
    if (before === after) return res.status(404).json({ error: 'Application not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// ===== STATISTICS ROUTES =====

// Get statistics
app.get('/api/statistics', (req, res) => {
  try {
    const db = readDB();
    
    const stats = {
      totalUsers: db.users ? db.users.length : 0,
      totalNews: db.news ? db.news.length : 0,
      totalApplications: db.applications ? db.applications.length : 0,
      activeUsers: db.users ? db.users.filter(u => u.status === 'active').length : 0,
      ...db.statistics
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ===== ERROR HANDLING =====

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: {
      health: 'GET /api/health',
      users: 'GET /api/users',
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
      news: 'GET /api/news',
      applications: 'GET /api/applications',
      statistics: 'GET /api/statistics'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// ===== SERVER STARTUP =====

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('🚀 === PERGUNU EXPRESS API SERVER ===');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log('📋 Available endpoints:');
    console.log('  GET  /api/health - Health check');
    console.log('  GET  /api/users - Get all users');
    console.log('  POST /api/auth/login - User login');
    console.log('  POST /api/auth/register - User registration');
    console.log('  GET  /api/news - Get all news');
    console.log('  GET  /api/applications - Get applications');
    console.log('  GET  /api/statistics - Get statistics');
    console.log('\n✨ Ready for requests!\n');
  });
}

// Export for Vercel
export default app;
