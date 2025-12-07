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

// Create application - PUBLIC endpoint for new member registrations
// No authentication required since new members don't have accounts yet
router.post('/', (req, res) => {
  try {
    const {
      // For membership applications (from RegisterForm)
      fullName,
      email,
      phone,
      position,
      school,
      pw,
      pc,
      experience,
      education,
      // For beasiswa applications
      beasiswaId,
      address,
      reason,
      documents,
      // Common fields
      status,
      submittedAt,
      processedAt,
      credentials
    } = req.body;

    // Validate required fields for membership application
    if (!fullName || !email) {
      return res.status(400).json(errorResponse('Full name and email are required'));
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(errorResponse('Invalid email format'));
    }

    // Create application data
    const applicationData = {
      fullName,
      email,
      phone: phone || '',
      position: position || '',
      school: school || '',
      pw: pw || '',
      pc: pc || '',
      experience: experience || '',
      education: education || '',
      status: status || 'pending',
      submittedAt: submittedAt || new Date().toISOString(),
      processedAt: processedAt || null,
      credentials: credentials || null,
      // For beasiswa applications
      ...(beasiswaId && {
        beasiswaId: parseInt(beasiswaId),
        address: address || '',
        reason: reason || '',
        documents: documents || []
      })
    };

    const newApplication = addDocument('applications', applicationData);

    console.log(`✅ Public application created: ${newApplication.id} (${fullName})`);

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

    res.json(successResponse({ id }, 'Application deleted'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete application', error));
  }
});

export default router;
