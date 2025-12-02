// NewsManager.jsx - Komponen untuk mengelola berita dengan editor seperti GitHub
import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './NewsManager.css';
import { stripHtmlTags, getExcerpt } from '../../utils/htmlUtils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
const FILE_SERVER = import.meta.env.VITE_FILE_SERVER_URL || 'https://kp-mocha.vercel.app';

export default function NewsManager() {
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
    
    // Jika path dimulai dengan /, gunakan langsung
    if (imagePath.startsWith('/')) return imagePath;
    
    // Default: anggap file upload di folder uploads/images
    return `${FILE_SERVER}/uploads/images/${imagePath}`;
  };

  // Fetch berita dari API
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/news`);
      if (response.ok) {
        const data = await response.json();
        setNewsList(data);
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

      // Handle image upload using file-server first, then submit news data
      let response;
      let uploadedImagePath = formData.image; // Keep existing image if no new file
      
      if (formData.imageFile) {
        // First, upload image to Cloudinary via API
        const imageFormData = new FormData();
        imageFormData.append('image', formData.imageFile);
        
        console.log('📷 Uploading image file to Cloudinary via API:', formData.imageFile.name);
        console.log('📍 Upload URL:', `${API_BASE}/upload/image`);
        
        const imageUploadResponse = await fetch(`${API_BASE}/upload/image`, {
          method: 'POST',
          body: imageFormData
        });
        
        if (!imageUploadResponse.ok) {
          const errorText = await imageUploadResponse.text();
          console.error('❌ Upload failed:', errorText);
          throw new Error('Failed to upload image to Cloudinary');
        }
        
        const imageResult = await imageUploadResponse.json();
        uploadedImagePath = imageResult.url; // Use Cloudinary URL directly
        console.log('✅ Image uploaded successfully to Cloudinary:', uploadedImagePath);
      }

      // Now submit news data with image URL
      const newsData = {
        title: finalFormData.title,
        content: finalFormData.content,
        author: finalFormData.author || '',
        category: finalFormData.category,
        image: uploadedImagePath // Use Cloudinary URL or existing path
      };

      const url = editingId 
        ? `${API_BASE}/news/${editingId}`
        : `${API_BASE}/news`;
      const method = editingId ? 'PUT' : 'POST';

      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newsData)
      });

      if (response.ok) {
        const updatedNews = await response.json();
        setSuccess(editingId ? 'Berita berhasil diupdate!' : 'Berita berhasil dibuat!');
        
        // Dispatch event untuk sinkronisasi gambar
        if (uploadedImagePath) {
          // uploadedImagePath is already a full Cloudinary URL from the upload response
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

  // Set berita sebagai featured (utama)
  const handleSetFeatured = async (newsId) => {
    try {
      const response = await fetch(`${API_BASE}/news/${newsId}/feature`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: true })
      });
      
      if (response.ok) {
        setSuccess('Berita dijadikan utama!');
        await fetchNews();
        // Trigger custom event for live update
        window.dispatchEvent(new Event('news-updated'));
      } else {
        setError('Gagal menjadikan berita utama');
      }
    } catch (_error) {
      setError('Gagal koneksi ke server');
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
        method: 'DELETE'
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

  // Render konten dengan format markdown lengkap (currently unused but available for future use)
  const _renderPreview = (content) => {
    if (!content) return <p className="preview-empty">Tidak ada konten untuk dipreview</p>;
    
    // Parse markdown dengan format lengkap
    let html = content
      // Article Lead (paragraph pertama dengan class khusus)
      .replace(/^([^\n#\-\*].+?)(\n\n)/m, '<p class="article-lead">$1</p>$2')
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold dan Italic (urutan penting!)
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>') // Bold + Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*([^*]*)\*/g, '<em>$1</em>') // Italic
      // Lists dengan (-) dan (*)
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\\* (.*$)/gm, '<li>$1</li>')
      // Wrap consecutive list items
      .replace(/(<li>.*<\/li>(?:\s*<li>.*<\/li>)*)/gs, '<ul>$1</ul>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Line breaks dan paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap in paragraphs jika belum ada
    if (!html.includes('<p>') && !html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>')) {
      html = '<p>' + html + '</p>';
    }
    
    return <div className="preview-content" dangerouslySetInnerHTML={{ __html: html }} />;
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
                  {news.featured && (
                    <span className="admin-news-card__badge">⭐ Utama</span>
                  )}
                  {!news.featured && (
                    <button
                      className="btn-feature"
                      onClick={() => handleSetFeatured(news.id)}
                    >
                      ⭐ Jadikan Utama
                    </button>
                  )}
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
