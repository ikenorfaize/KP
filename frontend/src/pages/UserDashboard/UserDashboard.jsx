// UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    availableCertificates: 0,
    totalDownloads: 0,
    lastLogin: null
  });

  // Helper function to safely format dates
  const formatDateSafe = (dateInput) => {
    if (!dateInput) return 'Tidak tersedia';
    
    // If it's already in the desired format (contains comma and dots), return as is
    if (typeof dateInput === 'string' && dateInput.includes(',') && dateInput.includes('.')) {
      return dateInput;
    }
    
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        // If parsing fails, return original string
        return dateInput;
      }
      return date.toLocaleString('id-ID');
    } catch (error) {
      return dateInput; // Return original if any error
    }
  };

  // Get authenticated user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get logged-in user from localStorage (check both possible keys)
        const userAuth = localStorage.getItem('userAuth');
        const loggedInUser = localStorage.getItem('loggedInUser');
        
        let userData = null;
        
        if (userAuth) {
          userData = JSON.parse(userAuth);
          console.log('✅ Found user in userAuth:', userData);
        } else if (loggedInUser) {
          userData = JSON.parse(loggedInUser);
          console.log('✅ Found user in loggedInUser:', userData);
        }
        
        if (!userData) {
          console.log('❌ No authenticated user found');
          navigate('/login');
          return;
        }

        // Fetch complete user data from JSON Server using userId
        const userId = userData.userId || userData.id;
        console.log(`🔄 Fetching user data for ID: ${userId}`);
        
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
        const response = await fetch(`${apiUrl}/users/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const fullUserData = await response.json();
        console.log('✅ User data loaded:', fullUserData);
        
        // Set user data with default certificates if none exist
        const userWithDefaults = {
          ...fullUserData,
          profileImage: fullUserData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullUserData.fullName)}&background=0F7536&color=fff`,
          certificates: fullUserData.certificates || [
            {
              id: '1',
              title: 'Sertifikat Pendidik Profesional',
              description: `Sertifikat kelulusan program pendidik profesional 2025 untuk ${fullUserData.fullName}`,
              fileName: `sertifikat_${fullUserData.username}_pendidik_2025.pdf`,
              uploadDate: '2025-01-20',
              downloadCount: 0,
              category: 'Professional',
              status: 'available'
            },
            {
              id: '2',
              title: 'Pelatihan Pedagogik',
              description: `Sertifikat pelatihan metode pembelajaran untuk ${fullUserData.fullName}`,
              fileName: `pelatihan_pedagogik_${fullUserData.username}_2025.pdf`,
              uploadDate: '2025-01-15',
              downloadCount: 0,
              category: 'Training',
              status: 'available'
            }
          ]
        };

        setUser(userWithDefaults);
        
        // Update stats - handle both string and object certificates
        const totalDownloads = userWithDefaults.certificates.reduce((sum, cert) => {
          if (typeof cert === 'object' && cert.downloadCount) {
            return sum + cert.downloadCount;
          }
          return sum;
        }, 0);

        setUserStats({
          availableCertificates: userWithDefaults.certificates.length,
          totalDownloads: userWithDefaults.downloads || totalDownloads,
          lastLogin: formatDateSafe(userWithDefaults.lastDownload || new Date())
        });

      } catch (error) {
        console.error('❌ Error fetching user data:', error);
        
        // Fallback: try to use basic user data from localStorage
        const userAuth = localStorage.getItem('userAuth');
        if (userAuth) {
          try {
            const basicUserData = JSON.parse(userAuth);
            const fallbackUser = {
              id: basicUserData.userId || basicUserData.id,
              fullName: basicUserData.fullName || 'User',
              email: basicUserData.email || 'user@example.com',
              username: basicUserData.username || 'user',
              position: 'Staff',
              profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(basicUserData.fullName || 'User')}&background=0F7536&color=fff`,
              certificates: []
            };
            
            setUser(fallbackUser);
            setUserStats({
              availableCertificates: 0,
              totalDownloads: 0,
              lastLogin: formatDateSafe(new Date())
            });
            
            console.log('⚠️ Using fallback user data:', fallbackUser);
          } catch (fallbackError) {
            console.error('❌ Fallback failed, redirecting to login');
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
    if (confirmed) {
      // Clear all possible auth keys
      localStorage.removeItem('userAuth');
      localStorage.removeItem('userSession');
      localStorage.removeItem('loggedInUser');
      console.log('🚪 User logged out');
      navigate('/', { replace: true });
    }
  };

  // Download certificate function
  const handleDownloadCertificate = async (certificate) => {
    try {
      if (!certificate || typeof certificate !== 'object') {
        alert('⚠️ Sertifikat tidak valid atau belum memiliki file. Minta admin untuk mengupload ulang.');
        return;
      }

      console.log(`🔄 Downloading: ${certificate.fileName || certificate.originalName || certificate.filename}`);

      const fileServerUrl = import.meta.env.VITE_FILE_SERVER_URL || 'https://kp-mocha.vercel.app';
      let downloadHref = null;

      if (typeof certificate === 'object') {
        // Preferred: backend-provided URL fields
        if (certificate.downloadUrl || certificate.fileUrl) {
          const raw = certificate.downloadUrl || certificate.fileUrl;
          downloadHref = raw.startsWith('http') ? raw : `${fileServerUrl}${raw}`;
        } else if (certificate.id) {
          // Construct from id
          downloadHref = `${fileServerUrl}/download-certificate/${certificate.id}`;
        } else if (certificate.base64Data) {
          downloadHref = certificate.base64Data;
        } else if (certificate.url) {
          downloadHref = certificate.url;
        }
      }

      if (!downloadHref) {
        alert(`⚠️ File "${certificate.fileName || certificate.originalName || certificate.filename || 'Tidak diketahui'}" tidak tersedia untuk diunduh.`);
        return;
      }

      const link = document.createElement('a');
      link.href = downloadHref;
      link.download = certificate.fileName || certificate.originalName || 'certificate.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download count in user data
      const updatedUser = {
        ...user,
        certificates: user.certificates.map(cert => {
          if (typeof cert === 'object' && cert.id === certificate.id) {
            return { ...cert, downloadCount: (cert.downloadCount || 0) + 1 };
          }
          return cert;
        }),
        downloads: (user.downloads || 0) + 1,
        lastDownload: new Date().toLocaleString('id-ID'),
        downloadHistory: [
          {
            id: Date.now().toString(),
            certificateTitle: certificate.fileName || certificate.originalName,
            downloadDate: new Date().toLocaleString('id-ID'),
            fileName: certificate.fileName || certificate.originalName
          },
          ...(user.downloadHistory || [])
        ]
      };

      // Update local state
      setUser(updatedUser);

      // Update in API (PATCH minimal fields)
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
      const patchPayload = {
        downloads: updatedUser.downloads,
        lastDownload: updatedUser.lastDownload,
        downloadHistory: updatedUser.downloadHistory,
        certificates: updatedUser.certificates
      };
      await fetch(`${apiUrl}/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchPayload)
      });

      // Update stats
      setUserStats(prev => ({
        ...prev,
        totalDownloads: prev.totalDownloads + 1
      }));

      alert(`✅ Sertifikat "${certificate.fileName || certificate.originalName}" berhasil diunduh!`);
      
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      const msg = error?.message ? ` (${error.message})` : '';
      alert(`❌ Gagal mengunduh sertifikat${msg}. Silakan coba lagi.`);
    }
  };

  const renderDashboard = () => (
    <div className="user-dashboard-content">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Selamat Datang, {user?.fullName}! 👋</h1>
          <p>Kelola dan unduh sertifikat PERGUNU Anda</p>
        </div>
        <div className="user-avatar-large">
          <img src={user?.profileImage} alt={user?.fullName} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="stat-icon">📜</div>
          <div className="stat-info">
            <h3>{userStats.availableCertificates}</h3>
            <p>Sertifikat Tersedia</p>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon">⬇️</div>
          <div className="stat-info">
            <h3>{userStats.totalDownloads}</h3>
            <p>Total Download</p>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{userStats.lastLogin}</h3>
            <p>Login Terakhir</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Aksi Cepat</h2>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => setActiveTab('certificates')}
          >
            📜 Lihat Semua Sertifikat
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => setActiveTab('profile')}
          >
            👤 Edit Profil
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => setActiveTab('history')}
          >
            📊 Riwayat Download
          </button>
        </div>
      </div>

      {/* Recent Certificates */}
      <div className="recent-certificates">
        <h2>Sertifikat Terbaru</h2>
        <div className="certificates-preview">
          {user?.certificates.slice(0, 2).map((certificate, idx) => (
            <div key={certificate.id || idx} className="certificate-card-preview">
              <div className="certificate-info">
                <h3>{certificate.title || certificate.originalName || certificate.fileName || 'Sertifikat'}</h3>
                <p>{certificate.description || 'Sertifikat yang diupload'}</p>
                <div className="certificate-meta">
                  <span className="category">{certificate.category || 'PDF'}</span>
                  <span className="upload-date">
                    {formatDateSafe(certificate.uploadDate)}
                  </span>
                </div>
              </div>
              {(() => {
                // Check if certificate has valid download references
                const hasDownloadUrl = certificate.downloadUrl || certificate.fileUrl;
                const hasId = certificate.id && (typeof certificate.id === 'number' || typeof certificate.id === 'string');
                const hasLegacyData = certificate.base64Data || certificate.url;
                const downloadable = typeof certificate === 'object' && (hasDownloadUrl || hasId || hasLegacyData);
                
                return (
                  <button 
                    className={`download-btn-small${downloadable ? '' : ' disabled'}`}
                    onClick={() => downloadable && handleDownloadCertificate(certificate)}
                    disabled={!downloadable}
                    title={downloadable ? 'Unduh sertifikat' : 'File tidak tersedia untuk diunduh'}
                  >
                    {downloadable ? '⬇️ Download' : '❌ Tidak Tersedia'}
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
        {user?.certificates.length > 2 && (
          <button 
            className="view-all-btn"
            onClick={() => setActiveTab('certificates')}
          >
            Lihat Semua ({user.certificates.length} sertifikat)
          </button>
        )}
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="certificates-content">
      <div className="certificates-header">
        <h2>Sertifikat Saya</h2>
        <p>Semua sertifikat yang tersedia untuk Anda</p>
      </div>

      <div className="certificates-grid">
        {user?.certificates && user.certificates.length > 0 ? (
          user.certificates.map((certificate, index) => {
            // Handle both old (string) and new (object) certificate formats
            if (typeof certificate === 'string') {
              return (
                <div key={index} className="certificate-card">
                  <div className="certificate-badge">
                    <span className="category-badge default">
                      Sertifikat
                    </span>
                  </div>
                  <div className="certificate-content">
                    <h3>{certificate}</h3>
                    <p>Sertifikat yang diupload sebelumnya</p>
                    <div className="certificate-details">
                      <div className="detail-item">
                        <span className="label">📄 File:</span>
                        <span className="value">{certificate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="certificate-actions">
                    <button 
                      className="download-btn disabled"
                      disabled
                      title="File tidak tersedia untuk diunduh"
                    >
                      ❌ Tidak Tersedia
                    </button>
                  </div>
                </div>
              );
            } else {
              // Handle new object format
              return (
                <div key={certificate.id || index} className="certificate-card">
                  <div className="certificate-badge">
                    <span className="category-badge success">
                      PDF Sertifikat
                    </span>
                  </div>
                  <div className="certificate-content">
                    <h3>{certificate.originalName || certificate.fileName}</h3>
                    <p>Sertifikat yang diupload oleh admin</p>
                    <div className="certificate-details">
                      <div className="detail-item">
                        <span className="label">📅 Upload:</span>
                        <span className="value">
                          {formatDateSafe(certificate.uploadDate)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">⬇️ Downloads:</span>
                        <span className="value">{certificate.downloadCount || 0}x</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">📄 File:</span>
                        <span className="value">{certificate.originalName || certificate.fileName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">💾 Ukuran:</span>
                        <span className="value">
                          {certificate.size 
                            ? `${(certificate.size / 1024 / 1024).toFixed(2)} MB`
                            : 'Tidak diketahui'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="certificate-actions">
                    {(() => {
                      // Check if certificate has valid download references
                      const hasDownloadUrl = certificate.downloadUrl || certificate.fileUrl;
                      const hasId = certificate.id && (typeof certificate.id === 'number' || typeof certificate.id === 'string');
                      const hasLegacyData = certificate.base64Data || certificate.url;
                      const downloadable = hasDownloadUrl || hasId || hasLegacyData;
                      
                      return (
                        <button 
                          className={`download-btn${downloadable ? '' : ' disabled'}`}
                          onClick={() => downloadable && handleDownloadCertificate(certificate)}
                          disabled={!downloadable}
                          title={downloadable ? 'Unduh sertifikat' : 'File tidak tersedia untuk diunduh'}
                        >
                          {downloadable ? '⬇️ Download PDF' : '❌ Tidak Tersedia'}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            }
          })
        ) : (
          <div className="no-certificates">
            <div className="no-certificates-content">
              <h3>📄 Belum Ada Sertifikat</h3>
              <p>Anda belum memiliki sertifikat yang diupload oleh admin.</p>
              <p>Silakan hubungi admin untuk mengupload sertifikat Anda.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-content">
      <div className="profile-header">
        <h2>Profil Saya</h2>
        <p>Informasi pribadi dan akun Anda</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar-section">
          <img src={user?.profileImage} alt={user?.fullName} className="profile-avatar" />
          <h3>{user?.fullName}</h3>
          <p className="position">{user?.position}</p>
        </div>

        <div className="profile-info">
          <div className="info-group">
            <h4>📧 Kontak</h4>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Telepon:</span>
              <span className="value">{user?.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">Alamat:</span>
              <span className="value">{user?.address}</span>
            </div>
          </div>

          <div className="info-group">
            <h4>🏢 Informasi Kerja</h4>
            <div className="info-item">
              <span className="label">Username:</span>
              <span className="value">@{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="label">Bergabung:</span>
              <span className="value">{user?.joinDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="history-content">
      <div className="history-header">
        <h2>Riwayat Download</h2>
        <p>Catatan aktivitas download sertifikat Anda</p>
      </div>

      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Sertifikat</th>
              <th>Tanggal Download</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {user?.downloadHistory.map(history => (
              <tr key={history.id}>
                <td>{history.certificateTitle}</td>
                <td>{formatDateSafe(history.downloadDate)}</td>
                <td className="file-name">{history.fileName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="user-header">
        <div className="header-content">
          <div className="header-left">
            <h1>PERGUNU Portal</h1>
            <span className="user-greeting">Hi, {user.fullName}</span>
          </div>
          <div className="header-actions">
            <button 
              className="back-home-btn"
              onClick={() => navigate('/')}
              title="Kembali ke Homepage"
            >
              🏠 Home
            </button>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="user-nav">
        <div className="nav-content">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            🏠 Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            📜 Sertifikat Saya
          </button>
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profil
          </button>
          <button
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📊 Riwayat
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="user-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'certificates' && renderCertificates()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'history' && renderHistory()}
      </main>
    </div>
  );
};

export default UserDashboard;
