import React, { useState, useEffect } from 'react';
import './BeasiswaManager.css';
import { formatRupiah, formatNominalInput } from '../../utils/formatCurrency';

// ===== BEASISWA MANAGER COMPONENT =====
// Component untuk admin mengelola beasiswa (CRUD operations)
// Mirip dengan NewsManager tapi untuk beasiswa

const BeasiswaManager = () => {
  // State management untuk data beasiswa
  const [beasiswa, setBeasiswa] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');

  // State untuk form beasiswa
  const [formData, setFormData] = useState({
    judul: '',
    nominal: '',
    deadline: '',
    tanggal_mulai: '',
    deskripsi: '',
    persyaratan: [''], // Array string untuk persyaratan
    kategori: 'Pendidikan'
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://kp-mocha.vercel.app/api";

  // Kategori beasiswa yang tersedia
  const kategoriOptions = ['Riset', 'Pendidikan', 'S1', 'S2', 'Pelatihan', 'Santri'];

  // Function untuk fetch data beasiswa
  const fetchBeasiswa = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/beasiswa`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data beasiswa');
      }
      const data = await response.json();
      setBeasiswa(data);
    } catch (err) {
      console.error('Error fetching beasiswa:', err);
      setError('Gagal memuat data beasiswa');
      setBeasiswa([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data saat component mount
  useEffect(() => {
    fetchBeasiswa();
  }, []);

  // Function untuk handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Jika field nominal, format otomatis dengan separator titik
    if (name === 'nominal') {
      const formatted = formatNominalInput(value);
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Function untuk handle persyaratan change
  const handlePersyaratanChange = (index, value) => {
    const newPersyaratan = [...formData.persyaratan];
    newPersyaratan[index] = value;
    setFormData(prev => ({
      ...prev,
      persyaratan: newPersyaratan
    }));
  };

  // Function untuk tambah persyaratan baru
  const addPersyaratan = () => {
    setFormData(prev => ({
      ...prev,
      persyaratan: [...prev.persyaratan, '']
    }));
  };

  // Function untuk hapus persyaratan
  const removePersyaratan = (index) => {
    if (formData.persyaratan.length > 1) {
      const newPersyaratan = formData.persyaratan.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        persyaratan: newPersyaratan
      }));
    }
  };

  // Function untuk submit form (tambah/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Filter persyaratan yang tidak kosong
      const validPersyaratan = formData.persyaratan.filter(req => req.trim() !== '');
      
      if (validPersyaratan.length === 0) {
        throw new Error('Minimal satu persyaratan harus diisi');
      }

      const beasiswaData = {
        ...formData,
        persyaratan: validPersyaratan
      };

      const url = editingId 
        ? `${API_BASE}/beasiswa/${editingId}`
        : `${API_BASE}/beasiswa`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(beasiswaData)
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan beasiswa');
      }

      // Reset form dan refresh data
      resetForm();
      await fetchBeasiswa();
      
    } catch (err) {
      console.error('Error saving beasiswa:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function untuk reset form
  const resetForm = () => {
    setFormData({
      judul: '',
      nominal: '',
      deadline: '',
      tanggal_mulai: '',
      deskripsi: '',
      persyaratan: [''],
      kategori: 'Pendidikan'
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Function untuk edit beasiswa
  const handleEdit = (beasiswaItem) => {
    setFormData({
      judul: beasiswaItem.judul,
      nominal: beasiswaItem.nominal,
      deadline: beasiswaItem.deadline,
      tanggal_mulai: beasiswaItem.tanggal_mulai,
      deskripsi: beasiswaItem.deskripsi,
      persyaratan: beasiswaItem.persyaratan.length > 0 ? beasiswaItem.persyaratan : [''],
      kategori: beasiswaItem.kategori
    });
    setEditingId(beasiswaItem.id);
    setShowForm(true);
  };

  // Function untuk delete beasiswa
  const handleDelete = async (id, judul) => {
    if (!window.confirm(`Yakin ingin menghapus beasiswa "${judul}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/beasiswa/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus beasiswa');
      }

      await fetchBeasiswa();
    } catch (err) {
      console.error('Error deleting beasiswa:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter beasiswa berdasarkan search dan kategori
  const filteredBeasiswa = beasiswa.filter(item => {
    const matchesSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKategori = filterKategori === 'Semua' || item.kategori === filterKategori;
    return matchesSearch && matchesKategori;
  });

  return (
    <div className="beasiswa-manager">
      <div className="beasiswa-manager-header">
        <div className="header-left">
          <h2>🎓 Manajemen Beasiswa</h2>
          <p>Kelola program beasiswa PERGUNU</p>
        </div>
        <button 
          className="btn-add-beasiswa"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          ➕ Tambah Beasiswa
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
          <button onClick={() => setError('')} className="close-error">✕</button>
        </div>
      )}

      {/* Filter dan Search */}
      <div className="filter-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Cari beasiswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-kategori">
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
          >
            <option value="Semua">Semua Kategori</option>
            {kategoriOptions.map(kategori => (
              <option key={kategori} value={kategori}>{kategori}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content beasiswa-form-modal">
            <div className="modal-header">
              <h3>{editingId ? '✏️ Edit Beasiswa' : '➕ Tambah Beasiswa'}</h3>
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="beasiswa-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Judul Beasiswa *</label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan judul beasiswa"
                  />
                </div>
                <div className="form-group">
                  <label>Nominal *</label>
                  <input
                    type="text"
                    name="nominal"
                    value={formData.nominal}
                    onChange={handleInputChange}
                    required
                    placeholder="Rp 10.000.000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal Mulai *</label>
                  <input
                    type="date"
                    name="tanggal_mulai"
                    value={formData.tanggal_mulai}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kategori *</label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    required
                  >
                    {kategoriOptions.map(kategori => (
                      <option key={kategori} value={kategori}>{kategori}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi *</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Deskripsi singkat beasiswa"
                />
              </div>

              <div className="form-group">
                <label>Persyaratan *</label>
                {formData.persyaratan.map((req, index) => (
                  <div key={index} className="persyaratan-item">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handlePersyaratanChange(index, e.target.value)}
                      placeholder={`Persyaratan ${index + 1}`}
                    />
                    {formData.persyaratan.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePersyaratan(index)}
                        className="btn-remove-req"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPersyaratan}
                  className="btn-add-req"
                >
                  ➕ Tambah Persyaratan
                </button>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="btn-save">
                  {loading ? '⏳ Menyimpan...' : (editingId ? '💾 Update' : '💾 Simpan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Beasiswa List */}
      <div className="beasiswa-list">
        {loading && !showForm ? (
          <div className="loading-state">⏳ Memuat data beasiswa...</div>
        ) : filteredBeasiswa.length === 0 ? (
          <div className="empty-state">
            📋 Tidak ada beasiswa yang sesuai dengan filter
          </div>
        ) : (
          <div className="beasiswa-grid">
            {filteredBeasiswa.map((item) => (
              <div key={item.id} className="beasiswa-card">
                <div className="card-header">
                  <div className="beasiswa-title">
                    <h4>{item.judul}</h4>
                    <span className={`status-badge status-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="beasiswa-nominal">{formatRupiah(item.nominal)}</div>
                </div>
                
                <div className="card-meta">
                  <span className="kategori-badge">{item.kategori}</span>
                  <span className="deadline">
                    Deadline: {new Date(item.deadline).toLocaleDateString('id-ID')}
                  </span>
                </div>
                
                <p className="beasiswa-desc">{item.deskripsi}</p>
                
                <div className="persyaratan-preview">
                  <strong>Persyaratan:</strong>
                  <ul>
                    {item.persyaratan.slice(0, 2).map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                    {item.persyaratan.length > 2 && (
                      <li>... dan {item.persyaratan.length - 2} persyaratan lainnya</li>
                    )}
                  </ul>
                </div>
                
                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn-edit"
                    disabled={loading}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.judul)}
                    className="btn-delete"
                    disabled={loading}
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BeasiswaManager;