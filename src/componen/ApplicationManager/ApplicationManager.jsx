import React, { useState, useEffect } from 'react';
import { emailService } from '../../services/EmailService';
import './ApplicationManager.css';

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const response = await fetch('http://localhost:3001/applications');
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo data');
      }
      
      // Fallback to demo data
      const demoApplications = [
        {
          id: '1',
          fullName: 'Ahmad Fajar Rahman',
          email: 'fajar.demo@gmail.com',
          phone: '081234567890',
          position: 'Guru Matematika',
          address: 'Jl. Pendidikan No. 123, Jakarta',
          status: 'pending',
          submittedAt: '2025-01-27T08:30:00Z',
          processedAt: null,
          processedBy: null,
          rejectionReason: null,
          username: null
        },
        {
          id: '2',
          fullName: 'Siti Nurhaliza',
          email: 'siti.pending@gmail.com',
          phone: '081234567891',
          position: 'Guru Bahasa Indonesia',
          address: 'Jl. Bahasa No. 456, Bandung',
          status: 'pending',
          submittedAt: '2025-01-27T09:15:00Z',
          processedAt: null,
          processedBy: null,
          rejectionReason: null,
          username: null
        },
        {
          id: '3',
          fullName: 'Budi Santoso',
          email: 'budi.approved@gmail.com',
          phone: '081234567892',
          position: 'Guru Fisika',
          address: 'Jl. Fisika No. 789, Surabaya',
          status: 'approved',
          submittedAt: '2025-01-26T10:00:00Z',
          processedAt: '2025-01-26T15:30:00Z',
          processedBy: 'admin',
          rejectionReason: null,
          username: 'budi_santoso_123'
        },
        {
          id: '4',
          fullName: 'Maya Dewi',
          email: 'maya.rejected@gmail.com',
          phone: '081234567893',
          position: 'Guru Kimia',
          address: 'Jl. Kimia No. 321, Yogyakarta',
          status: 'rejected',
          submittedAt: '2025-01-25T11:00:00Z',
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

  const handleApprove = async (application) => {
    try {
      setProcessing(application.id);

      // Demo mode: Simulate approval process
      console.log('🔄 DEMO: Processing approval for', application.fullName);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate demo credentials
      const demoCredentials = {
        username: application.fullName.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000),
        password: 'Demo' + Math.floor(Math.random() * 10000)
      };
      
      console.log('📧 DEMO EMAIL SENT TO:', application.email);
      console.log('🔑 Demo Credentials:', demoCredentials);
      
      // Update local state
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
      
      alert(`✅ DEMO: ${application.fullName} berhasil disetujui!\n\n🔑 Demo Credentials:\nUsername: ${demoCredentials.username}\nPassword: ${demoCredentials.password}\n\n📧 Dalam mode production, credentials akan dikirim ke: ${application.email}`);
      
    } catch (error) {
      console.error('Error approving application:', error);
      alert(`❌ Gagal menyetujui pendaftaran: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = (application) => {
    setSelectedApp(application);
    setShowRejectModal(true);
  };

  // Demo function untuk menambah pendaftar baru
  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Mohon isi alasan penolakan');
      return;
    }

    try {
      setProcessing(selectedApp.id);

      console.log('🔄 DEMO: Processing rejection for', selectedApp.fullName);
      console.log('📝 Rejection reason:', rejectionReason);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('📧 DEMO EMAIL SENT TO:', selectedApp.email);
      console.log('📄 Rejection email with reason sent');
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === selectedApp.id 
          ? { 
              ...app, 
              status: 'rejected', 
              processedAt: new Date().toISOString(),
              rejectionReason: rejectionReason.trim()
            }
          : app
      ));

      alert(`✅ DEMO: Pendaftaran ${selectedApp.fullName} ditolak.\n\n📧 Dalam mode production, email pemberitahuan dengan alasan penolakan akan dikirim ke: ${selectedApp.email}`);
      
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedApp(null);
      
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert(`❌ Gagal menolak pendaftaran: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge pending">⏳ Pending</span>;
      case 'approved':
        return <span className="badge approved">✅ Approved</span>;
      case 'rejected':
        return <span className="badge rejected">❌ Rejected</span>;
      default:
        return <span className="badge unknown">❓ Unknown</span>;
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const processedApplications = applications.filter(app => app.status !== 'pending');

  if (loading) {
    return (
      <div className="applications-loading">
        <div className="loading-spinner">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="application-manager">
      <div className="applications-header">
        <h2>📝 Kelola Pendaftaran</h2>
        <div className="applications-actions">
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

      {/* Pending Applications */}
      {pendingApplications.length > 0 && (
        <div className="applications-section">
          <h3>⏳ Pendaftaran Menunggu Review ({pendingApplications.length})</h3>
          <div className="applications-grid">
            {pendingApplications.map(app => (
              <div key={app.id} className="application-card pending">
                <div className="card-header">
                  <h4>{app.fullName}</h4>
                  {getStatusBadge(app.status)}
                </div>
                <div className="card-body">
                  <p><strong>📧 Email:</strong> {app.email}</p>
                  <p><strong>📱 Phone:</strong> {app.phone}</p>
                  <p><strong>💼 Position:</strong> {app.position}</p>
                  <p><strong>📍 Address:</strong> {app.address}</p>
                  <p><strong>📅 Submitted:</strong> {new Date(app.submittedAt).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="card-actions">
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(app)}
                    disabled={processing === app.id}
                  >
                    {processing === app.id ? '⏳ Processing...' : '✅ Approve'}
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(app)}
                    disabled={processing === app.id}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Applications */}
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

      {/* No Applications */}
      {applications.length === 0 && (
        <div className="no-applications">
          <h3>📭 Belum Ada Pendaftaran</h3>
          <p>Ketika ada user yang mendaftar melalui Google Forms, data akan muncul di sini.</p>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>❌ Tolak Pendaftaran</h3>
              <button onClick={() => setShowRejectModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <p><strong>Nama:</strong> {selectedApp?.fullName}</p>
              <p><strong>Email:</strong> {selectedApp?.email}</p>
              
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
            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={confirmReject} className="btn-reject" disabled={!rejectionReason.trim()}>
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
