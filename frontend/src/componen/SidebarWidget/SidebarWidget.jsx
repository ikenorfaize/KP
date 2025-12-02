import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarWidget.css';
import { useNewsImage } from '../../context/NewsImageContext';

// Import gambar default
import berita1Img from '../../assets/Berita1.png';
import berita2Img from '../../assets/Berita2.png';
import berita3Img from '../../assets/Berita3.png';
import berita4Img from '../../assets/Berita4.png';
import noImageImg from '../../assets/noimage.png';

const SidebarWidget = ({ 
  title = "Berita Terbaru", 
  maxItems = 10, 
  showViewAllButton = true,
  currentNewsId = null,
  autoUpdate = true,
  updateInterval = 30000 // 30 seconds
}) => {
  const navigate = useNavigate();
  const { getNewsImage, featuredNewsImage } = useNewsImage();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Clear any old cached data on component mount
  useEffect(() => {
    const clearOldCache = () => {
      try {
        // Clear localStorage items that might contain old user data
        const keysToRemove = ['akun1', 'user', 'sidebarNewsCache', 'newsCache'];
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        
        console.log('🧹 Cleared old cache data for fresh load');
      } catch (_error) {
        console.warn('Could not clear cache:', _error);
      }
    };
    
    clearOldCache();
  }, []);

  // Mapping gambar default
  const imageMap = {
    '/src/assets/Berita1.png': berita1Img,
    '/src/assets/Berita2.png': berita2Img,
    '/src/assets/Berita3.png': berita3Img,
    '/src/assets/Berita4.png': berita4Img,
    'Berita1.png': berita1Img,
    'Berita2.png': berita2Img,
    'Berita3.png': berita3Img,
    'Berita4.png': berita4Img
  };

  // API Base URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
  const FILE_SERVER = import.meta.env.VITE_FILE_SERVER_URL || 'https://kp-mocha.vercel.app';

  // Format tanggal
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Tanggal tidak valid';
      
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (_error) {
      return 'Tanggal tidak valid';
    }
  };

  // Mendapatkan URL gambar yang benar
  const getImageSrc = (imageUrl, newsId = null, isFeatured = false) => {
    // Prioritas 1: Jika ini featured news, gunakan featured image dari context
    if (isFeatured && featuredNewsImage && featuredNewsImage !== '/src/assets/noimage.png') {
      return featuredNewsImage;
    }
    
    // Prioritas 2: Jika ada newsId, coba ambil dari context
    if (newsId) {
      const contextImage = getNewsImage(newsId);
      if (contextImage !== '/src/assets/noimage.png') {
        return contextImage;
      }
    }
    
    // Prioritas 3: Process imageUrl yang diterima
    if (!imageUrl) return noImageImg;
    
    // Handle base64 data URLs (from new upload system)
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    
    // Handle file server URLs (sudah lengkap)
    if (imageUrl.includes('/uploads/')) {
      // If it already has a full URL, use it; otherwise construct it
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      return imageUrl.startsWith('/') ? `${FILE_SERVER}${imageUrl}` : `${FILE_SERVER}/uploads/images/${imageUrl}`;
    }
    
    // Handle filename only - convert ke file server URL
    if (imageUrl && !imageUrl.includes('/') && !imageUrl.startsWith('http') && !imageUrl.startsWith('/src/')) {
      return `${FILE_SERVER}/uploads/images/${imageUrl}`;
    }
    
    // Handle path starting with /uploads - convert ke file server URL
    if (imageUrl.startsWith('/uploads/')) {
      return `${FILE_SERVER}${imageUrl}`;
    }
    
    // Cek apakah sudah ada mapping untuk asset images
    if (imageMap[imageUrl]) return imageMap[imageUrl];
    
    // Handle external URLs
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Handle asset paths
    if (imageUrl.startsWith('/src/assets/')) return imageUrl;
    
    // Fallback ke gambar default
    return noImageImg;
  };

  // Fetch data berita dari API yang sama dengan admin-news-list
  const fetchNewsData = useCallback(async () => {
    try {
      setError(null);
      
      // Clear any old cached data and user sessions
      localStorage.removeItem('sidebarNewsCache');
      localStorage.removeItem('akun1');
      localStorage.removeItem('user');
      sessionStorage.removeItem('akun1');
      sessionStorage.removeItem('user');
      
      // Add cache busting timestamp
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_BASE}/news?_t=${timestamp}`, {
        method: 'GET',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 SidebarWidget: Fetched', data.length, 'news items', data);
      
      // Pastikan data adalah array dan tidak kosong
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('⚠️ SidebarWidget: No valid data received, using fallback');
        setNewsData(getDefaultNews());
        setLastUpdated(new Date());
        setLoading(false);
        return;
      }
      
      // Filter data (hindari berita yang sedang dibaca jika ada)
      let filteredData = data;
      if (currentNewsId) {
        filteredData = data.filter(news => news.id !== currentNewsId);
      }
      
      // Urutkan berdasarkan tanggal terbaru dan batasi jumlah
      const sortedData = filteredData
        .sort((a, b) => new Date(b.createdAt || b.publishDate) - new Date(a.createdAt || a.publishDate))
        .slice(0, maxItems);
      
      console.log('📊 SidebarWidget: Using real data:', sortedData);
      setNewsData(sortedData);
      setLastUpdated(new Date());
      setLoading(false);
      
    } catch (error) {
      console.error('❌ SidebarWidget fetch error:', error);
      setError(error.message);
      setLoading(false);
      
      // Fallback ke data default jika API gagal
      setNewsData(getDefaultNews());
    }
  }, [API_BASE, maxItems, currentNewsId]);

  // Data berita default sebagai fallback - Updated IDs to match actual database
  const getDefaultNews = () => [
    {
      id: '1758789249579', // Real ID from database
      title: 'Penyerahan Simbolis Sertifikat Hak Atas Tanah (SeHAT) Nelayan',
      summary: 'Kabupaten Situbondo kembali menunjukkan komitmennya dalam memberikan kepastian hukum kepada masyarakat, khususnya para nelayan.',
      author: 'Tim PERGUNU',
      category: 'Sertifikasi',
      image: '1758796907483_1wb5jimp0tkh.png', // Real image from database
      createdAt: '2025-09-25T08:34:09.579Z'
    },
    {
      id: '1758789355712', // Real ID from database
      title: 'Pelatihan Teknologi Penangkapan Ikan oleh Dinas Perikanan Situbondo',
      summary: 'Dinas Perikanan Kabupaten Situbondo menggelar program pelatihan teknologi penangkapan ikan yang bertujuan untuk meningkatkan kemampuan dan keterampilan nelayan lokal.',
      author: 'DKP Situbondo',
      category: 'Pelatihan',
      image: '1758796940817_h4wqyf20s48.png', // Real image from database
      createdAt: '2025-09-25T08:35:55.712Z'
    },
    {
      id: '1758789415408', // Real ID from database
      title: 'Bupati dan Wakil Bupati Situbondo Bersama Dinas Perikanan',
      summary: 'Bupati Situbondo, Dadang Wigiarto, S.H., M.Si., bersama Wakil Bupati, Ir. H. Yusuf Widyatmoko, M.M., melaksanakan kunjungan kerja ke Dinas Perikanan Kabupaten Situbondo.',
      author: 'Pemerintah Situbondo',
      category: 'Pemerintahan',
      image: '1758797116285_sq93xw6og3.png', // Real image from database
      createdAt: '2025-09-25T08:36:55.408Z'
    }
  ];

  // Setup auto-update dengan polling dan event listener untuk live update
  useEffect(() => {
    fetchNewsData();

    // Listen for live update events
    const handler = () => fetchNewsData();
    const imageUpdateHandler = () => {
      console.log('🖼️ SidebarWidget: Image updated, refreshing data...');
      fetchNewsData();
    };
    
    window.addEventListener('news-updated', handler);
    window.addEventListener('news-image-updated', imageUpdateHandler);
    window.addEventListener('featured-news-changed', imageUpdateHandler);

    let intervalId;
    if (autoUpdate && updateInterval > 0) {
      console.log(`🔄 SidebarWidget: Auto-update enabled (${updateInterval / 1000}s interval)`);
      intervalId = setInterval(() => {
        console.log('🔄 SidebarWidget: Auto-updating news data...');
        fetchNewsData();
      }, updateInterval);
    }

    return () => {
      window.removeEventListener('news-updated', handler);
      window.removeEventListener('news-image-updated', imageUpdateHandler);
      window.removeEventListener('featured-news-changed', imageUpdateHandler);
      if (intervalId) {
        console.log('🛑 SidebarWidget: Cleaning up auto-update interval');
        clearInterval(intervalId);
      }
    };
  }, [fetchNewsData, autoUpdate, updateInterval]);

  // Handle click pada berita
  const handleNewsClick = (news) => {
    if (news.id.startsWith('default-')) {
      // Navigate ke halaman berita dinamis untuk item default - UPDATED MAPPING
      const routeMap = {
        'default-1': '/berita/1755000000001',
        'default-2': '/berita/1755000000002',
        'default-3': '/berita/1755000000003'
      };
      navigate(routeMap[news.id] || '/berita');
    } else {
      // Navigate ke halaman detail berita dinamis
      navigate(`/berita/${news.id}`);
    }
  };

  // Handle view all button
  const handleViewAll = () => {
    navigate('/berita');
  };

  if (loading) {
    return (
      <div className="sidebar-widget">
        <h4>{title}</h4>
        <div className="sidebar-loading">
          <div className="loading-spinner"></div>
          <p>Memuat berita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-widget enhanced">
      <div className="sidebar-widget-header">
        <h4>{title}</h4>
        {lastUpdated && (
          <span className="last-updated">
            Update: {lastUpdated.toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>

      {error && (
        <div className="sidebar-error">
          <span className="error-icon">⚠️</span>
          <p>Error: {error}</p>
          <button 
            className="retry-btn" 
            onClick={fetchNewsData}
            title="Coba lagi"
          >
            🔄 Retry
          </button>
        </div>
      )}

      <div className="sidebar-news-container">
        {newsData.length === 0 ? (
          <div className="no-news">
            <span className="no-news-icon">📰</span>
            <p>Belum ada berita tersedia</p>
          </div>
        ) : (
          <div className="related-news scrollable">
            {newsData.map((news, _index) => (
              <div 
                key={news.id} 
                className="related-item enhanced"
                onClick={() => handleNewsClick(news)}
                title={news.title}
              >
                <div className="news-image-wrapper">
                  <img 
                    src={getImageSrc(news.image || news.imageUrl, news.id, news.featured)} 
                    alt={news.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = noImageImg;
                    }}
                  />
                  {news.featured && (
                    <span className="featured-badge">⭐</span>
                  )}
                </div>
                
                <div className="related-content">
                  <h5>{news.title}</h5>
                  {news.summary && (
                    <p className="news-summary">{news.summary}</p>
                  )}
                  <div className="news-meta">
                    <span className="related-date">
                      {formatDate(news.createdAt || news.publishDate)}
                    </span>
                    {news.author && (
                      <span className="news-author">
                        👤 {news.author}
                      </span>
                    )}
                  </div>
                  {news.category && (
                    <span className="news-category">{news.category}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showViewAllButton && newsData.length > 0 && (
        <div className="sidebar-footer">
          <button 
            className="view-all-btn"
            onClick={handleViewAll}
          >
            📰 Lihat Semua Berita
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarWidget;
