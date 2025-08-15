import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarWidget.css';

// Import gambar default
import berita1Img from '../../assets/Berita1.png';
import berita2Img from '../../assets/Berita2.png';
import berita3Img from '../../assets/Berita3.png';
import berita4Img from '../../assets/Berita4.png';

const SidebarWidget = ({ 
  title = "Berita Terbaru", 
  maxItems = 10, 
  showViewAllButton = true,
  currentNewsId = null,
  autoUpdate = true,
  updateInterval = 30000 // 30 seconds
}) => {
  const navigate = useNavigate();
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
      } catch (error) {
        console.warn('Could not clear cache:', error);
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
  const API_BASE = 'http://localhost:3001/api';

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
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  // Mendapatkan URL gambar yang benar
  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return berita1Img;
    
    // Cek apakah sudah ada mapping
    if (imageMap[imageUrl]) return imageMap[imageUrl];
    
    // Jika URL lengkap, gunakan langsung
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Fallback ke gambar default
    return berita1Img;
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
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 SidebarWidget: Fetched', data.length, 'news items');
      
      // Filter data (hindari berita yang sedang dibaca jika ada)
      let filteredData = data;
      if (currentNewsId) {
        filteredData = data.filter(news => news.id !== currentNewsId);
      }
      
      // Urutkan berdasarkan tanggal terbaru dan batasi jumlah
      const sortedData = filteredData
        .sort((a, b) => new Date(b.createdAt || b.publishDate) - new Date(a.createdAt || a.publishDate))
        .slice(0, maxItems);
      
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

  // Data berita default sebagai fallback
  const getDefaultNews = () => [
    {
      id: '1755000000001',
      title: 'Penyerahan Sertifikat Hak Atas Tanah (SeHAT) Nelayan',
      summary: 'Program sertifikasi tanah untuk meningkatkan kesejahteraan nelayan di wilayah pesisir.',
      author: 'PERGUNU Situbondo',
      category: 'Sertifikasi',
      image: '/src/assets/Berita1.png',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '1755000000002',
      title: 'Pelatihan Teknologi Penangkapan Ikan Modern',
      summary: 'Upaya peningkatan kapasitas nelayan melalui teknologi modern dan berkelanjutan.',
      author: 'DKP Situbondo',
      category: 'Pelatihan',
      image: '/src/assets/Berita2.png',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '1755000000003',
      title: 'Kunjungan Bupati & Wakil Bupati Situbondo',
      summary: 'Koordinasi program pembangunan sektor kelautan dan perikanan daerah.',
      author: 'Pemerintah Situbondo',
      category: 'Pemerintahan',
      image: '/src/assets/Berita3.png',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    }
  ];

  // Setup auto-update dengan polling dan event listener untuk live update
  useEffect(() => {
    fetchNewsData();

    // Listen for live update event
    const handler = () => fetchNewsData();
    window.addEventListener('news-updated', handler);

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
            {newsData.map((news, index) => (
              <div 
                key={news.id} 
                className="related-item enhanced"
                onClick={() => handleNewsClick(news)}
                title={news.title}
              >
                <div className="news-image-wrapper">
                  <img 
                    src={getImageSrc(news.image || news.imageUrl)} 
                    alt={news.title}
                    loading="lazy"
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
