// ===================================
// PASSWORD CHECK ROUTE (Backend)
// ===================================
// API endpoint to check if password already exists in system

import express from 'express';
import bcrypt from 'bcryptjs';
import { getCollection } from '../utils/database.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

const router = express.Router();

/**
 * POST /api/auth/check-password
 * Check if a password already exists in the system
 * Used by frontend before creating new users to prevent duplicate passwords
 */
router.post('/check-password', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || !password.trim()) {
      return res.status(400).json(errorResponse('Password is required'));
    }

    // Get all users
    const users = getCollection('users');

    // Check against each user's password
    for (const user of users) {
      if (!user.password) continue;

      try {
        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (isMatch) {
          // Password exists - return username for better error message
          return res.json(successResponse({
            exists: true,
            username: user.username || 'unknown'
          }));
        }
      } catch (compareError) {
        // Skip if bcrypt compare fails for this user
        console.warn(`Failed to compare password for user ${user.username}:`, compareError.message);
        continue;
      }
    }

    // Password is unique
    res.json(successResponse({
      exists: false,
      username: null
    }));

  } catch (error) {
    console.error('❌ Error checking password:', error);
    res.status(500).json(errorResponse('Failed to check password', error));
  }
});

export default router;
