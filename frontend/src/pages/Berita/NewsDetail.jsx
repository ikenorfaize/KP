import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NewsDetail.css"; // Using shared styles
import SidebarWidget from "../../componen/SidebarWidget";
import { useNewsImage } from "../../context/NewsImageContext";
import { getExcerpt } from "../../utils/htmlUtils";
import Berita1Img from "../../assets/Berita1.png";
import Berita2Img from "../../assets/Berita2.png";
import Berita3Img from "../../assets/Berita3.png";
import Berita4Img from "../../assets/Berita4.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
const FILE_SERVER = import.meta.env.VITE_FILE_SERVER_URL || 'https://kp-mocha.vercel.app';

const NewsDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get news ID from URL
  const { getNewsImage, featuredNewsImage } = useNewsImage();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [newsData, setNewsData] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Image mapping
  const imageMap = {
    "/src/assets/Berita1.png": Berita1Img,
    "/src/assets/Berita2.png": Berita2Img,
    "/src/assets/Berita3.png": Berita3Img,
    "/src/assets/Berita4.png": Berita4Img,
  };

  // Fetch specific news data
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/news`);
        if (response.ok) {
          const allNews = await response.json();
          const foundNews = allNews.find(n => String(n.id) === String(id));
          if (foundNews) {
            setNewsData(foundNews);
            // Set related news (exclude current news)
            const related = allNews.filter(n => String(n.id) !== String(id)).slice(0, 3);
            setRelatedNews(related);
          } else {
            setError('Berita tidak ditemukan');
          }
        } else {
          setError('Gagal memuat data berita');
        }
      } catch (err) {
        setError('Error koneksi ke server');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get image source with context sync
  const getImageSrc = () => {
    if (!newsData) {
      // Jika tidak ada data, gunakan featured image dari context
      return featuredNewsImage !== '/src/assets/noimage.png' ? featuredNewsImage : Berita1Img;
    }
    
    // Jika ini featured news, prioritaskan context
    if (newsData.featured && featuredNewsImage && featuredNewsImage !== '/src/assets/noimage.png') {
      return featuredNewsImage;
    }
    
    // Coba ambil dari context berdasarkan ID
    const contextImage = getNewsImage(newsData.id);
    if (contextImage !== '/src/assets/noimage.png') {
      return contextImage;
    }
    
    const imageUrl = newsData.image || newsData.imageUrl;
    
    // Handle base64 data URLs (from new upload system)
    if (imageUrl && imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    
    // Handle existing image mapping
    if (imageUrl && imageMap[imageUrl]) {
      return imageMap[imageUrl];
    }
    
    // Handle external URLs
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Handle asset paths
    if (imageUrl && imageUrl.startsWith('/src/assets/')) {
      return imageUrl;
    }
    
    // Handle file server uploads
    if (imageUrl && !imageUrl.includes('/') && !imageUrl.startsWith('http') && !imageUrl.startsWith('/src/')) {
      return `${FILE_SERVER}/uploads/images/${imageUrl}`;
    }
    
    // Fallback to default
    return Berita1Img;
  };

  if (loading) {
    return (
      <div className="berita-detail-container">
        <div className="container" style={{textAlign: 'center', padding: '100px 0'}}>
          <p>⏳ Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="berita-detail-container">
        <div className="container" style={{textAlign: 'center', padding: '100px 0'}}>
          <h2>😕 Berita Tidak Ditemukan</h2>
          <p>{error || 'Berita yang Anda cari tidak tersedia.'}</p>
          <button 
            onClick={() => {
              navigate('/');
              // Delay scroll to ensure page is loaded
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
            style={{
              padding: '12px 24px',
              background: '#0f7536',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            ← Kembali ke Berita
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="berita-detail-container">
      {/* Hero Section */}
      <section className="berita-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-separator">→</span>
            <span onClick={() => navigate('/berita')} className="breadcrumb-link">Berita</span>
            <span className="breadcrumb-separator">→</span>
            <span className="breadcrumb-current">{newsData.title}</span>
          </div>
          
          <div className="berita-hero-content">
            <div className="badge category">{newsData.category || 'Berita'}</div>
            <h1 className="berita-title">{newsData.title}</h1>
            
            <div className="berita-meta">
              <div className="meta-item">
                <span>📅</span>
                <span>{formatDate(newsData.publishDate || newsData.createdAt)}</span>
              </div>
              <div className="meta-item">
                <span>⏱️</span>
                <span>5 min read</span>
              </div>
              <div className="meta-item">
                <span>👤</span>
                <span>{newsData.author || 'Tim Redaksi PERGUNU'}</span>
              </div>
              {newsData.featured && (
                <div className="meta-item">
                  <span>⭐</span>
                  <span>Berita Utama</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar Layout */}
      <section className="berita-main-content">
        <div className="container">
          <div className="main-layout">
            {/* Left Content Area */}
            <div className="content-area">
              {/* Featured Image */}
              <div className="image-container">
                <img 
                  src={getImageSrc()} 
                  alt={newsData.title} 
                  className="featured-img interactive-img"
                  onClick={() => setIsImageModalOpen(true)}
                />
                <div className="image-overlay">
                  <div className="zoom-icon">🔍</div>
                  <span className="zoom-text">Klik untuk memperbesar</span>
                </div>
              </div>

              {/* Article Content */}
              <article className="article-content">
                {newsData.summary && (
                  <div className="article-lead">
                    {newsData.summary}
                  </div>
                )}

                <div className="article-body">
                  <div dangerouslySetInnerHTML={{ __html: newsData.content }} />
                </div>

                {newsData.tags && newsData.tags.length > 0 && (
                  <div className="article-tags">
                    <h4>Tags:</h4>
                    <div className="tags-container">
                      {newsData.tags.map((tag, idx) => (
                        <span key={idx} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share buttons */}
                <div className="article-footer">
                  <div className="share-buttons">
                    <span>Bagikan:</span>
                    <button className="share-btn facebook" onClick={() => {
                      const url = window.location.href;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                    }}>📘 Facebook</button>
                    <button className="share-btn twitter" onClick={() => {
                      const url = window.location.href;
                      const text = newsData.title;
                      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                    }}>🐦 Twitter</button>
                    <button className="share-btn whatsapp" onClick={() => {
                      const url = window.location.href;
                      const text = newsData.title;
                      window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
                    }}>💬 WhatsApp</button>
                  </div>
                </div>

                <div className="article-actions">
                  <button 
                    onClick={() => {
                      navigate('/');
                      // Delay scroll to ensure page is loaded
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
              </article>
            </div>

            {/* Right Sidebar */}
            <aside className="sidebar">
              <SidebarWidget 
                title="Berita Terkait"
                maxItems={8}
                currentNewsId={id}
                autoUpdate={true}
                updateInterval={30000}
                showViewAllButton={true}
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
              src={getImageSrc()} 
              alt={newsData.title} 
              className="modal-image"
            />
            <div className="modal-caption">
              <h4>{newsData.title}</h4>
              <p>{newsData.summary || getExcerpt(newsData.content, 200)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
