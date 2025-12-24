// NewsManager.jsx - Komponen untuk mengelola berita dengan editor seperti GitHub
import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './NewsManager.css';
import { stripHtmlTags, getExcerpt } from '../../utils/htmlUtils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
const FILE_SERVER = import.meta.env.VITE_FILE_SERVER_URL || 'https://kp-mocha.vercel.app';

export default function NewsManager() {
  // Get current user for authentication
  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || '{}');
    } catch {
      return {};
    }
  });

  // States untuk mengelola data berita
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // States untuk form berita baru
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: 'general',
    image: '',
    imageFile: null
  });

  // States untuk editor mode (Write / Preview seperti GitHub)
  const [editorMode, setEditorMode] = useState('write'); // 'write' atau 'preview'

  // Ref dan state untuk Quill editor
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  // Categories untuk berita
  const categories = [
    { value: 'general', label: 'Umum' },
    { value: 'education', label: 'Pendidikan' },
    { value: 'event', label: 'Acara' },
    { value: 'announcement', label: 'Pengumuman' },
    { value: 'achievement', label: 'Prestasi' }
  ];

  // Helper function untuk mendapatkan URL gambar yang benar
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Jika blob URL (untuk preview upload), gunakan langsung
    if (imagePath.startsWith('blob:')) return imagePath;
    
    // Jika sudah URL lengkap, gunakan langsung
    if (imagePath.startsWith('http')) return imagePath;
    
    // Jika path dimulai dengan /src/assets, gunakan langsung (gambar existing)
    if (imagePath.startsWith('/src/assets/') || imagePath.startsWith('src/assets/')) {
      return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    }
    
    // Jika path dimulai dengan /, tambahkan FILE_SERVER prefix
    if (imagePath.startsWith('/')) {
      return `${FILE_SERVER}${imagePath}`;
    }
    
    // Default: anggap file upload di folder uploads/images
    return `${FILE_SERVER}/uploads/images/${imagePath}`;
  };

  // Fetch berita dari API dengan auto-sort (featured di atas)
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/news`);
      if (response.ok) {
        const data = await response.json();
        
        // Sort: Featured news di paling atas, kemudian sort by createdAt (terbaru dulu)
        const sortedData = data.sort((a, b) => {
          // Featured news selalu di atas
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          // Jika sama-sama featured atau sama-sama non-featured, sort by date
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setNewsList(sortedData);
        console.log('✅ News loaded and sorted (featured first):', sortedData.length, 'items');
      } else {
        setError('Gagal memuat data berita');
      }
    } catch (_error) {
      setError('Error koneksi ke server');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data saat component mount
  useEffect(() => {
    fetchNews();
  }, []);

  // Clear messages setelah beberapa detik
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Initialize Quill editor - FIXED VERSION untuk mencegah duplikasi toolbar
  useEffect(() => {
    // Cleanup function untuk membersihkan Quill instance yang lama
    const cleanupQuill = () => {
      if (quillInstance.current) {
        try {
          // Hapus event listeners
          quillInstance.current.off('text-change');
          // Hapus DOM elements yang dibuat Quill
          const toolbar = quillRef.current?.previousSibling;
          if (toolbar && toolbar.classList?.contains('ql-toolbar')) {
            toolbar.remove();
          }
          // Reset instance
          quillInstance.current = null;
          console.log('🧹 Quill editor cleaned up completely');
        } catch (error) {
          console.warn('Warning during Quill cleanup:', error);
          quillInstance.current = null;
        }
      }
    };

    // Hanya inisialisasi jika dalam mode write dan belum ada instance
    if (quillRef.current && editorMode === 'write') {
      // Cleanup instance lama jika ada
      cleanupQuill();
      
      // Bersihkan DOM element sebelum inisialisasi
      if (quillRef.current) {
        quillRef.current.innerHTML = '';
        // Hapus toolbar lama jika ada
        const existingToolbar = quillRef.current.previousSibling;
        if (existingToolbar && existingToolbar.classList?.contains('ql-toolbar')) {
          existingToolbar.remove();
        }
      }

      try {
        // Konfigurasi toolbar Quill
        const toolbarOptions = [
          // Format teks dasar
          ['bold', 'italic', 'underline', 'strike'],
          
          // Header dan font
          [{ 'header': [1, 2, 3, false] }],
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          
          // Warna
          [{ 'color': [] }, { 'background': [] }],
          
          // Alignment
          [{ 'align': [] }],
          
          // Lists dan indentasi
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          
          // Quote dan code
          ['blockquote', 'code-block'],
          
          // Link dan image
          ['link', 'image'],
          
          // Clean formatting
          ['clean']
        ];

        quillInstance.current = new Quill(quillRef.current, {
          theme: 'snow',
          modules: {
            toolbar: toolbarOptions
          },
          placeholder: 'Tulis konten berita di sini...',
          formats: [
            'header', 'font', 'size',
            'bold', 'italic', 'underline', 'strike',
            'color', 'background',
            'list', 'indent',
            'align',
            'link', 'image', 'blockquote', 'code-block'
          ]
        });

        // Event handler untuk perubahan konten
        quillInstance.current.on('text-change', () => {
          const html = quillInstance.current.root.innerHTML;
          // Update formData dengan debounce untuk performa
          setFormData(prev => ({
            ...prev,
            content: html
          }));
        });

        // Event handler untuk saat kehilangan fokus (blur)
        quillInstance.current.root.addEventListener('blur', () => {
          const html = quillInstance.current.root.innerHTML;
          setFormData(prev => ({
            ...prev,
            content: html
          }));
        });

        // Set konten awal jika ada
        if (formData.content) {
          quillInstance.current.root.innerHTML = formData.content;
        }

        console.log('✅ Quill editor initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing Quill editor:', error);
      }
    } else if (editorMode !== 'write') {
      // Cleanup saat tidak dalam write mode
      cleanupQuill();
    }

    // Cleanup function untuk useEffect
    return () => {
      if (editorMode !== 'write') {
        cleanupQuill();
      }
    };
  }, [editorMode, isCreating]);

  // Update Quill content ketika formData.content berubah dari luar
  useEffect(() => {
    if (quillInstance.current && formData.content !== quillInstance.current.root.innerHTML) {
      // Avoid infinite loop by checking if content actually differs
      const currentContent = quillInstance.current.root.innerHTML;
      if (currentContent === '<p><br></p>' && !formData.content) {
        return; // Skip update for empty state
      }
      quillInstance.current.root.innerHTML = formData.content || '';
    }
  }, [formData.content, quillInstance]);

  // Function untuk reset Quill editor - IMPROVED VERSION
  const resetQuillEditor = () => {
    if (quillInstance.current) {
      try {
        quillInstance.current.setText('');
        setFormData(prev => ({ ...prev, content: '' }));
        console.log('🔄 Quill editor reset successfully');
      } catch (error) {
        console.warn('Warning during Quill reset:', error);
      }
    }
  };

  // Function untuk memaksa re-render Quill saat tab berubah - FIXED VERSION
  const handleTabChange = (mode) => {
    console.log(`🔄 Switching editor mode from ${editorMode} to ${mode}`);
    setEditorMode(mode);
    
    // Tidak perlu logic tambahan - useEffect akan handle inisialisasi/cleanup
  };

  // Handle perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle upload gambar cover
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.');
        return;
      }

      // Validasi ukuran file (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('Ukuran gambar terlalu besar. Maksimal 5MB.');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Store file and preview
      setFormData(prev => ({
        ...prev,
        image: previewUrl,
        imageFile: file
      }));
      
      console.log('📷 Image uploaded successfully:', {
        fileName: file.name,
        previewUrl: previewUrl,
        fileSize: file.size
      });
      
      setSuccess('Gambar dipilih! Akan diupload saat menyimpan berita.');
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    if (formData.image && formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
    }
    setFormData(prev => ({
      ...prev,
      image: '',
      imageFile: null
    }));
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  // Submit form berita baru atau edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Sync content dari Quill editor sebelum submit
      let finalFormData = { ...formData };
      if (quillInstance.current && quillInstance.current.root && editorMode === 'write') {
        const quillContent = quillInstance.current.root.innerHTML;
        finalFormData.content = quillContent;
      }

      // Handle image upload to local file server first, then submit news data
      let response;
      let uploadedImagePath = formData.image; // Keep existing image if no new file
      
      if (formData.imageFile) {
        // Upload image to local backend file server
        const imageFormData = new FormData();
        imageFormData.append('image', formData.imageFile);
        
        console.log('📷 Uploading image file to local server:', formData.imageFile.name);
        console.log('📍 Upload URL:', `${API_BASE}/upload/image`);
        
        const imageUploadResponse = await fetch(`${API_BASE}/upload/image`, {
          method: 'POST',
          body: imageFormData
        });
        
        if (!imageUploadResponse.ok) {
          const errorText = await imageUploadResponse.text();
          console.error('❌ Upload failed:', errorText);
          throw new Error('Failed to upload image to server');
        }
        
        const imageResult = await imageUploadResponse.json();
        uploadedImagePath = imageResult.url; // Use server URL: /uploads/images/filename.jpg
        console.log('✅ Image uploaded successfully to local server:', uploadedImagePath);
      }

      // Now submit news data with image URL
      const newsData = {
        title: finalFormData.title,
        content: finalFormData.content,
        author: finalFormData.author || '',
        category: finalFormData.category,
        image: uploadedImagePath // Use local server path
      };

      const url = editingId 
        ? `${API_BASE}/news/${editingId}`
        : `${API_BASE}/news`;
      const method = editingId ? 'PUT' : 'POST';

      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id || currentUser?.userId || ''
        },
        body: JSON.stringify(newsData)
      });

      if (response.ok) {
        const updatedNews = await response.json();
        setSuccess(editingId ? 'Berita berhasil diupdate!' : 'Berita berhasil dibuat!');
        
        // Dispatch event untuk sinkronisasi gambar
        if (uploadedImagePath) {
          // uploadedImagePath is local server path like /uploads/images/123456.jpg
          const fullImageUrl = uploadedImagePath;
            
          window.dispatchEvent(new CustomEvent('news-image-updated', {
            detail: {
              newsId: updatedNews.id || editingId,
              imageUrl: fullImageUrl,
              featured: updatedNews.featured || false
            }
          }));
          
          // Jika ini featured news, update featured image juga
          if (updatedNews.featured) {
            window.dispatchEvent(new CustomEvent('featured-news-changed', {
              detail: {
                imageUrl: fullImageUrl,
                newsData: updatedNews
              }
            }));
          }
        }
        
        // Clean up blob URLs
        if (formData.image && formData.image.startsWith('blob:')) {
          URL.revokeObjectURL(formData.image);
        }
        
        setFormData({ title: '', content: '', author: '', category: 'general', image: '', imageFile: null });
        setIsCreating(false);
        setEditingId(null);
        setEditorMode('write');
        await fetchNews(); // Refresh data
        // Trigger custom event for live update
        window.dispatchEvent(new Event('news-updated'));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal menyimpan berita');
      }
    } catch (_error) {
      setError('Error koneksi ke server');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit berita - IMPROVED VERSION
  const handleEdit = (news) => {
    console.log('📝 Starting edit mode for news:', news.id);
    
    setFormData({
      title: news.title,
      content: news.content,
      author: news.author || '',
      category: news.category || 'general',
      image: news.image || '',
      imageFile: null
    });
    setEditingId(news.id);
    setIsCreating(true);
    setEditorMode('write');
    
    // Update Quill editor setelah state update dengan timeout yang lebih aman
    setTimeout(() => {
      if (quillInstance.current && news.content) {
        try {
          quillInstance.current.root.innerHTML = news.content;
          console.log('✅ Quill content updated for edit');
        } catch (error) {
          console.warn('Warning updating Quill content:', error);
        }
      }
    }, 150); // Slightly longer timeout for better reliability
  };

  // Toggle featured news (with improved UX)
  const handleSetFeatured = async (newsId, currentFeaturedStatus) => {
    try {
      // Jika sedang featured dan diklik lagi, batalkan featured
      if (currentFeaturedStatus) {
        if (!confirm('Batalkan berita utama ini?')) {
          return;
        }
      } else {
        // Jika belum featured, jadikan utama (auto-unset yang lama)
        if (!confirm('Jadikan berita ini sebagai berita utama? Berita utama sebelumnya akan diganti.')) {
          return;
        }
      }

      console.log(`⭐ ${currentFeaturedStatus ? 'Unsetting' : 'Setting'} news ${newsId} as featured...`);
      
      const response = await fetch(`${API_BASE}/news/${newsId}/feature`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id || currentUser?.userId || ''
        },
        body: JSON.stringify({ featured: !currentFeaturedStatus })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ News ${currentFeaturedStatus ? 'unset' : 'set'} as featured successfully`, result);
        setSuccess(currentFeaturedStatus ? '✅ Status berita utama dibatalkan!' : '✅ Berita berhasil dijadikan utama!');
        
        // Get the updated news data to send complete information
        const newsData = result.data || result;
        let imageUrl = newsData.image || newsData.imageUrl;
        
        // Convert image path to full URL if needed
        if (imageUrl && imageUrl.startsWith('/uploads/')) {
          imageUrl = `${FILE_SERVER}${imageUrl}`;
        } else if (imageUrl && !imageUrl.includes('/') && !imageUrl.startsWith('http') && !imageUrl.startsWith('/src/')) {
          imageUrl = `${FILE_SERVER}/uploads/images/${imageUrl}`;
        }
        
        // Dispatch event untuk sinkronisasi dengan homepage
        window.dispatchEvent(new CustomEvent('featured-news-changed', {
          detail: {
            newsId: newsId,
            featured: !currentFeaturedStatus,
            imageUrl: imageUrl,
            title: newsData.title
          }
        }));
        
        // Also update the NewsImageContext
        if (!currentFeaturedStatus && imageUrl) {
          window.dispatchEvent(new CustomEvent('news-image-updated', {
            detail: {
              newsId: newsId,
              imageUrl: imageUrl,
              featured: true
            }
          }));
        }
        
        await fetchNews(); // Reload news list with auto-sort
        window.dispatchEvent(new Event('news-updated'));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to set featured:', response.status, errorData);
        setError(`Gagal mengubah status berita utama: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Set featured error:', error);
      setError(`Gagal koneksi ke server: ${error.message}`);
    }
  };

  // Delete berita
  const handleDelete = async (newsId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      return;
    }

    setIsLoading(true);
    try {
  const response = await fetch(`${API_BASE}/news/${newsId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': currentUser?.id || currentUser?.userId || ''
        }
      });

      if (response.ok) {
        setSuccess('Berita berhasil dihapus!');
        await fetchNews(); // Refresh data
      } else {
        setError('Gagal menghapus berita');
      }
    } catch (_error) {
      setError('Error koneksi ke server');
    } finally {
      setIsLoading(false);
    }
  };

  // View berita (buka di tab baru)
  const handleView = (newsId) => {
    window.open(`/berita/${newsId}`, '_blank');
  };

  // Cancel editing - IMPROVED VERSION dengan cleanup yang lebih baik
  const handleCancel = () => {
    console.log('❌ Canceling editor');
    
    // Clean up blob URLs
    if (formData.image && formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
    }
    
    setIsCreating(false);
    setEditingId(null);
    setFormData({ title: '', content: '', author: '', category: 'general', image: '', imageFile: null });
    setEditorMode('write');
    
    // Reset Quill editor dengan delay untuk memastikan state sudah terupdate
    setTimeout(() => {
      resetQuillEditor();
    }, 50);
  };

  // Format tanggal untuk tampilan
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="news-manager">
      <div className="news-header">
        <h2>📰 Manajemen Berita</h2>
        <button 
          className="btn-create"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? '❌ Batal' : '➕ Buat Berita Baru'}
        </button>
      </div>

      {/* Pesan sukses/error */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Form pembuatan/edit berita */}
      {isCreating && (
        <div className="create-form">
          <h3>{editingId ? 'Edit Berita' : 'Buat Berita Baru'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Judul Berita *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul berita..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Kategori</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="author">Penulis</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Nama penulis (opsional)"
              />
            </div>

            {/* Upload Gambar Cover */}
            <div className="form-group">
              <label htmlFor="image-upload">🖼️ Gambar Cover</label>
              <div className="image-upload-container">
                {console.log('🔍 FormData.image:', formData.image)}
                {!formData.image ? (
                  <div className="image-upload-area">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                    />
                    <label htmlFor="image-upload" className="image-upload-label">
                      <div className="image-upload-content">
                        <div className="image-upload-icon">📷</div>
                        <div className="image-upload-text">
                          <strong>Pilih gambar cover</strong>
                          <p>atau drag & drop gambar di sini</p>
                          <small>Format: JPG, PNG, WebP (Max: 5MB)</small>
                        </div>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <div className="image-preview">
                      <img 
                        src={getImageUrl(formData.image)} 
                        alt="Preview cover"
                        className="preview-image"
                      />
                      <div className="image-overlay">
                        <button 
                          type="button" 
                          onClick={removeImage}
                          className="remove-image-btn"
                          title="Hapus gambar"
                        >
                          🗑️
                        </button>
                        <label 
                          htmlFor="image-upload" 
                          className="change-image-btn"
                          title="Ganti gambar"
                        >
                          🔄
                        </label>
                      </div>
                    </div>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                      style={{ display: 'none' }}
                    />
                    <div className="image-info">
                      <p><strong>📁 File:</strong> {formData.imageFile?.name || 'Gambar existing'}</p>
                      <small>✅ Gambar siap digunakan sebagai cover berita</small>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* GitHub-style editor dengan tabs */}
            <div className="form-group">
              <label>Konten Berita *</label>
              <div className="editor-container">
                {/* Tab header seperti GitHub */}
                <div className="editor-tabs">
                  <button
                    type="button"
                    className={`tab ${editorMode === 'write' ? 'active' : ''}`}
                    onClick={() => handleTabChange('write')}
                  >
                    ✏️ Write
                  </button>
                  <button
                    type="button"
                    className={`tab ${editorMode === 'preview' ? 'active' : ''}`}
                    onClick={() => handleTabChange('preview')}
                  >
                    👁️ Preview
                  </button>
                </div>

                {/* Editor content */}
                <div className="editor-content">
                  {editorMode === 'write' ? (
                    <div className="write-mode">
                      {/* Quill Rich Text Editor */}
                      <div ref={quillRef} className="quill-editor"></div>
                      
                      {/* Hidden textarea untuk form submission */}
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={() => {}} // Controlled by Quill
                        style={{ display: 'none' }}
                        required
                      />
                      
                      <div className="editor-help">
                        <small>
                          💡 <strong>Tips:</strong> Gunakan toolbar di atas untuk memformat teks. 
                          Klik tab "Preview" untuk melihat hasil.
                        </small>
                      </div>
                    </div>
                  ) : (
                    <div className="preview-mode">
                      <div className="preview-header">
                        <h4>{formData.title || 'Judul Berita'}</h4>
                        {formData.author && <p className="preview-author">Oleh: {formData.author}</p>}
                      </div>
                      {formData.image && (
                        <div className="preview-image-container">
                          <img 
                            src={getImageUrl(formData.image)} 
                            alt="Cover berita"
                            className="preview-cover-image"
                            onLoad={() => console.log('✅ Preview image loaded:', formData.image)}
                            onError={(e) => {
                              console.error('❌ Preview image failed to load:', formData.image);
                              console.error('Error details:', e);
                            }}
                          />
                        </div>
                      )}
                      <div className="preview-content" dangerouslySetInnerHTML={{ __html: formData.content || '<p>Belum ada konten...</p>' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isLoading} className="btn-submit">
                {isLoading ? '⏳ Menyimpan...' : editingId ? '💾 Update Berita' : '💾 Simpan Berita'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn-cancel"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar berita yang sudah ada */}
      <div className="news-list">
        <div className="admin-news-list__header">
          <h3>📋 Daftar Berita ({newsList.length})</h3>
        </div>
        {isLoading && <div className="loading">⏳ Memuat data...</div>}
        
        <div className="admin-news-scrollable-container">
          {newsList.length === 0 && !isLoading ? (
            <div className="empty-state">
              <p>📰 Belum ada berita. Buat berita pertama Anda!</p>
            </div>
          ) : (
          <div className="admin-news-grid">
            {newsList.map((news) => (
              <div 
                key={news.id} 
                id={`admin-news-card-${news.id}`}
                data-news-id={news.id}
                className={`admin-news-card ${news.featured ? 'admin-news-card--featured' : ''}`}
              >
                {news.image && (
                  <div className="admin-news-card__image">
                    <img 
                      src={getImageUrl(news.image)} 
                      alt={news.title}
                      className="admin-card-cover"
                    />
                  </div>
                )}
                <div className="admin-news-card__header">
                  <h4 className="admin-news-card__title">{news.title}</h4>
                  <span className="admin-news-card__category">{categories.find(c => c.value === news.category)?.label || news.category}</span>
                </div>
                <div className="admin-news-card__meta">
                  <span>👤 {news.author || 'Tim Redaksi PERGUNU'}</span>
                  <span>📅 {formatDate(news.createdAt)}</span>
                </div>
                <div className="admin-news-card__content">
                  {getExcerpt(news.content, 150)}
                </div>
                <div className="admin-news-card__actions">
                  <button
                    className={`btn-feature ${news.featured ? 'btn-feature--active' : ''}`}
                    onClick={() => handleSetFeatured(news.id, news.featured)}
                    title={news.featured ? 'Klik untuk batalkan berita utama' : 'Jadikan berita utama'}
                  >
                    {news.featured ? '⭐ Berita Utama' : '⭐ Jadikan Utama'}
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(news)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(news.id)}
                  >
                    🗑️ Hapus
                  </button>
                  <button 
                    className="btn-view"
                    onClick={() => handleView(news.id)}
                  >
                    👁️ Lihat
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
