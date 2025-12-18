// ===================================
// BEASISWA ROUTES
// ===================================

import express from 'express';
import {
  getAllBeasiswa,
  getBeasiswaById,
  getBeasiswaByKategori,
  createBeasiswa,
  updateBeasiswa,
  deleteBeasiswa
} from '../controllers/beasiswaController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBeasiswa);
router.get('/kategori/:kategori', getBeasiswaByKategori);
router.get('/:id', getBeasiswaById);

// Protected routes (admin only)
router.post('/', requireAuth, requireAdmin, createBeasiswa);
router.put('/:id', requireAuth, requireAdmin, updateBeasiswa);
router.delete('/:id', requireAuth, requireAdmin, deleteBeasiswa);

export default router;
