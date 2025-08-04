// StatusTracker Component - Komponen untuk melacak status pendaftaran
// Memungkinkan user untuk cek status pendaftaran dengan memasukkan email
import React, { useState } from 'react';
import './StatusTracker.css';

const StatusTracker = () => {
  // State untuk menyimpan email yang diinput user
  const [email, setEmail] = useState('');
  
  // State untuk menyimpan data status pendaftaran
  const [status, setStatus] = useState(null);
  
  // State untuk menunjukkan loading indicator
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengecek status pendaftaran berdasarkan email
  const checkStatus = async () => {
    setLoading(true);    // Tampilkan loading
    setStatus(null);     // Reset status sebelumnya
    
    try {
      // Demo mode: Simulasi delay loading untuk UX yang realistis
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate loading
      
      // Demo responses berdasarkan email yang dimasukkan untuk testing
      if (email.toLowerCase().includes('demo')) {
        // Simulasi status approved
        setStatus({
          email: email,
          status: 'approved',                    // Status: disetujui
          submittedDate: '2025-01-25',           // Tanggal submit
          processedDate: '2025-01-26',           // Tanggal diproses
          message: 'Selamat! Pendaftaran Anda disetujui. Silakan cek email untuk username dan password.'
        });
      } else if (email.toLowerCase().includes('pending')) {
        // Simulasi status pending
        setStatus({
          email: email,
          status: 'pending',                     // Status: menunggu review
          submittedDate: '2025-01-27',           // Tanggal submit
          message: 'Pendaftaran Anda sedang diproses oleh admin. Harap tunggu maksimal 2x24 jam.'
        });
      } else if (email.toLowerCase().includes('reject')) {
        // Simulasi status rejected
        setStatus({
          email: email,
          status: 'rejected',                    // Status: ditolak
          submittedDate: '2025-01-24',           // Tanggal submit
          processedDate: '2025-01-25',           // Tanggal diproses
          message: 'Pendaftaran perlu diperbaiki. Silakan cek email untuk detail dan daftar ulang.'
        });
      } else {
        // Try real API call first, fallback to demo
        // Coba panggil API server untuk data real
        try {
          const response = await fetch(`http://localhost:3003/api/check-status/${encodeURIComponent(email)}`);
          if (response.ok) {
            const data = await response.json();
            
            // Jika API berhasil dan ada data aplikasi
            if (data.success && data.application) {
              setStatus({
                email: email,
                status: data.application.status,
                submittedDate: new Date(data.application.submittedAt).toLocaleDateString('id-ID'),
                processedDate: data.application.processedAt ? 
                  new Date(data.application.processedAt).toLocaleDateString('id-ID') : null,
                message: data.application.message
              });
            } else {
              throw new Error('Not found in API');
            }
          } else {
            throw new Error('API not available');
          }
        } catch (apiError) {
          // Fallback to demo response
          setStatus({
            email: email,
            status: 'not_found',
            submittedDate: '-',
            message: '📧 Demo Mode: Coba email dengan kata "demo", "pending", atau "reject" untuk melihat status berbeda. Contoh: demo@test.com'
          });
        }
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setStatus({
        email: email,
        status: 'error',
        submittedDate: '-',
        message: 'Terjadi kesalahan saat mengecek status. Silakan coba lagi nanti atau hubungi admin.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-tracker">
      <div className="tracker-header">
        <h2>🔍 Cek Status Pendaftaran</h2>
        <p>Masukkan email yang Anda gunakan saat mendaftar</p>
      </div>

      <div className="tracker-form">
        <input
          type="email"
          placeholder="Masukkan email Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />
        <button 
          onClick={checkStatus}
          disabled={!email || loading}
          className="check-btn"
        >
          {loading ? 'Mengecek...' : 'Cek Status'}
        </button>
      </div>

      {status && (
        <div className={`status-result ${status.status}`}>
          <div className="status-header">
            <span className="status-icon">
              {status.status === 'pending' && '⏳'}
              {status.status === 'approved' && '✅'}
              {status.status === 'rejected' && '❌'}
              {status.status === 'not_found' && '🔍'}
              {status.status === 'error' && '⚠️'}
            </span>
            <h3>
              {status.status === 'pending' && 'Pendaftaran Sedang Diproses'}
              {status.status === 'approved' && 'Pendaftaran Disetujui'}
              {status.status === 'rejected' && 'Pendaftaran Perlu Diperbaiki'}
              {status.status === 'not_found' && 'Pendaftaran Tidak Ditemukan'}
              {status.status === 'error' && 'Terjadi Kesalahan'}
            </h3>
          </div>
          
          <div className="status-details">
            <p><strong>Email:</strong> {status.email}</p>
            <p><strong>Tanggal Daftar:</strong> {status.submittedDate}</p>
            {status.processedDate && (
              <p><strong>Tanggal Diproses:</strong> {status.processedDate}</p>
            )}
            <p><strong>Pesan:</strong> {status.message}</p>
          </div>

          {status.status === 'approved' && (
            <div className="next-steps">
              <h4>📧 Langkah Selanjutnya:</h4>
              <ul>
                <li>Cek email Anda untuk username & password</li>
                <li>Login menggunakan credentials yang dikirim</li>
                <li>Mulai download sertifikat di dashboard</li>
              </ul>
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <a href="/login" className="login-link">
                  🚀 Login Sekarang
                </a>
              </div>
            </div>
          )}

          {status.status === 'not_found' && (
            <div className="next-steps">
              <h4>📝 Apa yang harus dilakukan:</h4>
              <ul>
                <li>Pastikan email yang dimasukkan benar</li>
                <li>Jika belum daftar, silakan isi form pendaftaran</li>
                <li>Hubungi admin jika yakin sudah mendaftar</li>
              </ul>
            </div>
          )}

          {status.status === 'rejected' && (
            <div className="next-steps">
              <h4>🔄 Langkah Selanjutnya:</h4>
              <ul>
                <li>Cek email untuk detail alasan penolakan</li>
                <li>Perbaiki data sesuai saran admin</li>
                <li>Daftar ulang dengan data yang sudah diperbaiki</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusTracker;
