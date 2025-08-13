// NewsManager.jsx - Komponen untuk mengelola berita dengan editor seperti GitHub
import React, { useState, useEffect } from 'react';
import './NewsManager.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
    category: 'general'
  });

  // States untuk editor mode (Write / Preview seperti GitHub)
  const [editorMode, setEditorMode] = useState('write'); // 'write' atau 'preview'

  // Categories untuk berita
  const categories = [
    { value: 'general', label: 'Umum' },
    { value: 'education', label: 'Pendidikan' },
    { value: 'event', label: 'Acara' },
    { value: 'announcement', label: 'Pengumuman' },
    { value: 'achievement', label: 'Prestasi' }
  ];

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
    } catch (err) {
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

  // Handle perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form berita baru atau edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = editingId 
        ? `${API_BASE}/news/${editingId}`
        : `${API_BASE}/news`;
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(editingId ? 'Berita berhasil diupdate!' : 'Berita berhasil dibuat!');
        setFormData({ title: '', content: '', author: '', category: 'general' });
        setIsCreating(false);
        setEditingId(null);
        setEditorMode('write');
        await fetchNews(); // Refresh data
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal menyimpan berita');
      }
    } catch (err) {
      setError('Error koneksi ke server');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit berita
  const handleEdit = (news) => {
    setFormData({
      title: news.title,
      content: news.content,
      author: news.author || '',
      category: news.category || 'general'
    });
    setEditingId(news.id);
    setIsCreating(true);
    setEditorMode('write');
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
    } catch (err) {
      setError('Error koneksi ke server');
    } finally {
      setIsLoading(false);
    }
  };

  // View berita (buka di tab baru)
  const handleView = (newsId) => {
    window.open(`/berita/${newsId}`, '_blank');
  };

  // Cancel editing
  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ title: '', content: '', author: '', category: 'general' });
    setEditorMode('write');
  };

  // Render konten dengan format markdown lengkap
  const renderPreview = (content) => {
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
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      // Lists dengan (-) dan (*)
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
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

            {/* GitHub-style editor dengan tabs */}
            <div className="form-group">
              <label>Konten Berita *</label>
              <div className="editor-container">
                {/* Tab header seperti GitHub */}
                <div className="editor-tabs">
                  <button
                    type="button"
                    className={`tab ${editorMode === 'write' ? 'active' : ''}`}
                    onClick={() => setEditorMode('write')}
                  >
                    ✏️ Write
                  </button>
                  <button
                    type="button"
                    className={`tab ${editorMode === 'preview' ? 'active' : ''}`}
                    onClick={() => setEditorMode('preview')}
                  >
                    👁️ Preview
                  </button>
                </div>

                {/* Editor content */}
                <div className="editor-content">
                  {editorMode === 'write' ? (
                    <div className="write-mode">
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Tulis konten berita di sini... 

Gunakan format Markdown lengkap:

# Judul Besar
## Judul Sedang  
### Judul Kecil

Paragraf pertama akan otomatis menjadi article-lead (pengantar artikel).

**Teks Tebal** dan *Teks Miring* atau ***Tebal dan Miring***

Daftar dengan tanda minus:
- Item pertama
- Item kedua  
- Item ketiga

Daftar dengan bintang:
* Item A
* Item B
* Item C

[Teks Link](https://example.com)

Paragraf baru dengan baris kosong di antaranya.
"
                        rows="15"
                        required
                      />
                      <div className="editor-help">
                        <small>
                          💡 <strong>Tips:</strong> Gunakan Markdown untuk format teks. 
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
                      {renderPreview(formData.content)}
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
        <h3>📋 Daftar Berita ({newsList.length})</h3>
        {isLoading && <div className="loading">⏳ Memuat data...</div>}
        
        {newsList.length === 0 && !isLoading ? (
          <div className="empty-state">
            <p>📰 Belum ada berita. Buat berita pertama Anda!</p>
          </div>
        ) : (
          <div className="news-cards">
            {newsList.map((news) => (
              <div key={news.id} className="news-card">
                <div className="news-card-header">
                  <h4>{news.title}</h4>
                  <span className="news-category">{categories.find(c => c.value === news.category)?.label || news.category}</span>
                </div>
                <div className="news-card-meta">
                  <span>👤 {news.author || 'Admin'}</span>
                  <span>📅 {formatDate(news.createdAt)}</span>
                </div>
                <div className="news-card-content">
                  {news.content.substring(0, 150)}...
                </div>
                <div className="news-card-actions">
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
  );
}
