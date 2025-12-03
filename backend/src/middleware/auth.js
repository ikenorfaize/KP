// ===================================
// AUTHENTICATION MIDDLEWARE
// ===================================

import { findOne } from '../utils/database.js';

/**
 * Check if user is authenticated (basic session check)
 */
export const requireAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  const user = findOne('users', { id: parseInt(userId) });
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid user session'
    });
  }
  
  req.user = user;
  next();
};

/**
 * Check if user is admin
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

/**
 * Optional auth - attach user if authenticated
 */
export const optionalAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  
  if (userId) {
    const user = findOne('users', { id: parseInt(userId) });
    if (user) {
      req.user = user;
    }
  }
  
  next();
};
