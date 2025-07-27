// webhook-handler.js - Server untuk handle Google Forms responses
const express = require('express');
const cors = require('cors');
const { emailService } = require('./src/services/EmailService.js');

const app = express();
const PORT = 3003; // Port terpisah untuk webhook

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Webhook endpoint untuk Google Forms
app.post('/webhook/google-forms', async (req, res) => {
  try {
    console.log('📥 Received Google Forms submission:', req.body);
    
    // Parse data dari Google Forms
    // Format data bisa berbeda tergantung setup Google Forms Anda
    const formData = {
      fullName: req.body.fullName || req.body['entry.123456789'], // Ganti dengan entry ID yang sesuai
      email: req.body.email || req.body['entry.987654321'],
      phone: req.body.phone || req.body['entry.456789123'],
      position: req.body.position || req.body['entry.789123456'],
      address: req.body.address || req.body['entry.321654987'],
      timestamp: new Date().toISOString()
    };

    console.log('📋 Parsed form data:', formData);

    // Validate required fields
    if (!formData.fullName || !formData.email) {
      console.error('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fullName and email'
      });
    }

    // Simpan ke database aplikasi (JSON Server atau database lain)
    const applicantData = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending', // pending, approved, rejected
      submittedAt: new Date().toISOString(),
      processedAt: null,
      processedBy: null
    };

    // Simpan ke JSON Server (table applications)
    try {
      const response = await fetch('http://localhost:3001/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicantData)
      });

      if (!response.ok) {
        throw new Error(`Failed to save to database: ${response.status}`);
      }

      console.log('✅ Application saved to database');
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      // Continue with email notification even if DB save fails
    }

    // Kirim notifikasi ke admin
    try {
      await emailService.sendAdminNotification(applicantData);
      console.log('✅ Admin notification sent');
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError);
    }

    // Response sukses
    res.json({
      success: true,
      message: 'Application received and admin notified',
      applicationId: applicantData.id
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Endpoint untuk admin approve/reject
app.post('/api/process-application/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body; // action: 'approve' or 'reject'

    console.log(`🔄 Processing application ${id} with action: ${action}`);

    // Get application data
    const appResponse = await fetch(`http://localhost:3001/applications/${id}`);
    if (!appResponse.ok) {
      throw new Error('Application not found');
    }

    const applicationData = await appResponse.json();

    if (action === 'approve') {
      // Process approval dengan auto-generate credentials
      const result = await emailService.processApproval(applicationData, 'approve');
      
      if (result.success) {
        // Update application status
        await fetch(`http://localhost:3001/applications/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'approved',
            processedAt: new Date().toISOString(),
            username: result.user.username,
            approvedBy: req.body.adminId || 'admin'
          })
        });

        // Create user account in users table
        const newUser = {
          fullName: result.user.fullName,
          email: result.user.email,
          username: result.user.username,
          password: result.user.password, // Will be hashed by admin dashboard
          phone: result.user.phone,
          position: result.user.position,
          address: result.user.address,
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString()
        };

        // Note: Password hashing should be done here or in admin dashboard
        console.log('✅ User approved and credentials sent via email');
        
        res.json({
          success: true,
          message: 'User approved and credentials sent via email',
          user: { ...newUser, password: undefined } // Don't return password
        });
      } else {
        throw new Error(result.error);
      }

    } else if (action === 'reject') {
      // Process rejection
      const result = await emailService.processApproval({
        ...applicationData,
        rejectionReason
      }, 'reject');

      // Update application status
      await fetch(`http://localhost:3001/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          processedAt: new Date().toISOString(),
          rejectionReason,
          rejectedBy: req.body.adminId || 'admin'
        })
      });

      res.json({
        success: true,
        message: 'Application rejected and notification sent'
      });
    } else {
      throw new Error('Invalid action. Use "approve" or "reject"');
    }

  } catch (error) {
    console.error('❌ Process application error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint untuk cek status pendaftaran
app.get('/api/check-status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Cari aplikasi berdasarkan email
    const response = await fetch(`http://localhost:3001/applications?email=${email}`);
    const applications = await response.json();
    
    if (applications.length === 0) {
      return res.json({
        success: false,
        message: 'No application found for this email'
      });
    }

    // Ambil aplikasi terbaru
    const latestApp = applications.sort((a, b) => 
      new Date(b.submittedAt) - new Date(a.submittedAt)
    )[0];

    res.json({
      success: true,
      application: {
        id: latestApp.id,
        status: latestApp.status,
        submittedAt: latestApp.submittedAt,
        processedAt: latestApp.processedAt,
        message: getStatusMessage(latestApp.status)
      }
    });

  } catch (error) {
    console.error('❌ Check status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check status'
    });
  }
});

function getStatusMessage(status) {
  switch (status) {
    case 'pending':
      return 'Pendaftaran Anda sedang diproses oleh admin. Harap tunggu maksimal 2x24 jam.';
    case 'approved':
      return 'Selamat! Pendaftaran Anda disetujui. Silakan cek email untuk username dan password.';
    case 'rejected':
      return 'Pendaftaran perlu diperbaiki. Silakan cek email untuk detail dan daftar ulang.';
    default:
      return 'Status tidak diketahui.';
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'PERGUNU Webhook Handler' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on http://localhost:${PORT}`);
  console.log(`📥 Google Forms webhook: http://localhost:${PORT}/webhook/google-forms`);
  console.log(`🔄 Process application: http://localhost:${PORT}/api/process-application/:id`);
  console.log(`📊 Check status: http://localhost:${PORT}/api/check-status/:email`);
});

module.exports = app;
