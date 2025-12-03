// ===================================
// AUTH ROUTES
// ===================================

import express from 'express';
import { login, register, changePassword, getCurrentUser } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.post('/change-password', requireAuth, changePassword);
router.get('/me', requireAuth, getCurrentUser);

export default router;
