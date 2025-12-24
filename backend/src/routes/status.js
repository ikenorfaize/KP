// Route untuk cek status pendaftaran berdasarkan email
import express from 'express';
import { checkApplicationStatus } from '../controllers/statusController.js';

const router = express.Router();

// GET /api/check-status/:email - Cek status pendaftaran berdasarkan email
router.get('/:email', checkApplicationStatus);

export default router;
