// ===================================
// USER ROUTES
// ===================================

import express from 'express';
import { getCollection, updateDocument, deleteDocument } from '../utils/database.js';
import { successResponse, errorResponse } from '../utils/helpers.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

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
    const user = users.find(u => u.id === parseInt(id));
    
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
    
    // Only admin can update other users
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json(errorResponse('Access denied'));
    }
    
    // Only admin can change role
    if (updates.role && req.user.role !== 'admin') {
      delete updates.role;
    }
    
    const updatedUser = updateDocument('users', parseInt(id), updates);
    
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
    
    const deleted = deleteDocument('users', parseInt(id));
    
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
    
    const updatedUser = updateDocument('users', parseInt(id), {
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
    
    const updatedUser = updateDocument('users', parseInt(id), {
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
