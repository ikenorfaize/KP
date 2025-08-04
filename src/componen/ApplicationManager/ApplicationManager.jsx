// ApplicationManager Component - Komponen untuk mengelola aplikasi pendaftaran
// Digunakan di AdminDashboard untuk review, approve, dan reject pendaftaran
import React, { useState, useEffect } from 'react';
import { emailService } from '../../services/EmailService';  // Service untuk mengirim email notifikasi
import './ApplicationManager.css';

const ApplicationManager = () => {
  // State untuk menyimpan daftar aplikasi pendaftaran
  const [applications, setApplications] = useState([]);
  
  // State untuk loading indicator saat fetch data
  const [loading, setLoading] = useState(true);
  
  // State untuk menunjukkan aplikasi mana yang sedang diproses (approve/reject)
  const [processing, setProcessing] = useState(null);
  
  // State untuk alasan penolakan yang diinput admin
  const [rejectionReason, setRejectionReason] = useState('');
  
  // State untuk mengontrol tampilan modal penolakan
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  // State untuk menyimpan aplikasi yang dipilih untuk aksi
  const [selectedApp, setSelectedApp] = useState(null);

  // Effect untuk fetch aplikasi saat component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Fungsi untuk mengambil data aplikasi dari API atau demo data
  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Coba ambil data dari API server terlebih dahulu
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/applications`);
        if (response.ok) {
          const data = await response.json();
          setApplications(data);  // Set data dari API jika berhasil
          return;
        }
      } catch (apiError) {
        console.log('API tidak tersedia, menggunakan demo data');
      }
      
      // Fallback ke demo data jika API tidak tersedia
      const demoApplications = [
        {
          id: '1',                                    // ID unik aplikasi
          fullName: 'Ahmad Fajar Rahman',             // Nama lengkap pendaftar
          email: 'fajar.demo@gmail.com',              // Email untuk komunikasi
          phone: '081234567890',                      // Nomor telepon
          position: 'Guru Matematika',                // Posisi yang dilamar
          address: 'Jl. Pendidikan No. 123, Jakarta', // Alamat lengkap
          status: 'pending',                          // Status: pending/approved/rejected
          submittedAt: '2025-01-27T08:30:00Z',        // Tanggal submit
          processedAt: null,                          // Tanggal diproses (null jika belum)
          processedBy: null,                          // Admin yang memproses (null jika belum)
          rejectionReason: null,                      // Alasan penolakan (null jika tidak ditolak)
          username: null                              // Username yang akan diberikan (null jika belum approved)
        },
        {
          id: '2',                                    // ID aplikasi kedua
          fullName: 'Siti Nurhaliza',                 // Nama pendaftar kedua
          email: 'siti.pending@gmail.com',            // Email dengan keyword 'pending'
          phone: '081234567891',                      // Nomor telepon
          position: 'Guru Bahasa Indonesia',          // Posisi yang dilamar
          address: 'Jl. Bahasa No. 456, Bandung',     // Alamat lengkap
          status: 'pending',                          // Status: masih menunggu review
          submittedAt: '2025-01-27T09:15:00Z',        // Tanggal submit
          processedAt: null,                          // Belum diproses
          processedBy: null,                          // Belum ada admin yang handle
          rejectionReason: null,                      // Tidak ada alasan penolakan
          username: null                              // Belum dibuat username
        },
        {
          id: '3',                                    // ID aplikasi ketiga
          fullName: 'Budi Santoso',                   // Nama pendaftar yang sudah disetujui
          email: 'budi.approved@gmail.com',           // Email dengan keyword 'approved'
          phone: '081234567892',                      // Nomor telepon
          position: 'Guru Fisika',                    // Posisi yang dilamar
          address: 'Jl. Fisika No. 789, Surabaya',    // Alamat lengkap
          status: 'approved',                         // Status: sudah disetujui
          submittedAt: '2025-01-26T10:00:00Z',        // Tanggal submit
          processedAt: '2025-01-26T15:30:00Z',        // Tanggal diproses
          processedBy: 'admin',                       // Diproses oleh admin
          rejectionReason: null,                      // Tidak ada alasan penolakan
          username: 'budi_santoso_123'                // Username yang diberikan
        },
        {
          id: '4',                                    // ID aplikasi keempat
          fullName: 'Maya Dewi',                      // Nama pendaftar yang ditolak
          email: 'maya.rejected@gmail.com',           // Email dengan keyword 'rejected'
          phone: '081234567893',                      // Nomor telepon
          position: 'Guru Kimia',                     // Posisi yang dilamar
          address: 'Jl. Kimia No. 321, Yogyakarta',   // Alamat lengkap
          status: 'rejected',                         // Status: ditolak
          submittedAt: '2025-01-25T11:00:00Z',        // Tanggal submit
          processedAt: '2025-01-25T16:45:00Z',
          processedBy: 'admin',
          rejectionReason: 'Data ijazah tidak lengkap. Mohon upload ijazah yang jelas dan sertifikat mengajar.',
          username: null
        }
      ];
      
      setApplications(demoApplications);
      
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Gagal memuat data pendaftaran');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk approve aplikasi pendaftaran
  const handleApprove = async (application) => {
    try {
      setProcessing(application.id); // Set loading state untuk mencegah double click

      // Demo mode: Simulate approval process
      console.log('🔄 DEMO: Processing approval for', application.fullName);
      
      // Simulate API delay untuk memberikan feedback visual
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate demo credentials untuk user yang disetujui
      const demoCredentials = {
        username: application.fullName.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000),
        password: 'Demo' + Math.floor(Math.random() * 10000)
      };
      
      console.log('📧 DEMO EMAIL SENT TO:', application.email);
      console.log('🔑 Demo Credentials:', demoCredentials);
      
      // Update local state dengan status approved dan metadata
      setApplications(prev => prev.map(app => 
        app.id === application.id 
          ? { 
              ...app, 
              status: 'approved', 
              processedAt: new Date().toISOString(),
              username: demoCredentials.username 
            }
          : app
      ));
      
      // Tampilkan konfirmasi berhasil dengan credentials
      alert(`✅ DEMO: ${application.fullName} berhasil disetujui!\n\n🔑 Demo Credentials:\nUsername: ${demoCredentials.username}\nPassword: ${demoCredentials.password}\n\n📧 Dalam mode production, credentials akan dikirim ke: ${application.email}`);
      
    } catch (error) {
      console.error('Error approving application:', error);
      alert(`❌ Gagal menyetujui pendaftaran: ${error.message}`);
    } finally {
      setProcessing(null); // Reset processing state
    }
  };

  // Handler untuk inisialisasi reject aplikasi
  const handleReject = (application) => {
    setSelectedApp(application);    // Set aplikasi yang dipilih untuk ditolak
    setShowRejectModal(true);       // Show modal input alasan penolakan
  };

  // === REJECTION WORKFLOW ===
  
  // Konfirmasi penolakan aplikasi dengan alasan
  const confirmReject = async () => {
    // Validation: pastikan alasan penolakan diisi
    if (!rejectionReason.trim()) {
      alert('Mohon isi alasan penolakan');
      return;
    }

    try {
      setProcessing(selectedApp.id); // Set loading state

      // === DEMO MODE SIMULATION ===
      console.log('🔄 DEMO: Processing rejection for', selectedApp.fullName);
      console.log('📝 Rejection reason:', rejectionReason);
      
      // Simulate API delay untuk realistic UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('📧 DEMO EMAIL SENT TO:', selectedApp.email);
      console.log('📄 Rejection email with reason sent');
      
      // === UPDATE APPLICATION STATUS ===
      // Update status aplikasi ke rejected dengan metadata dan alasan
      setApplications(prev => prev.map(app => 
        app.id === selectedApp.id 
          ? { 
              ...app, 
              status: 'rejected',                    // Status berubah ke rejected
              processedAt: new Date().toISOString(), // Timestamp diproses
              rejectionReason: rejectionReason.trim() // Alasan penolakan dari admin
            }
          : app
      ));

      // === USER FEEDBACK ===
      alert(`✅ DEMO: Pendaftaran ${selectedApp.fullName} ditolak.\n\n📧 Dalam mode production, email pemberitahuan dengan alasan penolakan akan dikirim ke: ${selectedApp.email}`);
      
      // === MODAL CLEANUP ===
      // Reset modal state setelah berhasil
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedApp(null);
      
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert(`❌ Gagal menolak pendaftaran: ${error.message}`);
    } finally {
      setProcessing(null); // Reset loading state
    }
  };

  // === UI UTILITIES ===
  
  // Function untuk generate status badge dengan warna dan icon yang sesuai
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge pending">⏳ Pending</span>;    // Orange badge untuk pending
      case 'approved':
        return <span className="badge approved">✅ Approved</span>;  // Green badge untuk approved
      case 'rejected':
        return <span className="badge rejected">❌ Rejected</span>;  // Red badge untuk rejected
      default:
        return <span className="badge unknown">❓ Unknown</span>;    // Gray badge untuk status tidak dikenal
    }
  };

  // === DATA FILTERING ===
  
  // Filter aplikasi berdasarkan status untuk UI grouping
  const pendingApplications = applications.filter(app => app.status === 'pending');     // Aplikasi menunggu review
  const processedApplications = applications.filter(app => app.status !== 'pending');  // Aplikasi yang sudah diproses

  // === LOADING STATE ===
  
  // Render loading state saat data masih di-fetch
  if (loading) {
    return (
      <div className="applications-loading">
        <div className="loading-spinner">Loading applications...</div>
      </div>
    );
  }

  // === MAIN COMPONENT RENDER ===
  
  return (
    <div className="application-manager">
      {/* === HEADER SECTION === */}
      <div className="applications-header">
        <h2>📝 Kelola Pendaftaran</h2>
        <div className="applications-actions">
          {/* Statistics cards untuk quick overview */}
          <div className="applications-stats">
            <div className="stat-item">
              <span className="stat-number">{pendingApplications.length}</span>
              <span className="stat-label">Menunggu Review</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{processedApplications.length}</span>
              <span className="stat-label">Sudah Diproses</span>
            </div>
          </div>
        </div>
      </div>

      {/* === PENDING APPLICATIONS SECTION === */}
      {/* Tampilkan aplikasi yang menunggu review dalam card format untuk easy action */}
      {pendingApplications.length > 0 && (
        <div className="applications-section">
          <h3>⏳ Pendaftaran Menunggu Review ({pendingApplications.length})</h3>
          <div className="applications-grid">
            {pendingApplications.map(app => (
              <div key={app.id} className="application-card pending">
                {/* Card header dengan nama dan status badge */}
                <div className="card-header">
                  <h4>{app.fullName}</h4>
                  {getStatusBadge(app.status)}
                </div>
                {/* Card body dengan detail informasi pendaftar */}
                <div className="card-body">
                  <p><strong>📧 Email:</strong> {app.email}</p>
                  <p><strong>📱 Phone:</strong> {app.phone}</p>
                  <p><strong>💼 Position:</strong> {app.position}</p>
                  <p><strong>📍 Address:</strong> {app.address}</p>
                  <p><strong>📅 Submitted:</strong> {new Date(app.submittedAt).toLocaleDateString('id-ID')}</p>
                </div>
                {/* Action buttons untuk approve/reject dengan loading state */}
                <div className="card-actions">
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(app)}
                    disabled={processing === app.id} // Disable saat processing
                  >
                    {processing === app.id ? '⏳ Processing...' : '✅ Approve'}
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(app)}
                    disabled={processing === app.id} // Disable saat processing
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === PROCESSED APPLICATIONS SECTION === */}
      {/* Tampilkan aplikasi yang sudah diproses dalam table format untuk history viewing */}
      {processedApplications.length > 0 && (
        <div className="applications-section">
          <h3>📋 Riwayat Pendaftaran ({processedApplications.length})</h3>
          <div className="applications-table">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Diproses</th>
                </tr>
              </thead>
              <tbody>
                {processedApplications.map(app => (
                  <tr key={app.id}>
                    <td>{app.fullName}</td>
                    <td>{app.email}</td>
                    <td>{app.position}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>{new Date(app.submittedAt).toLocaleDateString('id-ID')}</td>
                    <td>
                      {app.processedAt ? 
                        new Date(app.processedAt).toLocaleDateString('id-ID') : 
                        '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === EMPTY STATE === */}
      {/* Tampilkan pesan jika tidak ada aplikasi sama sekali */}
      {applications.length === 0 && (
        <div className="no-applications">
          <h3>📭 Belum Ada Pendaftaran</h3>
          <p>Ketika ada user yang mendaftar melalui Google Forms, data akan muncul di sini.</p>
        </div>
      )}

      {/* === REJECT MODAL === */}
      {/* Modal untuk input alasan penolakan dengan form validation */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal header dengan close button */}
            <div className="modal-header">
              <h3>❌ Tolak Pendaftaran</h3>
              <button onClick={() => setShowRejectModal(false)} className="close-btn">×</button>
            </div>
            {/* Modal body dengan informasi aplikasi dan form input */}
            <div className="modal-body">
              <p><strong>Nama:</strong> {selectedApp?.fullName}</p>
              <p><strong>Email:</strong> {selectedApp?.email}</p>
              
              {/* Form group untuk input alasan penolakan */}
              <div className="form-group">
                <label>Alasan Penolakan:</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Jelaskan alasan penolakan dan saran perbaikan..."
                  rows={4}
                  className="rejection-textarea"
                />
              </div>
            </div>
            {/* Modal actions dengan validation untuk submit button */}
            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button 
                onClick={confirmReject} 
                className="btn-reject" 
                disabled={!rejectionReason.trim()} // Disable jika alasan kosong
              >
                ❌ Tolak & Kirim Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManager;
