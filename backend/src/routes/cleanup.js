// ===================================
// DATABASE CLEANUP ROUTES
// ===================================

import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import cleanDatabase from '../utils/cleanDatabase.js';
import { successResponse, errorResponse } from '../utils/helpers.js';
import { readDB } from '../utils/database.js';

const router = express.Router();

/**
 * Manual cleanup database
 * Endpoint untuk admin membersihkan database secara manual
 */
router.post('/cleanup', requireAuth, requireAdmin, (req, res) => {
  try {
    console.log('🔧 Admin memicu pembersihan database manual...');
    
    const result = cleanDatabase();
    
    if (result.success) {
      return res.json(successResponse(result.stats, 'Database berhasil dibersihkan'));
    } else {
      return res.status(500).json(errorResponse('Gagal membersihkan database', result.error));
    }
    
  } catch (error) {
    console.error('❌ Error cleanup database:', error);
    res.status(500).json(errorResponse('Gagal membersihkan database', error));
  }
});

/**
 * Get cleanup status/info
 */
router.get('/cleanup/info', requireAuth, requireAdmin, (req, res) => {
  try {
    const data = readDB();
    
    const info = {
      lastCleanup: data.metadata?.lastCleanup || 'Belum pernah dibersihkan',
      newsCount: data.news?.length || 0,
      usersCount: data.users?.length || 0,
      applicationsCount: data.applications?.length || 0,
      beasiswaCount: data.beasiswa?.length || 0
    };
    
    res.json(successResponse(info));
  } catch (error) {
    console.error('❌ Error get cleanup info:', error);
    res.status(500).json(errorResponse('Gagal mendapatkan info cleanup', error));
  }
});

export default router;
