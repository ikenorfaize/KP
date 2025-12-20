// ===================================
// APPLICATION ROUTES
// ===================================

import express from 'express';
import { getCollection, addDocument, updateDocument, deleteDocument, findOne, findMany } from '../utils/database.js';
import { successResponse, errorResponse } from '../utils/helpers.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all applications (admin sees all, user sees their own)
router.get('/', requireAuth, (req, res) => {
  try {
    const applications = getCollection('applications');
    
    if (req.user.role === 'admin') {
      return res.json(applications);
    }
    
    // Filter by user
    const userApplications = applications.filter(app => app.userId === req.user.id);
    res.json(userApplications);
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch applications', error));
  }
});

// Get application by ID
router.get('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const application = findOne('applications', { id: parseInt(id) });
    
    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }
    
    // Only admin or owner can view
    if (req.user.role !== 'admin' && application.userId !== req.user.id) {
      return res.status(403).json(errorResponse('Access denied'));
    }
    
    res.json(application);
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch application', error));
  }
});

// Create application (public - does not require authentication)
router.post('/', (req, res) => {
  try {
    const {
      beasiswaId,
      fullName,
      email,
      phone,
      address,
      position,
      school,
      education,
      experience,
      pw,
      pc,
      reason,
      documents,
      submittedAt
    } = req.body;

    // Validation: Required fields
    if (!fullName || !email) {
      return res.status(400).json(errorResponse('Required fields missing'));
    }

    // Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(errorResponse('Invalid email format'));
    }

    // Validation: Email uniqueness - Check if email already exists in active applications
    const existingApplication = findOne('applications', { email: email.toLowerCase() });
    if (existingApplication) {
      console.log(`⚠️ Duplicate email attempt: ${email}`);
      return res.status(409).json(errorResponse('Email already used. Please use another email.'));
    }

    const newApplication = addDocument('applications', {
      userId: req.user?.id || null,
      beasiswaId: beasiswaId ? parseInt(beasiswaId) : null,
      fullName,
      email: email.toLowerCase(), // Store in lowercase for case-insensitive comparison
      phone: phone || '',
      address: address || '',
      position: position || '',
      school: school || '',
      education: education || '',
      experience: experience || '',
      pw: pw || '',
      pc: pc || '',
      reason: reason || '',
      documents: documents || [],
      status: 'pending',
      submittedAt: submittedAt || new Date().toISOString()
    });

    console.log(`✅ Application created: ${newApplication.id}`);

    res.status(201).json(successResponse(newApplication, 'Application submitted successfully'));
  } catch (error) {
    console.error('❌ Create application error:', error);
    res.status(500).json(errorResponse('Failed to create application', error));
  }
});

// Update application status (admin only)
router.put('/:id/status', requireAuth, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json(errorResponse('Invalid status'));
    }
    
    // Try string ID first, then integer ID
    let updatedApplication = updateDocument('applications', id, { status });
    if (!updatedApplication) {
      updatedApplication = updateDocument('applications', parseInt(id), { status });
    }
    
    if (!updatedApplication) {
      return res.status(404).json(errorResponse('Application not found'));
    }
    
    res.json(successResponse(updatedApplication, 'Application status updated'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update application', error));
  }
});

// Delete application
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const application = findOne('applications', { id: parseInt(id) });
    
    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }
    
    // Only admin or owner can delete
    if (req.user.role !== 'admin' && application.userId !== req.user.id) {
      return res.status(403).json(errorResponse('Access denied'));
    }
    
    const deleted = deleteDocument('applications', parseInt(id));
    
    if (!deleted) {
      return res.status(404).json(errorResponse('Application not found'));
    }
    
    console.log(`✅ Application deleted (email ${application.email} now available): ${id}`);
    
    res.json(successResponse({ id, email: application.email }, 'Application deleted'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete application', error));
  }
});

export default router;
