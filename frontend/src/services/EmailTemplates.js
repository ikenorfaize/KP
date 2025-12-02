// EmailTemplates.js - Template HTML untuk berbagai jenis email otomatis
// File ini berisi template email yang akan dikirim melalui EmailJS

export const emailTemplates = {
  
  // Template email untuk user yang pendaftarannya disetujui admin
  approvalEmail: (userData) => ({
    subject: `✅ Akun PERGUNU Anda Telah Disetujui - Login Credentials`, // Subject line email
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS inline untuk email - email client tidak support external CSS */
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0F7536, #228B22); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #0F7536; margin: 20px 0; }
          .button { display: inline-block; background: #0F7536; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Selamat! Akun PERGUNU Anda Telah Disetujui</h1>
          </div>
          <div class="content">
            <p>Halo <strong>${userData.fullName}</strong>,</p>
            
            <p>Kami senang memberitahukan bahwa pendaftaran Anda di sistem PERGUNU telah <strong>disetujui</strong>! 🎊</p>
            
            <!-- Box kredensial login dengan styling khusus -->
            <div class="credentials">
              <h3>🔐 Informasi Login Anda:</h3>
              <p><strong>Website:</strong> <a href="https://kp-mocha.vercel.app/login">Portal PERGUNU</a></p>
              <p><strong>Username:</strong> <code>${userData.username}</code></p>
              <p><strong>Password Awal:</strong> Gunakan NIK Anda sebagai password untuk login pertama</p>
              <p style="color: #dc2626;"><strong>⚠️ Wajib:</strong> Ganti password setelah login pertama untuk keamanan akun</p>
            </div>
            
            <p><strong>⚡ Langkah Selanjutnya:</strong></p>
            <ol>
              <li>Klik tombol login di bawah ini</li>
              <li>Masukkan username dan password di atas</li>
              <li>Akses dashboard untuk download sertifikat</li>
              <li>Kelola profil dan riwayat download Anda</li>
            </ol>
            
            <!-- CTA button dengan styling inline -->
            <div style="text-align: center;">
              <a href="https://kp-mocha.vercel.app/login" class="button">🚀 Login Sekarang</a>
            </div>
            
            <p><strong>💡 Tips Keamanan:</strong></p>
            <ul>
              <li>Jangan bagikan username ini kepada siapa pun</li>
              <li><strong>WAJIB ganti password</strong> setelah login pertama</li>
              <li>Logout setelah selesai menggunakan sistem</li>
              <li>Jika lupa password, hubungi admin untuk reset</li>
            </ul>
            
            <p>Jika Anda mengalami masalah login atau pertanyaan lainnya, jangan ragu untuk menghubungi admin kami.</p>
            
            <p>Terima kasih telah bergabung dengan keluarga besar PERGUNU! 🤝</p>
            
            <div class="footer">
              <p>Email ini dikirim otomatis oleh sistem PERGUNU<br/>
              <small>© 2025 PERGUNU - Persatuan Guru Nahdlatul Ulama</small></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Template untuk user yang ditolak
  rejectionEmail: (userData, reason) => ({
    subject: `❌ Update Pendaftaran PERGUNU - Perlu Perbaikan`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reason { background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0; }
          .button { display: inline-block; background: #0F7536; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Update Pendaftaran PERGUNU</h1>
          </div>
          <div class="content">
            <p>Halo <strong>${userData.fullName}</strong>,</p>
            
            <p>Terima kasih atas minat Anda untuk bergabung dengan PERGUNU. Setelah melakukan review, kami perlu meminta Anda untuk melengkapi beberapa informasi.</p>
            
            <div class="reason">
              <h3>📝 Alasan & Saran Perbaikan:</h3>
              <p>${reason}</p>
            </div>
            
            <p><strong>🔄 Langkah Selanjutnya:</strong></p>
            <ol>
              <li>Perbaiki informasi sesuai catatan di atas</li>
              <li>Daftar ulang melalui formulir pendaftaran</li>
              <li>Pastikan semua data sudah lengkap dan benar</li>
            </ol>
            
            <div style="text-align: center;">
              <a href="https://kp-mocha.vercel.app" class="button">📝 Daftar Ulang</a>
            </div>
            
            <p>Jangan berkecil hati! Ini adalah proses standar untuk memastikan kualitas data. Kami sangat menunggu Anda bergabung dengan keluarga PERGUNU.</p>
            
            <p>Jika ada pertanyaan, silakan hubungi admin kami.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Template notifikasi untuk admin ketika ada pendaftaran baru
  // Berisi data lengkap pendaftar dan tombol aksi untuk approve/reject
  adminNotification: (userData) => ({
    // Subject email dengan emoji dan nama pendaftar
    subject: `🔔 Pendaftaran Baru PERGUNU - ${userData.fullName}`,
    
    // Template HTML lengkap dengan styling inline untuk kompatibilitas email client
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* Reset dan styling dasar untuk email */
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          
          /* Container utama dengan lebar maksimal dan background abu-abu */
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
          
          /* Header dengan background hijau PERGUNU dan teks putih */
          .header { background: #0F7536; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
          
          /* Content area dengan background putih dan shadow */
          .content { background: #fff; padding: 25px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          
          /* Section untuk menampilkan data dengan background abu-abu dan border hijau */
          .data-section { background: #f9f9f9; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #0F7536; }
          
          /* Row untuk menampilkan pasangan label-value */
          .data-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
          
          /* Styling untuk label (kiri) */
          .label { font-weight: bold; color: #0F7536; }
          
          /* Styling untuk value (kanan) */
          .value { color: #333; }
          
          /* Container untuk tombol aksi */
          .button-container { text-align: center; margin: 25px 0; }
          
          /* Tombol approve dengan background hijau */
          .button { display: inline-block; background: #0F7536; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; margin: 5px 10px; font-weight: bold; }
          
          /* Tombol reject dengan background merah */
          .button.reject { background: #dc2626; }
          
          /* Footer dengan styling abu-abu */
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 0.9em; }
          
          /* Notifikasi urgent dengan background kuning */
          .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header dengan judul dan deskripsi singkat -->
          <div class="header">
            <h2>📥 Pendaftaran Baru PERGUNU</h2>
            <p style="margin: 5px 0;">Memerlukan review dan persetujuan Anda</p>
          </div>
          
          <div class="content">
            <!-- Alert urgent untuk menarik perhatian admin -->
            <div class="urgent">
              <h3 style="margin-top: 0;">⏰ Pendaftaran Baru Masuk!</h3>
              <p>Seorang calon anggota baru telah mendaftar dan menunggu persetujuan Anda.</p>
            </div>
            
            <!-- Section data pribadi pendaftar -->
            <div class="data-section">
              <h3 style="margin-top: 0;">👤 Data Pribadi</h3>
              <!-- Nama lengkap dari form pendaftaran -->
              <div class="data-row">
                <span class="label">Nama Lengkap:</span>
                <span class="value">${userData.fullName}</span>
              </div>
              <!-- Email untuk komunikasi -->
              <div class="data-row">
                <span class="label">Email:</span>
                <span class="value">${userData.email}</span>
              </div>
              <!-- Nomor telepon dengan fallback jika kosong -->
              <div class="data-row">
                <span class="label">Telepon:</span>
                <span class="value">${userData.phone || 'Tidak diisi'}</span>
              </div>
              <!-- Jabatan/posisi dengan fallback -->
              <div class="data-row">
                <span class="label">Jabatan/Posisi:</span>
                <span class="value">${userData.position || 'Tidak diisi'}</span>
              </div>
            </div>
            
            <!-- Section data institusi tempat kerja -->
            <div class="data-section">
              <h3 style="margin-top: 0;">🏫 Data Institusi</h3>
              <!-- Nama sekolah/institusi tempat mengajar -->
              <div class="data-row">
                <span class="label">Sekolah/Institusi:</span>
                <span class="value">${userData.school || 'Tidak diisi'}</span>
              </div>
              <!-- Pengurus Wilayah untuk struktur organisasi -->
              <div class="data-row">
                <span class="label">PW (Pengurus Wilayah):</span>
                <span class="value">${userData.pw || 'Tidak diisi'}</span>
              </div>
              <!-- Pengurus Cabang untuk struktur organisasi -->
              <div class="data-row">
                <span class="label">PC (Pengurus Cabang):</span>
                <span class="value">${userData.pc || 'Tidak diisi'}</span>
              </div>
            </div>
            
            <!-- Section data pendidikan dan pengalaman -->
            <div class="data-section">
              <h3 style="margin-top: 0;">🎓 Data Pendidikan & Pengalaman</h3>
              <!-- Pendidikan terakhir dengan fallback -->
              <div class="data-row">
                <span class="label">Pendidikan Terakhir:</span>
                <span class="value">${userData.education || 'Tidak diisi'}</span>
              </div>
              <!-- Pengalaman mengajar dengan fallback -->
              <div class="data-row">
                <span class="label">Pengalaman Mengajar:</span>
                <span class="value">${userData.experience || 'Tidak diisi'}</span>
              </div>
              <!-- Tanggal pendaftaran dengan format Indonesia lengkap -->
              <div class="data-row">
                <span class="label">Tanggal Daftar:</span>
                <span class="value">${new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long',      // Hari dalam bahasa Indonesia
                  year: 'numeric',      // Tahun 4 digit
                  month: 'long',        // Bulan dalam bahasa Indonesia
                  day: 'numeric',       // Tanggal
                  hour: '2-digit',      // Jam 2 digit
                  minute: '2-digit'     // Menit 2 digit
                })}</span>
              </div>
            </div>
            
            <!-- Tombol aksi untuk admin -->
            <div class="button-container">
              <!-- Tombol approve menuju admin dashboard -->
              <a href="https://kp-mocha.vercel.app/admin" class="button">✅ Review & Approve</a>
              <!-- Tombol reject menuju admin dashboard -->
              <a href="https://kp-mocha.vercel.app/admin" class="button reject">❌ Reject Application</a>
            </div>
            
            <!-- Panduan langkah selanjutnya untuk admin -->
            <div style="background: #e7f3ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h4 style="margin-top: 0;">📋 Langkah Selanjutnya:</h4>
              <ol style="margin: 10px 0;">
                <li>Klik tombol "Review & Approve" untuk masuk ke admin dashboard</li>
                <li>Verifikasi kelengkapan data pendaftar</li>
                <li>Setujui atau tolak pendaftaran dengan alasan yang jelas</li>
                <li>Sistem akan otomatis mengirim email notifikasi ke pendaftar</li>
              </ol>
            </div>
            
            <!-- Footer dengan informasi email dan copyright -->
            <div class="footer">
              <p><strong>🔒 Email Admin PERGUNU</strong></p>
              <p>Email ini dikirim otomatis oleh sistem pendaftaran PERGUNU<br/>
              <small>© 2025 PERGUNU - Persatuan Guru Nahdlatul Ulama</small></p>
              <p><small>Untuk membalas langsung ke pendaftar, gunakan fitur Reply pada email ini</small></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Export template object untuk digunakan di service lain
export default emailTemplates;
