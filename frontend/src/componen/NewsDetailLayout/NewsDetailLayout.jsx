import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarWidget from '../SidebarWidget/SidebarWidget';
import './NewsDetailLayout.css';

// Import default images
import Berita1Img from '../../assets/Berita1.png';
import Berita2Img from '../../assets/Berita2.png';
import Berita3Img from '../../assets/Berita3.png';
import Berita4Img from '../../assets/Berita4.png';
import NoImageImg from '../../assets/noimage.png';

const NewsDetailLayout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [cleanImageView, setCleanImageView] = useState(true); // Clean view untuk demo

  // API Base URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';

  // Image mapping untuk fallback
  const imageMap = {
    '/src/assets/Berita1.png': Berita1Img,
    '/src/assets/Berita2.png': Berita2Img,
    '/src/assets/Berita3.png': Berita3Img,
    '/src/assets/Berita4.png': Berita4Img,
    'Berita1.png': Berita1Img,
    'Berita2.png': Berita2Img,
    'Berita3.png': Berita3Img,
    'Berita4.png': Berita4Img
  };

  // Get correct image source
  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return NoImageImg;
    
    // Handle base64 data URLs (from new upload system)
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    
    // Handle existing image mapping
    if (imageMap[imageUrl]) return imageMap[imageUrl];
    
    // Handle external URLs
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Handle asset paths
    if (imageUrl.startsWith('/src/assets/')) return imageUrl;
    
    // Fallback to default
    return NoImageImg;
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Tanggal tidak valid';
      
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (_error) {
      return 'Tanggal tidak valid';
    }
  };

  // Fetch news data
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        setError('');

        // Clear any old cached user data
        ['akun1', 'user', 'newsCache', 'sidebarNewsCache'].forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });

        // Add cache busting timestamp
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_BASE}/news?_t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allNews = await response.json();
        
        // Find news by ID (supports unified ID format like 1755000000001, etc)
        let foundNews = allNews.find(n => String(n.id) === String(id));
        
        // Fallback for static routes
        if (!foundNews) {
          const staticRouteMap = {
            'berita-1': '1755000000001',
            'berita-2': '1755000000002', 
            'berita-3': '1755000000003',
            'berita4': '1755000000004'
          };
          
          const mappedId = staticRouteMap[id];
          if (mappedId) {
            foundNews = allNews.find(n => String(n.id) === mappedId);
          }
        }

        if (foundNews) {
          setNewsData(foundNews);
        } else {
          setError('Berita tidak ditemukan');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Gagal memuat data berita');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    }
  }, [id, API_BASE]);

  // Parse content with markdown-like formatting
  const parseContent = (content) => {
    if (!content) return [];
    
    const paragraphs = content.split('\n\n');
    return paragraphs.map((paragraph, index) => {
      // Handle headers
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        const title = paragraph.replace(/\*\*/g, '');
        return { type: 'header', content: title, key: index };
      }
      
      // Handle bullet points
      if (paragraph.includes('- ')) {
        const items = paragraph.split('\n').filter(line => line.trim().startsWith('- '));
        const listItems = items.map(item => item.replace('- ', '').trim());
        return { type: 'list', content: listItems, key: index };
      }
      
      // Handle quotes (paragraphs with quotes)
      if (paragraph.includes('"')) {
        return { type: 'quote', content: paragraph, key: index };
      }
      
      // Regular paragraph
      return { type: 'paragraph', content: paragraph, key: index };
    });
  };

  if (loading) {
    return (
      <div className="news-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="news-detail-layout">
        <div className="error-container">
          <h2>❌ Error</h2>
          <p>{error || 'Berita tidak ditemukan'}</p>
          <button 
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const beritaSection = document.querySelector('.berita-section');
                if (beritaSection) {
                  beritaSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start' 
                  });
                }
              }, 100);
            }} 
            className="btn-back"
          >
            ← Kembali ke Berita
          </button>
        </div>
      </div>
    );
  }

  // Process content for future enhanced formatting
  const _contentBlocks = parseContent(newsData.content);

  return (
    <div className="news-detail-layout">
      {/* 1. Image Overlay Section */}
      <section className={`image-overlay-section ${cleanImageView ? 'clean-view' : ''}`}>
        <div className="image-background" 
             style={{ backgroundImage: `url(${getImageSrc(newsData.image || newsData.imageUrl)})` }}>
          <div className="overlay-gradient">
            <div className="container">
              <div className="breadcrumb">
                <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
                <span className="breadcrumb-separator">→</span>
                <span onClick={() => navigate('/berita')} className="breadcrumb-link">Berita</span>
                <span className="breadcrumb-separator">→</span>
                <span className="breadcrumb-current">{newsData.title}</span>
              </div>
              
              <div className="overlay-content">
                <div className="category-badge">{newsData.category}</div>
                <h1 className="news-title">{newsData.title}</h1>
                <div className="news-meta">
                  <span className="meta-item">
                    📅 {formatDate(newsData.publishDate || newsData.createdAt)}
                  </span>
                  <span className="meta-item">
                    👤 {newsData.author}
                  </span>
                  <span className="meta-item">
                    ⏱️ {Math.ceil(newsData.content?.length / 500) || 5} min read
                  </span>
                  {newsData.featured && (
                    <span className="meta-item featured">
                      ⭐ Berita Utama
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* View Toggle */}
        <button 
          className="view-toggle"
          onClick={() => setCleanImageView(!cleanImageView)}
          title={cleanImageView ? 'Tampilkan overlay penuh' : 'Bersihkan tampilan gambar'}
        >
          {cleanImageView ? '🎨' : '🖼️'}
        </button>
        
        {/* Click to zoom */}
        <button 
          className="zoom-indicator"
          onClick={() => setIsImageModalOpen(true)}
          title="Klik untuk memperbesar gambar"
        >
          🔍 Zoom
        </button>
      </section>

      {/* 2. Main Content Section */}
      <section className="main-content-section">
        <div className="container">
          <div className="content-grid">
            
            {/* Article Content - 70% */}
            <article className="article-content">
              {newsData.summary && (
                <div className="article-lead">
                  {newsData.summary}
                </div>
              )}

              <div className="article-body">
                <div dangerouslySetInnerHTML={{ __html: newsData.content }} />
              </div>

              {/* Article Footer */}
              <div className="article-footer">
                {newsData.tags && newsData.tags.length > 0 && (
                  <div className="tags-section">
                    <h4>Tags:</h4>
                    <div className="tags-container">
                      {newsData.tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="share-section">
                  <h4>Bagikan Artikel:</h4>
                  <div className="share-buttons">
                    <button className="share-btn facebook" onClick={() => {
                      const url = window.location.href;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                    }}>
                      📘 Facebook
                    </button>
                    <button className="share-btn twitter" onClick={() => {
                      const url = window.location.href;
                      const text = newsData.title;
                      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                    }}>
                      🐦 Twitter
                    </button>
                    <button className="share-btn whatsapp" onClick={() => {
                      const url = window.location.href;
                      const text = newsData.title;
                      window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
                    }}>
                      💬 WhatsApp
                    </button>
                  </div>
                </div>

                <div className="navigation-section">
                  <button 
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => {
                        const beritaSection = document.querySelector('.berita-section');
                        if (beritaSection) {
                          beritaSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start' 
                          });
                        }
                      }, 100);
                    }}
                    className="btn-back"
                  >
                    ← Kembali ke Semua Berita
                  </button>
                </div>
              </div>
            </article>

            {/* 3. Sidebar Widget Enhanced - 30% */}
            <aside className="sidebar-enhanced">
              <SidebarWidget 
                title="Berita Terkait"
                maxItems={15}
                currentNewsId={newsData.id}
                autoUpdate={true}
                updateInterval={30000}
                showViewAllButton={false}
              />
            </aside>

          </div>
        </div>
      </section>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="image-modal" onClick={() => setIsImageModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsImageModalOpen(false)}>
              ✕
            </button>
            <img 
              src={getImageSrc(newsData.image || newsData.imageUrl)} 
              alt={newsData.title} 
              className="modal-image"
            />
            <div className="modal-caption">
              <h4>{newsData.title}</h4>
              <p>{newsData.summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetailLayout;
