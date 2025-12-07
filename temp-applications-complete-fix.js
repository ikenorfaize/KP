// ===================================
// APPLICATION ROUTES
// ===================================

import express from 'express';
import { getCollection, addDocument, updateDocument, deleteDocument, findOne, findMany, saveCollection } from '../utils/database.js';
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
    
    // Try to find by string ID first, then integer
    let application = findOne('applications', { id });
    if (!application) {
      application = findOne('applications', { id: parseInt(id) });
    }

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

// Update application status (admin only) - FIXED to support both string and integer IDs
router.put('/:id/status', requireAuth, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, username } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json(errorResponse('Invalid status'));
    }

    console.log(`📝 Updating application ${id} to status: ${status}`);

    // Get all applications
    const allApplications = getCollection('applications');
    
    // Find application by ID (support both string and integer)
    const appIndex = allApplications.findIndex(app => 
      app.id === id || app.id === parseInt(id) || String(app.id) === String(id)
    );

    if (appIndex === -1) {
      console.error(`❌ Application not found: ${id}`);
      return res.status(404).json(errorResponse('Application not found'));
    }

    // Update the application
    const updates = {
      status,
      processedAt: new Date().toISOString(),
      processedBy: req.user.username || req.user.email || 'admin'
    };

    if (rejectionReason) {
      updates.rejectionReason = rejectionReason;
    }

    if (username) {
      updates.username = username;
    }

    // Apply updates
    allApplications[appIndex] = {
      ...allApplications[appIndex],
      ...updates
    };

    // Save to database
    if (!saveCollection('applications', allApplications)) {
      throw new Error('Failed to save updated application');
    }

    console.log(`✅ Application ${id} updated successfully`);

    res.json(successResponse(allApplications[appIndex], 'Application status updated'));
  } catch (error) {
    console.error('❌ Update application status error:', error);
    res.status(500).json(errorResponse('Failed to update application', error));
  }
});

// Delete application - FIXED to support both string and integer IDs
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ Deleting application: ${id}`);

    // Get all applications
    const allApplications = getCollection('applications');
    
    // Find application by ID (support both string and integer)
    const appIndex = allApplications.findIndex(app => 
      app.id === id || app.id === parseInt(id) || String(app.id) === String(id)
    );

    if (appIndex === -1) {
      console.error(`❌ Application not found: ${id}`);
      return res.status(404).json(errorResponse('Application not found'));
    }

    const application = allApplications[appIndex];

    // Only admin or owner can delete
    if (req.user.role !== 'admin' && application.userId !== req.user.id) {
      return res.status(403).json(errorResponse('Access denied'));
    }

    // Remove from array
    allApplications.splice(appIndex, 1);

    // Save to database
    if (!saveCollection('applications', allApplications)) {
      throw new Error('Failed to save after deletion');
    }

    console.log(`✅ Application ${id} deleted successfully`);

    res.json(successResponse({ id }, 'Application deleted'));
  } catch (error) {
    console.error('❌ Delete application error:', error);
    res.status(500).json(errorResponse('Failed to delete application', error));
  }
});

export default router;
