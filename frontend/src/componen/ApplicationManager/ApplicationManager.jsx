// ApplicationManager Component - Komponen untuk mengelola aplikasi pendaftaran
// Digunakan di AdminDashboard untuk review, approve, dan reject pendaftaran
import React, { useState, useEffect } from 'react';
// import { emailService } from '../../services/EmailService';  // Service untuk mengirim email notifikasi (unused for now)
import { ApplicationService } from '../../services/ApplicationService';
import './ApplicationManager.css';
import { usePendingApplications } from '../../context/PendingApplicationsContext';

// Optional prop onPendingCountChange: function(count:number) => void
// Optional props:
// - onPendingCountChange(count)
// - onUsersChanged(): notify parent to refresh users list after approval
const ApplicationManager = ({ onPendingCountChange, onUsersChanged }) => {
  const { setPendingCount } = usePendingApplications() || {};
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
  const [deletingId, setDeletingId] = useState(null);

  // Ref untuk memaksa styling hijau



  // Effect untuk fetch aplikasi saat component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Fungsi untuk mengambil data aplikasi dari API atau demo data
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await ApplicationService.getApplications();
      setApplications(data);
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

      // Generate random credentials
      const creds = {
        username: (application.fullName || 'user')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '') + '_' + Math.floor(Math.random() * 1000),
        password: 'Pg' + Math.random().toString(36).slice(2, 8) + Math.floor(Math.random()*90+10)
      };

      // Create real user, then approve the application (server-backed if available)
  const { application: updatedApp, user } = await ApplicationService.approveAndRegister(application, creds);

      // Update local state to reflect persisted data
      setApplications(prev => prev.map(app => app.id === application.id ? { ...app, ...updatedApp } : app));

  // Notify parent to refresh users if needed
  try { if (typeof onUsersChanged === 'function') onUsersChanged(); } catch (notificationError) {
    console.warn('Failed to notify parent of user changes:', notificationError);
  }

  // User feedback with final username
      const finalUser = user || { username: updatedApp?.username || creds.username };
      alert(`✅ ${application.fullName} disetujui.\n\n🔑 Akun Pengguna:\nUsername: ${finalUser.username}\nPassword: ${creds.password}`);
      
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

  // Persist rejection via service
  const updated = await ApplicationService.rejectApplication(selectedApp.id, rejectionReason.trim());
  // Update local state with server/localStorage response
  setApplications(prev => prev.map(app => app.id === selectedApp.id ? { ...app, ...updated } : app));

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

  // Inform parent about pending count when data changes (to sync dashboard tiles)
  useEffect(() => {
    if (typeof onPendingCountChange === 'function') {
      const pendingCount = pendingApplications.length;
      try {
        onPendingCountChange(pendingCount);
      } catch (e) {
        console.warn('onPendingCountChange callback error:', e);
      }
    }
    // Also update shared context if available
    if (setPendingCount) {
      const pendingCount = pendingApplications.length;
      setPendingCount(pendingCount);
    }
  }, [pendingApplications.length, onPendingCountChange, setPendingCount]);

  // Delete processed application from history
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus entri riwayat ini? Tindakan tidak dapat dibatalkan.')) return;
    try {
      setDeletingId(id);
      await ApplicationService.deleteApplication(id);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      alert('Gagal menghapus riwayat: ' + (e?.message || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

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
            <div className="stat-item pending-review">
              <div 
                className="stat-number pending-review-number"
              >
                {pendingApplications.length}
              </div>
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
                  <p><strong>📅 Submitted:</strong> {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('id-ID') : '-'}</p>
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
                    <td>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('id-ID') : '-'}</td>
                    <td>
                      {app.processedAt ? new Date(app.processedAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-reject"
                        onClick={() => handleDelete(app.id)}
                        disabled={deletingId === app.id}
                        title="Hapus dari riwayat"
                      >
                        {deletingId === app.id ? 'Menghapus…' : '🗑️ Hapus'}
                      </button>
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
