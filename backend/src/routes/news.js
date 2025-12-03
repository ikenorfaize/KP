// ===================================
// NEWS ROUTES
// ===================================

import express from 'express';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  setFeaturedNews,
  getFeaturedNews,
  incrementViews
} from '../controllers/newsController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllNews);
router.get('/featured', getFeaturedNews);
router.get('/:id', getNewsById);
router.post('/:id/view', incrementViews);

// Protected routes (admin only)
router.post('/', requireAuth, requireAdmin, createNews);
router.put('/:id', requireAuth, requireAdmin, updateNews);
router.delete('/:id', requireAuth, requireAdmin, deleteNews);
router.put('/:id/feature', requireAuth, requireAdmin, setFeaturedNews);

export default router;
