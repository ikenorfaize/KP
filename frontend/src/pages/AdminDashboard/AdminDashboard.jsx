// AdminDashboard.jsx - Main Dashboard untuk Admin PERGUNU
// Komponen ini adalah control center untuk semua operasi admin:
// - Dashboard overview dengan statistik real-time
// - User management (Create, Read, Update, Delete users)
// - Application review (Approve/Reject pendaftaran baru)
// - Certificate management (Upload, download, tracking)
// - Email notification system
// - Bulk operations dan export data
// - Admin activity logging dan audit trail

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';                    // Hook navigasi
// Password hashing dilakukan di BACKEND untuk security
import { apiService } from '../../services/apiService';            // Import API service
import { ApplicationService } from '../../services/ApplicationService';
import { usePendingApplications } from '../../context/PendingApplicationsContext';
import ApplicationManager from '../../componen/ApplicationManager/ApplicationManager'; // Komponen untuk manage aplikasi
import BeasiswaManager from '../../componen/ApplicationManager/BeasiswaManager'; // Komponen untuk manage beasiswa
import NewsManager from '../../componen/NewsManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // Toast state
  const [toast, setToast] = React.useState({ visible: false, type: 'success', message: '' });
  const showToast = (message, type = 'success', duration = 2500) => {
    setToast({ visible: true, type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(t => ({ ...t, visible: false })), duration);
  };
  const { pendingCount } = usePendingApplications();
  // Hook untuk navigasi programmatic (redirect ke login jika tidak authorized)
  const navigate = useNavigate();
  
  // State untuk mengontrol tab yang aktif di dashboard multi-tab interface
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State untuk search functionality across all data
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk statistik dashboard overview (metrics dan KPI)
  const [stats, setStats] = useState({
    totalUsers: 0,           // Total pengguna terdaftar dan aktif
    certificatesUploaded: 0, // Total sertifikat yang berhasil diupload
    totalDownloads: 0,       // Total download sertifikat (tracking engagement)
    pendingApplications: 0,  // Aplikasi yang menunggu review
    approvedToday: 0,        // Approval hari ini
    rejectedToday: 0         // Rejection hari ini
  });

  // State untuk form tambah pengguna baru (manual user creation)
  const [newUser, setNewUser] = useState({
    fullName: '',      // Nama lengkap sesuai identitas
    email: '',         // Email unik untuk komunikasi
    username: '',      // Username unik untuk login
    password: '',      // Password (akan di-hash dengan bcrypt)
    position: '',      // Posisi/jabatan dalam organisasi
    address: '',       // Alamat lengkap
    phone: '',         // Nomor telepon/WhatsApp aktif
    status: 'active',  // Status akun (active/inactive/suspended)
    role: 'user'       // Role permission (user/admin/moderator)
  });
  
  // State untuk UI controls dan user experience
  const [showPassword, setShowPassword] = useState(false);   // Toggle visibility password
  const [isSubmitting, setIsSubmitting] = useState(false);   // Loading state saat submit forms
  const [users, setUsers] = useState([]);                   // Array semua pengguna dari database
  const [isLoadingUsers, setIsLoadingUsers] = useState(true); // Loading state untuk fetch users
  
  // Current user state (for auth headers)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || '{}');
    } catch {
      return {};
    }
  });

  // State untuk edit pengguna
  const [editingUser, setEditingUser] = useState(null); // Data user yang sedang diedit
  const [showEditModal, setShowEditModal] = useState(false); // Modal edit visibility
  const [showEditPassword, setShowEditPassword] = useState(false); // Toggle password di edit
  const [news, setNews] = useState([]); // State untuk berita

  // Fungsi untuk mengambil data berita dari API
  const fetchNews = useCallback(async () => {
    try {
      await apiService.init();
      const response = await fetch(`${apiService.API_URL}/news`);
      if (response.ok) {
        const newsData = await response.json();
        setNews(newsData);
      }
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      setNews([]);
    }
  }, []);

  // Fungsi untuk mengambil data pengguna dari Express.js API
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoadingUsers(true);
      
      // Ensure apiService is initialized
      await apiService.init();
      
      // Fetch data dari Express.js API menggunakan apiService
      const response = await fetch(`${apiService.API_URL}/users`, {
        headers: {
          'x-user-id': currentUser.id || ''
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const userData = await response.json();
      
      // Transform data to include additional fields for display
      const transformedUsers = userData.map(user => ({
        ...user,
        profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=0F7536&color=fff`,
        downloads: user.downloads || 0,
        certificates: user.certificates || [],
        lastDownload: user.lastDownload || null,
        position: user.position || 'Staff'
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      
      // Fallback to mock data if server fails
      setUsers([
        {
          id: '1',
          fullName: 'Ahmad Surya',
          email: 'ahmad.surya@pergunu.com',
          username: 'ahmad_surya',
          role: 'user',
          position: 'Guru Matematika',
          address: 'Jl. Pendidikan No. 123, Jakarta',
          phone: '081234567890',
          status: 'active',
          profileImage: 'https://via.placeholder.com/40',
          downloads: 5,
          certificates: ['sertifikat_ahmad_2024.pdf', 'pelatihan_matematika.pdf'],
          lastDownload: '2025-01-18',
          createdAt: '2025-01-18T10:00:00Z'
        }
      ]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []); // useCallback dependency array

  // Load users on component mount ONCE
  useEffect(() => {
    fetchUsers();
    fetchNews(); // Fetch news juga
  }, []); // Remove fetchUsers from dependency to prevent infinite loops

  // Ensure we don't stick to local fallback for applications when API is available
  useEffect(() => {
    (async () => {
      try {
        await apiService.init();
        if (apiService.isServerAvailable) {
          try { 
            localStorage.removeItem('applications_mode'); 
          } catch (_err) {
            // Ignore error if localStorage is not available
          }
        }
      } catch (_err) {
        // Ignore API init error
      }
    })();
  }, []);

  // Stable callback to receive pending count from ApplicationManager without causing re-render loops
  const handlePendingCountChange = useCallback((count) => {
    setStats(prev => (
      prev.pendingApplications === count
        ? prev
        : { ...prev, pendingApplications: count }
    ));
  }, []);

  // Computed values with useMemo for performance
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user => 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const computedStats = useMemo(() => {
    const totalUsers = users.length;
    const certificatesUploaded = users.reduce((acc, user) => acc + (user.certificates?.length || 0), 0);
    const totalDownloads = users.reduce((acc, user) => acc + (user.downloads || 0), 0);
    
    return { totalUsers, certificatesUploaded, totalDownloads };
  }, [users]);

  // Update stats when computed values change, preserve pendingApplications and other transient fields
  useEffect(() => {
    setStats(prev => ({ ...prev, ...computedStats }));
  }, [computedStats]);

  // Sync context pendingCount to local stats for display co-location
  useEffect(() => {
    setStats(prev => (prev.pendingApplications === pendingCount ? prev : { ...prev, pendingApplications: pendingCount }));
  }, [pendingCount]);

  // Fungsi untuk logout admin dengan konfirmasi
  const handleLogout = () => {
    // Clear authentication data dari localStorage  
    localStorage.removeItem('adminAuth');      // Remove admin session token
    localStorage.removeItem('userSession');   // Remove user session data
    
    // Show confirmation dialog untuk mencegah logout tidak sengaja
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar dari admin dashboard?');
    
    if (confirmed) {
      console.log('🚪 Admin logging out...');
      // Navigate to home page dengan replace: true untuk clear history
      navigate('/', { replace: true });
    }
  };

  // Handler untuk perubahan input form user baru
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,                    // Spread existing data
      [name]: value              // Update field yang berubah
    }));
  };

  // Reset form user baru ke nilai default
  const resetNewUserForm = () => {
    setNewUser({
      fullName: '',      // Reset nama lengkap
      email: '',         // Reset email
      username: '',      // Reset username
      password: '',      // Reset password
      position: '',      // Reset posisi/jabatan
      address: '',       // Reset alamat
      phone: '',         // Reset nomor telepon
      status: 'active',  // Default status aktif
      role: 'user'       // Default role user biasa
    });
    setShowPassword(false); // Reset password visibility untuk security
  };

  // Handler untuk mulai edit user - populate form dengan data existing
  const handleEditUser = (user) => {
    setEditingUser({
      ...user,                    // Spread semua data user
      password: ''               // Always start dengan empty password untuk security
    });
    setShowEditModal(true);      // Show modal edit
    setShowEditPassword(false);  // Hide password input initially
  };

  // Handler untuk perubahan input di form edit user
  const _handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({
      ...prev,                    // Spread existing editing user data
      [name]: value              // Update field yang berubah
    }));
  };

  // Handler untuk save perubahan user (PATCH request ke JSON Server)
  const handleSaveEditUser = async (e) => {
    e.preventDefault();          // Prevent default form submission
    setIsSubmitting(true);       // Set loading state
    
    try {
      console.log('🔄 Updating user...');
      
      // Prepare data yang akan diupdate (trim whitespace)
      const updateData = {
        fullName: editingUser.fullName.trim(),
        email: editingUser.email.trim(),
        username: editingUser.username.trim(),
        position: editingUser.position.trim(),
        address: editingUser.address.trim(),
        phone: editingUser.phone.trim(),
        status: editingUser.status,    // Status dropdown value
        role: editingUser.role         // Role dropdown value
      };
      
      // Only update password jika user input password baru
      if (editingUser.password && editingUser.password.trim()) {
        // Send plain password to backend - backend will handle hashing
        updateData.password = editingUser.password.trim();
        console.log('🔐 Password will be hashed by backend');
      }
      
      // Send PATCH request ke Express.js API
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
      const response = await fetch(`${apiUrl}/users/${editingUser.id}`, {
        method: 'PATCH',           // PATCH method untuk partial update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)  // Convert object ke JSON string
      });
      
      // Check response status
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const updatedUser = await response.json(); // Parse response
      console.log('✅ User updated:', updatedUser);
      
      // Refresh the users list untuk show perubahan terbaru
      await fetchUsers();
      
      // Close modal dan reset state
      setShowEditModal(false);
      setEditingUser(null);
      
      alert('✅ User berhasil diupdate!'); // Success feedback
      
    } catch (error) {
      console.error('❌ Error updating user:', error);
      alert(`❌ Error: ${error.message}`); // Error feedback
    } finally {
      setIsSubmitting(false);    // Reset loading state
    }
  };

  // Handler untuk close edit modal tanpa save
  const handleCloseEditModal = () => {
    setShowEditModal(false);     // Hide modal
    setEditingUser(null);        // Clear editing data
    setShowEditPassword(false);  // Reset password visibility
  };

  // Handler untuk menambah user baru (POST request ke JSON Server)
  const handleAddUser = async (e) => {
    e.preventDefault();          // Prevent default form submission
    setIsSubmitting(true);       // Set loading state untuk disable form
    
    try {
      // === STEP 1: CLIENT-SIDE VALIDATION ===
      // Validate required fields untuk memastikan data lengkap
      const requiredFields = ['fullName', 'email', 'username', 'password', 'position', 'phone'];
      for (const field of requiredFields) {
        if (!newUser[field].trim()) {
          alert(`${field.charAt(0).toUpperCase() + field.slice(1)} is required!`);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Check duplicate username atau email
      const existingUser = users.find(user => 
        user.username === newUser.username || user.email === newUser.email
      );
      
      if (existingUser) {
        alert('Username atau email sudah digunakan!');
        setIsSubmitting(false);
        return;
      }
      
      console.log('🔄 Adding new user to JSON Server...');
      
      // === STEP 2: PREPARE USER DATA ===
      // Create new user object dengan semua data yang diperlukan
      // Password will be hashed by backend for security
      const userToAdd = {
        fullName: newUser.fullName.trim(),
        email: newUser.email.trim(),
        username: newUser.username.trim(),
        password: newUser.password.trim(),  // Plain password - backend will hash
        position: newUser.position.trim(),
        address: newUser.address.trim(),
        phone: newUser.phone.trim(),
        status: newUser.status,             // active/inactive/suspended
        role: newUser.role,                 // user/admin/moderator
        createdAt: new Date().toISOString() // Timestamp creation
      };
      
      // === STEP 4: DATABASE SAVE OPERATION ===
      // Send POST request ke Express.js API
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToAdd)     // Convert object ke JSON string
      });
      
      // Check response status
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const savedUser = await response.json(); // Parse response data
      console.log('✅ User saved to JSON Server:', savedUser);
      
      // === STEP 5: UI UPDATE & FEEDBACK ===
      // Refresh the users list untuk show user baru
      await fetchUsers();
      
      // Show success message dengan credentials untuk admin
      alert(`✅ Karyawan ${newUser.fullName} berhasil ditambahkan!\n\nCredentials:\n👤 Username: ${newUser.username}\n🔑 Password: ${newUser.password}\n\nUser dapat login dengan credentials ini.`);
      
      // Reset form untuk input selanjutnya
      resetNewUserForm();
      
      // Switch to dashboard tab untuk show user baru
      setActiveTab('dashboard');
      
      console.log('✅ New user added successfully');
      
    } catch (error) {
      console.error('❌ Error adding user:', error);
      
      // === FALLBACK: LOCAL STATE SAVE ===
      // Jika JSON Server gagal, simpan ke local state sebagai backup
      console.log('⚠️ JSON Server failed, saving to local state only');
      
      const userToAdd = {
        id: Date.now().toString(),          // Generate ID dari timestamp
        ...newUser,                         // Spread form data
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.fullName)}&background=0F7536&color=fff`,
        downloads: 0,                       // Initialize download counter
        certificates: [],                   // Initialize empty certificates array
        lastDownload: null,                 // Initialize last download timestamp
        createdAt: new Date().toISOString() // Timestamp creation
      };
      
      setUsers(prev => [...prev, userToAdd]); // Add to local state
      
      alert(`⚠️ User ditambahkan ke local state (JSON Server error).\n\nCredentials:\n👤 Username: ${newUser.username}\n🔑 Password: ${newUser.password}\n\nNOTE: Data mungkin tidak persisten!`);
      
      resetNewUserForm();    // Reset form
      setActiveTab('dashboard'); // Switch tab
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  // Calculate statistics
  useEffect(() => {
    const calculateStats = () => {
      const totalUsers = users.length;
      const certificatesUploaded = users.reduce((sum, user) => sum + user.certificates.length, 0);
      const totalDownloads = users.reduce((sum, user) => sum + user.downloads, 0);

      setStats({
        totalUsers,
        certificatesUploaded,
        totalDownloads
      });
    };
    
    calculateStats();
  }, [users]);

  // Handle file upload with FILE SERVER (no more base64!)
  const handleCertificateUpload = async (userId, file) => {
    if (!file) {
      alert('❌ Tidak ada file yang dipilih.');
      return;
    }

    if (file.type !== 'application/pdf') {
      alert('❌ Hanya file PDF yang diperbolehkan.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('❌ Ukuran file terlalu besar. Maksimal 10MB.');
      return;
    }

    try {
      console.log('📤 Uploading to file server...', { fileName: file.name, size: file.size });
      showToast('⏳ Uploading file...', 'info', 5000);

      // === UPLOAD TO FILE SERVER ===
      const formData = new FormData();
      formData.append('certificate', file);
      formData.append('userId', userId);

      const fileServerUrl = import.meta.env.VITE_FILE_SERVER_URL || 'https://kp-mocha.vercel.app';
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const uploadResponse = await fetch(`${fileServerUrl}/upload-certificate`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const uploadJson = await uploadResponse.json();
      console.log('✅ File uploaded:', uploadJson);

      // Backend returns { message, certificate }
      const c = uploadJson.certificate || uploadJson;
      const fileMetadata = {
        id: c.id,
        fileName: c.fileName || c.originalName,
        originalName: c.originalName,
        uniqueName: c.filename,         // saved filename
        filePath: c.filePath,           // server file path
        fileUrl: c.downloadUrl,         // public download URL
        size: c.size ?? file.size,
        uploadDate: c.uploadDate || new Date().toISOString(),
        downloadCount: 0
      };

      // Get current user data
      const userToUpdate = users.find(user => user.id === userId);
      if (!userToUpdate) {
        alert('❌ User tidak ditemukan!');
        return;
      }

      // Update certificates array ONLY
      const updatedCertificates = [...(userToUpdate.certificates || []), fileMetadata];

      // ONLY update certificates field - DO NOT touch password or other sensitive data
      const certificateUpdate = {
        certificates: updatedCertificates
      };

      // Update local state to reflect new certificate
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, certificates: updatedCertificates } : user
        )
      );

      // File server already updated the database, so no need for separate API call
      // Just show success message
      console.log('✅ Certificate uploaded successfully:', fileMetadata);
      showToast(`✅ Sertifikat "${file.name}" berhasil diupload`, 'success');
      
    } catch (error) {
      console.error('❌ Error uploading certificate:', error);
      
      if (error.name === 'AbortError') {
        showToast('❌ Upload timeout - file terlalu lama diproses', 'error', 3500);
      } else if (error.message.includes('Failed to fetch')) {
        showToast('❌ Koneksi ke file server gagal - cek network', 'error', 3500);
      } else {
        showToast(`❌ Gagal upload: ${error.message}`, 'error', 3500);
      }
    }
  };

  // Handle certificate deletion with FILE SERVER cleanup
  const handleDeleteCertificate = async (userId, certificateId) => {
    if (!confirm('❗ Apakah Anda yakin ingin menghapus sertifikat ini?')) {
      return;
    }

    try {
      // Convert certificateId to string if it's an object
      const certIdStr = typeof certificateId === 'object' ? (certificateId.id || `temp_${JSON.stringify(certificateId)}`) : String(certificateId);
      
      // Find user and certificate to delete
      const userToUpdate = users.find(user => user.id === userId);
      if (!userToUpdate) {
        alert('❌ User tidak ditemukan!');
        return;
      }

      // Find the certificate to delete (handle both new format with ID and old format)
      let certToDelete = null;
      let certificateIndex = -1;

      // Try to find by ID first (compare both string and number formats)
      if (certIdStr && !certIdStr.startsWith('temp_')) {
        certificateIndex = userToUpdate.certificates.findIndex(cert => 
          typeof cert === 'object' && (cert.id == certIdStr || String(cert.id) === certIdStr || cert.id === Number(certIdStr))
        );
        if (certificateIndex !== -1) {
          certToDelete = userToUpdate.certificates[certificateIndex];
        }
      } else if (certIdStr && certIdStr.startsWith('temp_')) {
        // Handle temporary ID for old certificates without proper ID
        const parts = certIdStr.split('_');
        const index = parseInt(parts[1]);
        const uploadDate = parts.slice(2).join('_');
        
        certificateIndex = userToUpdate.certificates.findIndex((cert, idx) => 
          idx === index && typeof cert === 'object' && cert.uploadDate === uploadDate
        );
        if (certificateIndex !== -1) {
          certToDelete = userToUpdate.certificates[certificateIndex];
        }
      }

      if (certificateIndex === -1) {
        alert('❌ Sertifikat tidak ditemukan!');
        return;
      }

      // === DELETE FROM FILE SERVER ===
      // File server will handle BOTH file deletion AND database update
      if (certToDelete && certToDelete.id) {
        const fileServerUrl = import.meta.env.VITE_FILE_SERVER_URL || 'https://kp-mocha.vercel.app';
        const response = await fetch(`${fileServerUrl}/delete-certificate/${certToDelete.id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        console.log('✅ Certificate deleted from server and database');
        
        // Update local state to reflect deletion
        const updatedCertificates = userToUpdate.certificates.filter((cert, idx) => idx !== certificateIndex);
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, certificates: updatedCertificates } : user
          )
        );

        showToast('✅ Sertifikat berhasil dihapus!', 'success');
      } else {
        // Old certificate format without ID - just remove from local state
        console.warn('⚠️ Old certificate format - removing from local state only');
        const updatedCertificates = userToUpdate.certificates.filter((cert, idx) => idx !== certificateIndex);
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, certificates: updatedCertificates } : user
          )
        );
        showToast('⚠️ Sertifikat lama dihapus (hanya dari UI)', 'warning');
      }
      
    } catch (error) {
      console.error('❌ Error deleting certificate:', error);
      alert(`❌ Gagal menghapus sertifikat: ${error.message}`);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) {
      alert('❌ User tidak ditemukan dalam daftar!');
      return;
    }

    // Prevent deleting admin users
    if (userToDelete.role === 'admin') {
      alert('⚠️ Tidak dapat menghapus user admin!\n\nUser admin diperlukan untuk mengelola sistem.');
      return;
    }

    // Prevent self-deletion (check if current logged-in admin is trying to delete themselves)
    const currentAdmin = localStorage.getItem('adminAuth') || localStorage.getItem('userAuth');
    if (currentAdmin) {
      try {
        const adminData = JSON.parse(currentAdmin);
        console.log('🔍 Debug - Current admin data:', adminData);
        console.log('🔍 Debug - User to delete:', { id: userId, username: userToDelete.username, role: userToDelete.role });
        
        // Get the current admin's ID properly
        const currentAdminId = adminData.userId || adminData.id;
        const userToDeleteId = userId;
        
        console.log('🔍 Debug - ID comparison:', { 
          currentAdminId, 
          userToDeleteId, 
          currentAdminIdStr: currentAdminId?.toString(),
          userToDeleteIdStr: userToDeleteId?.toString(),
          match: currentAdminId?.toString() === userToDeleteId?.toString() 
        });
        
        // Only prevent deletion if the IDs actually match (same person)
        if (currentAdminId && currentAdminId.toString() === userToDeleteId.toString()) {
          console.log('🚫 Preventing self-deletion');
          alert('⚠️ Tidak dapat menghapus akun Anda sendiri!\n\nAnda sedang login dengan akun ini.');
          return;
        } else {
          console.log('✅ Not self-deletion, proceeding...');
        }
        
      } catch (e) {
        console.error('Error parsing admin data for self-deletion check:', e);
      }
    } else {
      console.log('⚠️ No admin auth data found in localStorage');
    }

    const confirmed = window.confirm(
      `⚠️ PERINGATAN: Hapus User Permanen\n\n` +
      `👤 Nama: ${userToDelete.fullName}\n` +
      `📧 Email: ${userToDelete.email}\n` +
      `🆔 Username: ${userToDelete.username}\n` +
      `🏢 Posisi: ${userToDelete.position || 'Staff'}\n\n` +
      `❌ KONSEKUENSI:\n` +
      `• User akan PERMANEN terhapus dari database\n` +
      `• Username "${userToDelete.username}" tidak dapat login lagi\n` +
      `• Data user tidak dapat dipulihkan\n\n` +
      `Apakah Anda yakin ingin melanjutkan?`
    );

    if (!confirmed) return;

  try {
      console.log(`🗑️ Deleting user ${userId} (${userToDelete.username}) from JSON Server...`);

      // Send DELETE request to Express.js API menggunakan environment URL
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id || currentUser?.userId || ''
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

  console.log('✅ User deleted from JSON Server successfully');

  // Refresh the users list to reflect the deletion
  await fetchUsers();

  // Success toast
  showToast(`User "${userToDelete.fullName}" telah dihapus`, 'success');

  console.log(`✅ User ${userToDelete.fullName} (${userToDelete.username}) deleted successfully`);

    } catch (error) {
      console.error('❌ Error deleting user:', error);
      
      let errorMessage = '❌ Gagal menghapus user!\n\n';
      
      if (error.message.includes('404')) {
        errorMessage += '🔍 User tidak ditemukan di database (mungkin sudah dihapus)';
      } else if (error.message.includes('500')) {
        errorMessage += '🔥 Error server - silakan coba lagi';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage += '🌐 Koneksi ke server gagal - pastikan JSON Server berjalan';
      } else {
        errorMessage += `🐛 Error: ${error.message}`;
      }
      
  errorMessage += '\n\n📞 Hubungi administrator jika masalah berlanjut.';
  // Error toast (short)
  showToast(errorMessage.replace(/\n/g, ' '), 'error', 3500);
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Toast container */}
      <div className={`toast ${toast.visible ? 'show' : ''} ${toast.type}`} role="status" aria-live="polite">
        {toast.message}
      </div>
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Admin Certificate Management Dashboard</h1>
        <p>Manage user certificates and track download analytics</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📜</div>
          <div className="stat-content">
            <h3>{stats.certificatesUploaded}</h3>
            <p>Certificates Uploaded</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⬇️</div>
          <div className="stat-content">
            <h3>{stats.totalDownloads}</h3>
            <p>Total Downloads</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📰</div>
          <div className="stat-content">
            <h3>{news.length}</h3>
            <p>Total Berita</p>
          </div>
        </div>
        <div className="stat-card pending-review">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3 
              style={{ 
                color: '#0f7536', 
                WebkitTextFillColor: '#0f7536',
                fontWeight: '700'
              }}
            >
              {pendingCount ?? 0}
            </h3>
            <p>Menunggu Review</p>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="table-header">
        <h2>User Management</h2>
        <div className="search-container">
          <input
            type="text"
            id="admin-search-users"
            name="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Position</th>
              <th>Certificates</th>
              <th>Downloads</th>
              <th>Last Download</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingUsers ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span>🔄</span>
                    <span>Loading users from server...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span>📭</span>
                    <span>No users found</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <img 
                      src={user.profileImage} 
                      alt={user.fullName}
                      className="user-avatar"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=0F7536&color=fff&size=40`;
                      }}
                    />
                    <div>
                      <div className="user-name">{user.fullName}</div>
                      <div className="user-username">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div>{user.email}</div>
                    <div className="phone">{user.phone}</div>
                  </div>
                </td>
                <td>{user.position}</td>
                <td>
                  <div className="certificates-info">
                    <span className="cert-count">
                      {user.certificates ? user.certificates.length : 0} files
                    </span>
                    {user.certificates && user.certificates.map((cert, index) => (
                      <div key={index} className="cert-file">
                        <span className="cert-name">
                          {typeof cert === 'string' ? cert : cert.fileName || cert.originalName || `Certificate ${index + 1}`}
                        </span>
                        <span className="cert-size">
                          ({typeof cert === 'object' && cert.size ? `${(cert.size / 1024).toFixed(1)} KB` : 'Unknown size'})
                        </span>
                        {typeof cert === 'object' && (cert.id || cert.uploadDate) && (
                          <button 
                            className="delete-cert-btn"
                            onClick={() => handleDeleteCertificate(user.id, cert.id || `temp_${index}_${cert.uploadDate}`)}
                            title="Hapus sertifikat"
                          >
                            ❌
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <span className="download-count">{user.downloads}</span>
                </td>
                <td>{user.lastDownload}</td>
                <td>
                  <div className="action-buttons">
                    <label className="upload-btn">
                      Upload PDF
                      <input
                        type="file"
                        id={`upload-pdf-${user.id}`}
                        name="certificate-upload"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleCertificateUpload(user.id, file);
                        }}
                      />
                    </label>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="certificates-content">
      <h2>Certificate Analytics</h2>
      <p>Detailed certificate management and analytics will be implemented here.</p>
    </div>
  );

  const renderAddUser = () => (
    <div className="add-user-content">
      <div className="add-user-header">
        <h2>Tambah Karyawan Baru</h2>
        <p>Masukkan data lengkap karyawan PERGUNU yang baru</p>
        <div style={{
          background: 'rgba(255,255,255,0.1)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginTop: '1rem',
          fontSize: '0.9rem'
        }}>
          <strong>ℹ️ Info:</strong> Setelah ditambahkan, karyawan dapat login menggunakan username dan password untuk mengakses sistem sertifikat PERGUNU
        </div>
      </div>

      <form onSubmit={handleAddUser} className="add-user-form">
        <div className="form-grid">
          {/* Personal Information Section */}
          <div className="form-section">
            <h3>📋 Informasi Pribadi</h3>
            
            <div className="form-group">
              <label htmlFor="admin-add-fullname">Nama Lengkap *</label>
              <input
                type="text"
                id="admin-add-fullname"
                name="fullName"
                value={newUser.fullName}
                onChange={handleNewUserChange}
                placeholder="Masukkan nama lengkap"
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-add-email">Email *</label>
              <input
                type="email"
                id="admin-add-email"
                name="email"
                value={newUser.email}
                onChange={handleNewUserChange}
                placeholder="contoh@pergunu.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-add-phone">No. Telepon *</label>
              <input
                type="tel"
                id="admin-add-phone"
                name="phone"
                value={newUser.phone}
                onChange={handleNewUserChange}
                placeholder="08123456789"
                required
                autoComplete="tel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-add-address">Alamat</label>
              <textarea
                id="admin-add-address"
                name="address"
                value={newUser.address}
                onChange={handleNewUserChange}
                placeholder="Alamat lengkap karyawan"
                rows="3"
                autoComplete="street-address"
              />
            </div>
          </div>

          {/* Account Information Section */}
          <div className="form-section">
            <h3>🔐 Informasi Akun</h3>
            
            <div className="form-group">
              <label htmlFor="admin-add-username">Username *</label>
              <input
                type="text"
                id="admin-add-username"
                name="username"
                value={newUser.username}
                onChange={handleNewUserChange}
                placeholder="username_unik"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-add-password">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="admin-add-password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  placeholder="Password untuk login karyawan"
                  required
                  minLength="6"
                  style={{ paddingRight: '45px' }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    color: '#6b7280',
                    padding: '0',
                    zIndex: 1
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <small style={{color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block'}}>
                Password ini akan digunakan karyawan untuk login ke sistem (minimal 6 karakter)
              </small>
            </div>

            <div className="form-group">
              <label>Jabatan/Posisi *</label>
              <input
                type="text"
                name="position"
                value={newUser.position}
                onChange={handleNewUserChange}
                placeholder="Guru Matematika, Staff Admin, dll"
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={newUser.status}
                onChange={handleNewUserChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={resetNewUserForm}
            disabled={isSubmitting}
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Menambahkan...' : '✅ Tambah Karyawan'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-content">
      <h2>Download Analytics</h2>
      <p>User download statistics and trends will be displayed here.</p>
    </div>
  );

  const renderApplications = () => (
    <ApplicationManager
  onPendingCountChange={handlePendingCountChange}
  onUsersChanged={fetchUsers}
    />
  );

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header 
        className="admin-header" 
        style={{ 
          background: 'linear-gradient(to right, #0f7536, #56b269)',
          backgroundImage: 'linear-gradient(to right, #0f7536, #56b269)'
        }}
      >
        <div className="header-content">
          <h1>PERGUNU Admin</h1>
          <div className="header-actions">
            <div className="admin-profile">
              <img 
                src="https://ui-avatars.com/api/?name=Admin&background=0F7536&color=fff&size=32" 
                alt="Admin" 
                className="admin-avatar"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMwRjc1MzYiLz4KPHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkE8L3RleHQ+Cjwvc3ZnPgo=';
                }}
              />
              <span>Admin</span>
            </div>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Keluar dari Admin Dashboard"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <div className="nav-content">
          <button
            className="nav-item back-to-website"
            onClick={() => navigate('/')}
            title="Kembali ke Website Utama"
          >
            ← Back to Website
          </button>
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'add-user' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-user')}
          >
            Add User
          </button>
          <button
            className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </button>
          <button
            className={`nav-item ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            News
          </button>
          <button
            className={`nav-item ${activeTab === 'beasiswa' ? 'active' : ''}`}
            onClick={() => setActiveTab('beasiswa')}
          >
            Beasiswa
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'add-user' && renderAddUser()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'news' && (
          <div className="card">
            <NewsManager />
          </div>
        )}
        {activeTab === 'beasiswa' && (
          <div className="card">
            <BeasiswaManager />
          </div>
        )}
      </main>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button 
                className="close-btn"
                onClick={handleCloseEditModal}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSaveEditUser} className="user-form">
              <div className="form-group">
                <label htmlFor="edit-user-fullname">Full Name</label>
                <input
                  type="text"
                  id="edit-user-fullname"
                  name="fullName"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-user-username">Username</label>
                <input
                  type="text"
                  id="edit-user-username"
                  name="username"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={editingUser.position}
                  onChange={(e) => setEditingUser({...editingUser, position: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password (leave blank to keep current password)</label>
                <div className="password-input-container">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                    placeholder="Enter new password or leave blank"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                  >
                    {showEditPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCloseEditModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
