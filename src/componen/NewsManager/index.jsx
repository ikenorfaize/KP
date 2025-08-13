// NewsManager/index.jsx - Single entry for NewsManager component
import React, { useState, useEffect } from 'react';
import './NewsManager.css';
import '../Berita/Berita.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export default function NewsManager() {
	const [newsList, setNewsList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	// Admin UI now uses vertical scrolling

	const [isCreating, setIsCreating] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [formData, setFormData] = useState({
		title: '',
		content: '',
		author: '',
		category: 'general',
		featured: false
	});

	const [editorMode, setEditorMode] = useState('write');

	const categories = [
		{ value: 'general', label: 'Umum' },
		{ value: 'education', label: 'Pendidikan' },
		{ value: 'event', label: 'Acara' },
		{ value: 'announcement', label: 'Pengumuman' },
		{ value: 'achievement', label: 'Prestasi' }
	];

	const fetchNews = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${API_BASE}/news`);
			if (response.ok) {
				const data = await response.json();
				setNewsList(Array.isArray(data) ? data : []);
			} else {
				setError('Gagal memuat data berita');
			}
		} catch {
			setError('Error koneksi ke server');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => { fetchNews(); }, []);
	useEffect(() => {
		if (error || success) {
			const t = setTimeout(() => { setError(''); setSuccess(''); }, 3000);
			return () => clearTimeout(t);
		}
	}, [error, success]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		setSuccess('');
		try {
			const url = editingId ? `${API_BASE}/news/${editingId}` : `${API_BASE}/news`;
			const method = editingId ? 'PATCH' : 'POST';
			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			if (response.ok) {
				setSuccess(editingId ? 'Berita berhasil diupdate!' : 'Berita berhasil dibuat!');
				setFormData({ title: '', content: '', author: '', category: 'general' });
				setIsCreating(false);
				setEditingId(null);
				setEditorMode('write');
				await fetchNews();
			} else {
				const errorData = await response.json();
				setError(errorData.error || 'Gagal menyimpan berita');
			}
		} catch {
			setError('Error koneksi ke server');
		} finally { setIsLoading(false); }
	};

	const handleEdit = (news) => {
		setFormData({
			title: news.title,
			content: news.content,
			author: news.author,
			category: news.category
		});
		setEditingId(news.id);
		setIsCreating(true);
		setEditorMode('write');
	};

	const handleDelete = async (id) => {
		if (!confirm('Yakin hapus berita ini?')) return;
		
		try {
			const response = await fetch(`${API_BASE}/news/${id}`, { method: 'DELETE' });
			if (response.ok) {
				setSuccess('Berita berhasil dihapus!');
				await fetchNews();
			} else {
				setError('Gagal menghapus berita');
			}
		} catch {
			setError('Error koneksi ke server');
		}
	};

	// New function to set featured news
	const makeFeatured = async (newsId) => {
		try {
			const response = await fetch(`${API_BASE}/news/${newsId}/feature`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' }
			});
			
			if (response.ok) {
				setSuccess('Berita utama berhasil diubah!');
				await fetchNews(); // Refresh to get updated data
			} else {
				const errorData = await response.json();
				setError(errorData.error || 'Gagal mengubah berita utama');
			}
		} catch {
			setError('Error koneksi ke server');
		}
	};

	const handleView = (newsId) => { window.open(`/berita/${newsId}`, '_blank'); };
	const handleCancel = () => {
		setIsCreating(false);
		setEditingId(null);
		setFormData({ title: '', content: '', author: '', category: 'general' });
		setEditorMode('write');
	};

	const renderPreview = (content) => {
		if (!content) return <p className="preview-empty">Tidak ada konten untuk dipreview</p>;
		let html = content
			.replace(/^([^\n#\-\*].+?)(\n\n)/m, '<p class="article-lead">$1</p>$2')
			.replace(/^### (.*$)/gm, '<h3>$1</h3>')
			.replace(/^## (.*$)/gm, '<h2>$1</h2>')
			.replace(/^# (.*$)/gm, '<h1>$1</h1>')
			.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/^- (.*$)/gm, '<li>$1</li>')
			.replace(/^\* (.*$)/gm, '<li>$1</li>')
			.replace(/(<li>.*<\/li>(?:\s*<li>.*<\/li>)*)/gs, '<ul>$1</ul>')
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
			.replace(/\n\n/g, '</p><p>')
			.replace(/\n/g, '<br>');
		if (!html.includes('<p>') && !html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>')) {
			html = '<p>' + html + '</p>';
		}
		return <div className="preview-content" dangerouslySetInnerHTML={{ __html: html }} />;
	};

	const formatDate = (dateString) => {
		if (!dateString) return '—';
		const d = new Date(dateString);
		if (isNaN(d.getTime())) return '—';
		return (
			d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) +
			' pukul ' +
			d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
		);
	};

	// All news data available for vertical scrolling

	return (
		<div className="news-manager">
			<div className="news-header">
				<h2>📰 Manajemen Berita</h2>
				<button className="btn-create" onClick={() => setIsCreating(!isCreating)}>
					{isCreating ? '❌ Batal' : '➕ Buat Berita Baru'}
				</button>
			</div>
			{error && <div className="alert alert-error">{error}</div>}
			{success && <div className="alert alert-success">{success}</div>}


			{isCreating && (
				<div className="create-form">
					<h3>{editingId ? 'Edit Berita' : 'Buat Berita Baru'}</h3>
					<form onSubmit={handleSubmit}>
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="title">Judul Berita *</label>
								<input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul berita..." required />
							</div>
							<div className="form-group">
								<label htmlFor="category">Kategori</label>
								<select id="category" name="category" value={formData.category} onChange={handleInputChange}>
									{categories.map(cat => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
								</select>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="author">Penulis</label>
							<input type="text" id="author" name="author" value={formData.author} onChange={handleInputChange} placeholder="Nama penulis (opsional)" />
						</div>

						<div className="form-group">
							<label>Konten Berita *</label>
							<div className="editor-container">
								<div className="editor-tabs">
									<button type="button" className={`tab ${editorMode === 'write' ? 'active' : ''}`} onClick={() => setEditorMode('write')}>✏️ Write</button>
									<button type="button" className={`tab ${editorMode === 'preview' ? 'active' : ''}`} onClick={() => setEditorMode('preview')}>👁️ Preview</button>
								</div>
								<div className="editor-content">
									{editorMode === 'write' ? (
										<div className="write-mode">
											<textarea name="content" value={formData.content} onChange={handleInputChange} rows="15" required placeholder={`Tulis konten berita di sini... 

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

Paragraf baru dengan baris kosong di antaranya.`} />
											<div className="editor-help"><small>💡 <strong>Tips:</strong> Gunakan Markdown untuk format teks. Klik tab "Preview" untuk melihat hasil.</small></div>
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
							<button type="submit" disabled={isLoading} className="btn-submit">{isLoading ? '⏳ Menyimpan...' : editingId ? '💾 Update Berita' : '💾 Simpan Berita'}</button>
							<button type="button" onClick={handleCancel} className="btn-cancel">Batal</button>
						</div>
					</form>
				</div>
			)}

			<div className="admin-news-list">
				<div className="admin-news-list__header">
					<h3>📋 Daftar Berita ({newsList.length}) - Sinkron dengan Homepage</h3>
				</div>

				{isLoading && <div className="loading">⏳ Memuat data...</div>}
				{newsList.length === 0 && !isLoading ? (
					<div className="empty-state"><p>📰 Belum ada berita. Buat berita pertama Anda!</p></div>
				) : (
					<div className="admin-news-scrollable-container">
						<div className="admin-news-grid">
							{/* All news items in grid format */}
							{newsList.map((news) => {
								const dateForDisplay = news.createdAt || news.publishDate;
								return (
									<div
										key={news.id}
										id={`admin-news-card-${String(news.id)}`}
										data-news-id={String(news.id)}
										className={`admin-news-card ${news.featured ? 'admin-news-card--featured' : ''}`}
									>
										<div className="admin-news-card__header">
											<h4 className="admin-news-card__title">{news.title}</h4>
											<span className="admin-news-card__category">{categories.find(c => c.value === news.category)?.label || news.category}</span>
										</div>
										<div className="admin-news-card__meta">
											<span>👤 {news.author || 'Admin'}</span>
											<span>📅 {formatDate(dateForDisplay)}</span>
										</div>
										<div className="admin-news-card__content">{(news.content || '').substring(0, 150)}...</div>
										<div className="admin-news-card__actions">
											{news.featured && <span className="admin-news-card__badge">⭐ Utama</span>}
											<button className="btn-edit" onClick={() => handleEdit(news)}>✏️ Edit</button>
											<button className="btn-delete" onClick={() => handleDelete(news.id)}>🗑️ Hapus</button>
											<button className="btn-view" onClick={() => handleView(news.id)}>👁️ Lihat</button>
											{!news.featured && (
												<button className="btn-feature" onClick={() => makeFeatured(news.id)} title="Jadikan Berita Utama">⭐ Jadikan Utama</button>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
