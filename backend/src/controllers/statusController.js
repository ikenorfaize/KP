// Status Controller - Mengecek status pendaftaran berdasarkan email
import { getCollection } from '../utils/database.js';

/**
 * Cek status pendaftaran berdasarkan email
 * GET /api/check-status/:email
 */
export const checkApplicationStatus = (req, res) => {
  try {
    const { email } = req.params;

    console.log(`🔍 Checking status for email: ${email}`);

    // Validasi email parameter
    if (!email || email.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Email tidak boleh kosong'
      });
    }

    // Decode email dari URL encoding
    const decodedEmail = decodeURIComponent(email).toLowerCase().trim();

    // Ambil semua applications dari database
    const applications = getCollection('applications');

    // Cari aplikasi berdasarkan email (case-insensitive)
    const application = applications.find(app => 
      app.email && app.email.toLowerCase().trim() === decodedEmail
    );

    // Jika tidak ditemukan
    if (!application) {
      console.log(`❌ Application not found for email: ${decodedEmail}`);
      return res.status(404).json({
        success: false,
        message: 'Email tidak terdaftar dalam sistem kami. Pastikan Anda telah melakukan pendaftaran.',
        application: null
      });
    }

    console.log(`✅ Application found:`, {
      id: application.id,
      email: application.email,
      status: application.status
    });

    // Kontak admin - bisa diubah sesuai kebutuhan
    const adminContact = '082143006775'; // Nomor WhatsApp admin

    // Tentukan pesan berdasarkan status
    let message = '';
    let statusInfo = {
      ...application,
      adminContact: null
    };

    switch (application.status) {
      case 'pending':
        message = 'Pendaftaran Anda sedang dalam proses review oleh admin. Mohon tunggu untuk update selanjutnya.';
        break;
      
      case 'approved':
        message = `Selamat! Pendaftaran Anda telah disetujui. Silakan hubungi admin di WhatsApp: ${adminContact}`;
        statusInfo.adminContact = adminContact;
        break;
      
      case 'rejected':
        message = 'Pendaftaran Anda ditolak. Silakan periksa catatan dari admin dan lakukan pendaftaran ulang jika diperlukan.';
        break;
      
      default:
        message = 'Status pendaftaran tidak dikenali.';
    }

    // Return response sukses
    return res.status(200).json({
      success: true,
      message: message,
      application: {
        id: application.id,
        email: application.email,
        fullName: application.fullName || application.name || 'N/A',
        position: application.position || 'N/A',
        school: application.school || 'N/A',
        status: application.status,
        submittedAt: application.submittedAt || application.createdAt || new Date().toISOString(),
        processedAt: application.processedAt || null,
        notes: application.notes || '',
        adminContact: statusInfo.adminContact
      }
    });

  } catch (error) {
    console.error('❌ Error in checkApplicationStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengecek status. Silakan coba lagi.',
      error: error.message
    });
  }
};
