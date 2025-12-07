// ===================================
// USER ROUTES
// ===================================

import express from 'express';
import bcrypt from 'bcrypt';
import { getCollection, updateDocument, deleteDocument, addDocument } from '../utils/database.js';
import { successResponse, errorResponse } from '../utils/helpers.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { isValidEmail } from '../utils/helpers.js';

const router = express.Router();

// Create user (admin only) - Manual user creation
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, fullName, position, address, phone, role, status } = req.body;

    // Validation
    if (!username || !email || !password || !fullName) {
      return res.status(400).json(errorResponse('Username, email, password, and fullName are required'));
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(errorResponse('Invalid email format'));
    }

    if (password.length < 6) {
      return res.status(400).json(errorResponse('Password must be at least 6 characters'));
    }

    // Check if user exists
    const users = getCollection('users');
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json(errorResponse('Username already exists'));
    }

    const existingEmail = users.find(u => u.email === email);
    if (existingEmail) {
      return res.status(400).json(errorResponse('Email already registered'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      fullName,
      position: position || 'Staff',
      address: address || '',
      phone: phone || '',
      role: role || 'user',
      status: status || 'active',
      certificates: [],
      downloads: 0,
      lastDownload: null,
      downloadHistory: [],
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0F7536&color=fff`,
      createdAt: new Date().toISOString()
    };

    const savedUser = addDocument('users', newUser);

    if (!savedUser) {
      return res.status(500).json(errorResponse('Failed to create user'));
    }

    const { password: _, ...userWithoutPassword } = savedUser;
    res.status(201).json(successResponse(userWithoutPassword, 'User created successfully'));
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json(errorResponse('Failed to create user', error));
  }
});

// Get all users (admin only)
router.get('/', requireAuth, requireAdmin, (req, res) => {
  try {
    const users = getCollection('users').map(({ password, ...user }) => user);
    res.json(users);
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch users', error));
  }
});

// Get user by ID
router.get('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const users = getCollection('users');
    // Support both string and integer ID formats
    const user = users.find(u => u.id === id || u.id === parseInt(id));
    
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    // Remove password
    const { password, ...userWithoutPassword } = user;
    
    // Only admin can view other users
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json(errorResponse('Access denied'));
    }
    
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch user', error));
  }
});

// Update user (admin or own profile)
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Prevent updating password through this endpoint
    delete updates.password;
    delete updates.id;
    delete updates.createdAt;
    
    // Support both string and integer ID
    const users = getCollection('users');
    const user = users.find(u => u.id === id || u.id === parseInt(id));
    
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    // Only admin can update other users
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json(errorResponse('Access denied'));
    }
    
    // Only admin can change role
    if (updates.role && req.user.role !== 'admin') {
      delete updates.role;
    }
    
    const updatedUser = updateDocument('users', user.id, updates);
    
    if (!updatedUser) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json(successResponse(userWithoutPassword, 'User updated successfully'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update user', error));
  }
});

// PATCH user (partial update for certificates, etc)
router.patch('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Prevent updating password through this endpoint
    delete updates.password;
    delete updates.id;
    delete updates.createdAt;
    
    // Support both string and integer ID
    const users = getCollection('users');
    const user = users.find(u => u.id === id || u.id === parseInt(id));
    
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    // Only admin can update other users
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json(errorResponse('Access denied'));
    }
    
    // Only admin can change role
    if (updates.role && req.user.role !== 'admin') {
      delete updates.role;
    }
    
    const updatedUser = updateDocument('users', user.id, updates);
    
    if (!updatedUser) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json(successResponse(userWithoutPassword, 'User updated successfully'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update user', error));
  }
});

// Delete user (admin only)
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    // Support both string and integer ID
    const users = getCollection('users');
    const user = users.find(u => u.id === id || u.id === parseInt(id));
    
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    const deleted = deleteDocument('users', user.id);
    
    if (!deleted) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    res.json(successResponse({ id }, 'User deleted successfully'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete user', error));
  }
});

// Approve user (admin only)
router.post('/:id/approve', requireAuth, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    // Support both string and integer ID
    const users = getCollection('users');
    const user = users.find(u => u.id === id || u.id === parseInt(id));
    
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    const updatedUser = updateDocument('users', user.id, {
      status: 'approved'
    });
    
    if (!updatedUser) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json(successResponse(userWithoutPassword, 'User approved'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to approve user', error));
  }
});

// Reject user (admin only)
router.post('/:id/reject', requireAuth, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    // Support both string and integer ID
    const users = getCollection('users');
    const user = users.find(u => u.id === id || u.id === parseInt(id));
    
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    const updatedUser = updateDocument('users', user.id, {
      status: 'rejected'
    });
    
    if (!updatedUser) {
      return res.status(404).json(errorResponse('User not found'));
    }
    
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json(successResponse(userWithoutPassword, 'User rejected'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to reject user', error));
  }
});

export default router;
