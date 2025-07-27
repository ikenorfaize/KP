// AdminDashboard.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import ApplicationManager from '../../componen/ApplicationManager/ApplicationManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    certificatesUploaded: 0,
    totalDownloads: 0
  });

  // State for new user form
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    position: '',
    address: '',
    phone: '',
    status: 'active',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // State for editing user
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Fetch users from JSON Server
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoadingUsers(true);
      console.log('🔄 Fetching users from JSON Server...');
      
      const response = await fetch('http://localhost:3001/users');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const userData = await response.json();
      console.log('✅ Users fetched:', userData.length, 'users');
      
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
      console.log('⚠️ Using fallback mock data');
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

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  // Update stats when computed values change
  useEffect(() => {
    setStats(computedStats);
  }, [computedStats]);

  // Logout function
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('userSession');
    
    // Show confirmation
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar dari admin dashboard?');
    
    if (confirmed) {
      console.log('🚪 Admin logging out...');
      // Navigate to home page
      navigate('/', { replace: true });
    }
  };

  // Handle new user form input changes
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset new user form
  const resetNewUserForm = () => {
    setNewUser({
      fullName: '',
      email: '',
      username: '',
      password: '',
      position: '',
      address: '',
      phone: '',
      status: 'active',
      role: 'user'
    });
    setShowPassword(false); // Reset password visibility
  };

  // Handle editing user
  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      password: '' // Always start with empty password for security
    });
    setShowEditModal(true);
    setShowEditPassword(false);
  };

  // Handle edit user form changes
  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save edited user
  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🔄 Updating user...');

      // Prepare update data
      const updateData = {
        fullName: editingUser.fullName.trim(),
        email: editingUser.email.trim(),
        username: editingUser.username.trim(),
        position: editingUser.position.trim(),
        address: editingUser.address.trim(),
        phone: editingUser.phone.trim(),
        status: editingUser.status,
        role: editingUser.role
      };

      // Only update password if a new one is provided
      if (editingUser.password && editingUser.password.trim()) {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(editingUser.password.trim(), saltRounds);
        updateData.password = hashedPassword;
        console.log('🔐 Password updated');
      }

      // Send update to JSON Server
      const response = await fetch(`http://localhost:3001/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const updatedUser = await response.json();
      console.log('✅ User updated:', updatedUser);

      // Refresh the users list
      await fetchUsers();

      // Close modal
      setShowEditModal(false);
      setEditingUser(null);

      alert('✅ User berhasil diupdate!');

    } catch (error) {
      console.error('❌ Error updating user:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setShowEditPassword(false);
  };

  // Handle new user submission
  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = ['fullName', 'email', 'username', 'password', 'position', 'phone'];
      for (const field of requiredFields) {
        if (!newUser[field].trim()) {
          alert(`${field.charAt(0).toUpperCase() + field.slice(1)} is required!`);
          setIsSubmitting(false);
          return;
        }
      }

      // Check if username or email already exists
      const existingUser = users.find(user => 
        user.username === newUser.username || user.email === newUser.email
      );
      
      if (existingUser) {
        alert('Username atau email sudah digunakan!');
        setIsSubmitting(false);
        return;
      }

      console.log('🔄 Adding new user to JSON Server...');

      // Hash password before sending to server
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newUser.password.trim(), saltRounds);
      console.log('🔐 Password hashed successfully');

      // Create new user object for JSON Server
      const userToAdd = {
        fullName: newUser.fullName.trim(),
        email: newUser.email.trim(),
        username: newUser.username.trim(),
        password: hashedPassword, // Now properly hashed
        position: newUser.position.trim(),
        address: newUser.address.trim(),
        phone: newUser.phone.trim(),
        status: newUser.status,
        role: newUser.role,
        createdAt: new Date().toISOString()
      };

      // Send to JSON Server
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToAdd)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const savedUser = await response.json();
      console.log('✅ User saved to JSON Server:', savedUser);

      // Refresh the users list to show the new user
      await fetchUsers();

      // Show success message
      alert(`✅ Karyawan ${newUser.fullName} berhasil ditambahkan!\n\nCredentials:\n👤 Username: ${newUser.username}\n🔑 Password: ${newUser.password}\n\nUser dapat login dengan credentials ini.`);

      // Reset form
      resetNewUserForm();

      // Switch to dashboard tab to show the new user
      setActiveTab('dashboard');

      console.log('✅ New user added successfully:', userWithAvatar);

    } catch (error) {
      console.error('❌ Error adding user:', error);
      
      // Fallback: save to localStorage if JSON Server fails
      console.log('⚠️ JSON Server failed, saving to local state only');
      
      const userToAdd = {
        id: Date.now().toString(),
        ...newUser,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.fullName)}&background=0F7536&color=fff`,
        downloads: 0,
        certificates: [],
        lastDownload: null,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, userToAdd]);
      
      alert(`⚠️ User ditambahkan ke local state (JSON Server error).\n\nCredentials:\n👤 Username: ${newUser.username}\n🔑 Password: ${newUser.password}\n\nNOTE: Data mungkin tidak persisten!`);
      
      resetNewUserForm();
      setActiveTab('dashboard');
    } finally {
      setIsSubmitting(false);
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

  // Handle file upload
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

    const loadingAlert = alert('🔄 Mengupload sertifikat...');

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${timestamp}_${sanitizedFileName}`;

      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Create file data object
          const fileData = {
            id: timestamp,
            fileName: file.name,
            originalName: file.name,
            uniqueName: uniqueFileName,
            size: file.size,
            uploadDate: new Date().toISOString(),
            base64Data: e.target.result,
            downloadCount: 0
          };

          // Get current user data
          const userToUpdate = users.find(user => user.id === userId);
          if (!userToUpdate) {
            alert('❌ User tidak ditemukan!');
            return;
          }

          // Update certificates array
          const updatedCertificates = [...(userToUpdate.certificates || []), fileData];

          const updatedUser = {
            ...userToUpdate,
            certificates: updatedCertificates
          };

          // Update local state
          setUsers(prevUsers =>
            prevUsers.map(user =>
              user.id === userId ? updatedUser : user
            )
          );

          // Update in JSON Server
          const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          console.log('✅ Certificate uploaded successfully:', fileData);
          alert(`✅ Sertifikat "${file.name}" berhasil diupload untuk ${userToUpdate.fullName}!`);
          
        } catch (error) {
          console.error('❌ Error uploading certificate:', error);
          alert(`❌ Gagal mengupload sertifikat: ${error.message}`);
        }
      };

      reader.onerror = () => {
        console.error('❌ Error reading file');
        alert('❌ Gagal membaca file. Silakan coba lagi.');
      };

      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('❌ Error handling file upload:', error);
      alert(`❌ Terjadi kesalahan: ${error.message}`);
    }
  };

  // Handle certificate deletion
  const handleDeleteCertificate = async (userId, certificateId) => {
    if (!confirm('❗ Apakah Anda yakin ingin menghapus sertifikat ini?')) {
      return;
    }

    try {
      // Find user and update certificates
      const userToUpdate = users.find(user => user.id === userId);
      if (!userToUpdate) {
        alert('❌ User tidak ditemukan!');
        return;
      }

      // Filter out the certificate to delete
      const updatedCertificates = userToUpdate.certificates.filter(cert => {
        if (typeof cert === 'object') {
          return cert.id !== certificateId;
        }
        return true; // Keep string certificates
      });

      const updatedUser = {
        ...userToUpdate,
        certificates: updatedCertificates
      };

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? updatedUser : user
        )
      );

      // Update in JSON Server
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('✅ Sertifikat berhasil dihapus!');
      
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

      // Send DELETE request to JSON Server
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('✅ User deleted from JSON Server successfully');

      // Refresh the users list to reflect the deletion
      await fetchUsers();

      // Show success message
      alert(
        `✅ User Berhasil Dihapus!\n\n` +
        `👤 "${userToDelete.fullName}" telah dihapus dari sistem\n` +
        `🚫 Username "${userToDelete.username}" tidak dapat digunakan untuk login\n` +
        `📊 Data user telah dihapus dari database`
      );

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
      
      alert(errorMessage);
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
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
            <h3>{stats.totalUsers}</h3>
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
      </div>

      {/* Search and Actions */}
      <div className="table-header">
        <h2>User Management</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
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
                          {typeof cert === 'string' ? cert : cert.fileName || cert.originalName}
                        </span>
                        {typeof cert === 'object' && cert.id && (
                          <button 
                            className="delete-cert-btn"
                            onClick={() => handleDeleteCertificate(user.id, cert.id)}
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
              <label>Nama Lengkap *</label>
              <input
                type="text"
                name="fullName"
                value={newUser.fullName}
                onChange={handleNewUserChange}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleNewUserChange}
                placeholder="contoh@pergunu.com"
                required
              />
            </div>

            <div className="form-group">
              <label>No. Telepon *</label>
              <input
                type="tel"
                name="phone"
                value={newUser.phone}
                onChange={handleNewUserChange}
                placeholder="081234567890"
                required
              />
            </div>

            <div className="form-group">
              <label>Alamat</label>
              <textarea
                name="address"
                value={newUser.address}
                onChange={handleNewUserChange}
                placeholder="Alamat lengkap karyawan"
                rows="3"
              />
            </div>
          </div>

          {/* Account Information Section */}
          <div className="form-section">
            <h3>🔐 Informasi Akun</h3>
            
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleNewUserChange}
                placeholder="username_unik"
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  placeholder="Password untuk login karyawan"
                  required
                  minLength="6"
                  style={{ paddingRight: '45px' }}
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
    <ApplicationManager />
  );

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
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
              <span>🚪</span>
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
            📝 Applications
          </button>
          <button
            className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            Certificates
          </button>
          <button
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'add-user' && renderAddUser()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'certificates' && renderCertificates()}
        {activeTab === 'analytics' && renderAnalytics()}
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
                <label>Full Name</label>
                <input
                  type="text"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  required
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
