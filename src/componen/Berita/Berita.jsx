import React from "react";
import { useNavigate } from "react-router-dom"; // Hook untuk navigasi programmatic
import "./Berita.css";
import { useScrollAnimation } from "../../hooks/useScrollAnimation"; // Custom hook scroll animation
// Import gambar-gambar berita
import berita4Img from "../../assets/Berita4.png";
import berita1Img from "../../assets/Berita1.png";
import berita2Img from "../../assets/Berita2.png";
import berita3Img from "../../assets/Berita3.png";

// KOMPONEN BERITA - Menampilkan preview berita dengan featured article dan grid
const Berita = () => {
  const navigate = useNavigate(); // Hook untuk navigasi ke halaman berita
  const [ref, isVisible] = useScrollAnimation(); // Hook animasi saat scroll

  // Ambil berita dari API agar sinkron dengan Admin NewsManager
  const [items, setItems] = React.useState([]);
  const [featured, setFeatured] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [rotatedItems, setRotatedItems] = React.useState([]); // Array yang akan diputar untuk carousel
  const [isTransitioning, setIsTransitioning] = React.useState(false); // State untuk animasi

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  // Map path di database ke import gambar yang tersedia di FE
  const imageMap = React.useMemo(() => ({
    "/src/assets/Berita1.png": berita1Img,
    "/src/assets/Berita2.png": berita2Img,
    "/src/assets/Berita3.png": berita3Img,
    "/src/assets/Berita4.png": berita4Img,
  }), []);

  // Refetch logic extracted for reuse
  const fetchBerita = React.useCallback(async (isMounted = true) => {
    try {
      setLoading(true);
      const listResp = await fetch(`${API_BASE}/news`);
      if (listResp.ok) {
        let data = await listResp.json();
        if (isMounted && Array.isArray(data)) {
          if (data.length < 4) {
            const placeholders = generatePlaceholders(4 - data.length);
            data = [...data, ...placeholders];
          }
          setItems(data);
          const featuredItem = data.find(n => n.featured === true);
          if (featuredItem && isMounted) {
            setFeatured(featuredItem);
          } else if (data.length > 0 && isMounted) {
            setFeatured(data[0]);
          }
        }
      } else {
        const defaultItems = getDefaultNewsItems();
        if (isMounted) {
          setItems(defaultItems);
          setFeatured(defaultItems.find(n => n.featured) || defaultItems[0]);
        }
      }
    } catch (e) {
      setError(e?.message || "Gagal memuat berita");
      const defaultItems = getDefaultNewsItems();
      if (isMounted) {
        setItems(defaultItems);
        setFeatured(defaultItems.find(n => n.featured) || defaultItems[0]);
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  }, [API_BASE]);

  React.useEffect(() => {
    let isMounted = true;
    fetchBerita(isMounted);
    // Listen for live update event
    const handler = () => fetchBerita(isMounted);
    window.addEventListener('news-updated', handler);
    return () => {
      isMounted = false;
      window.removeEventListener('news-updated', handler);
    };
  }, [fetchBerita]);

  // Generate placeholder news items to fill minimum requirement
  const generatePlaceholders = (count) => {
    const placeholderTitles = [
      'Pelatihan Digital Marketing untuk Guru',
      'Sertifikasi Profesi Guru Tahun 2025', 
      'Kongres Nasional PERGUNU 2025',
      'Workshop Teknologi Pendidikan Modern',
      'Seminar Nasional Pendidikan Karakter'
    ];
    
    return Array.from({ length: count }, (_, index) => ({
      id: `placeholder-${Date.now()}-${index}`,
      title: placeholderTitles[index % placeholderTitles.length],
      summary: 'Informasi lebih lanjut akan segera tersedia. Tetap pantau portal berita PERGUNU untuk update terbaru.',
      content: 'Konten berita sedang dalam persiapan. Silakan kembali lagi nanti untuk informasi lengkap.',
      author: 'Tim PERGUNU',
      category: 'Pengumuman',
      image: '/src/assets/Berita1.png',
      featured: false,
      isPlaceholder: true,
      createdAt: new Date(Date.now() - (index * 86400000)).toISOString()
    }));
  };
  
  // Default news items if API completely fails
  const getDefaultNewsItems = () => [
    {
      id: 'default-featured',
      title: 'RUU Sistem Pendidikan Nasional - Kontribusi, Aspirasi dan Inspirasi',
      summary: 'Diskusi mengenai RUU Sisdiknas yang menyoroti kontribusi, aspirasi, dan inspirasi dari berbagai elemen pendidikan.',
      content: 'Portal berita resmi Persatuan Guru Nahdlatul Ulama menyajikan informasi terkini seputar pendidikan.',
      author: 'Tim PERGUNU',
      category: 'Kebijakan',
      image: '/src/assets/Berita4.png',
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'default-1',
      title: 'Penyerahan Sertifikat Hak Atas Tanah (SeHAT)',
      summary: 'Program sertifikasi tanah untuk masyarakat sebagai bagian dari peningkatan kesejahteraan.',
      author: 'Tim Editorial',
      category: 'Program',
      image: '/src/assets/Berita1.png',
      featured: false,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'default-2', 
      title: 'Pelatihan Teknologi Penangkapan Ikan oleh DKP Situbondo',
      summary: 'Upaya peningkatan kapasitas nelayan melalui teknologi modern dan berkelanjutan.',
      author: 'DKP Situbondo',
      category: 'Pelatihan',
      image: '/src/assets/Berita2.png',
      featured: false,
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'default-3',
      title: 'Bupati & Wakil Bupati Situbondo bersama DKP',
      summary: 'Koordinasi program pembangunan sektor kelautan dan perikanan daerah.',
      author: 'Pemerintah Situbondo',
      category: 'Pemerintahan',
      image: '/src/assets/Berita3.png',
      featured: false,
      createdAt: new Date(Date.now() - 259200000).toISOString()
    }
  ];

  // top 3 excluding featured if present + carousel rotation
  const topThree = React.useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    const filtered = featured ? list.filter(n => n.id !== featured.id) : list;
    
    // Ensure minimum 4 items for proper carousel with placeholders if needed
    let finalList = [...filtered];
    if (finalList.length < 4) {
      const placeholderCount = 4 - finalList.length;
      const placeholders = generatePlaceholders(placeholderCount);
      finalList = [...finalList, ...placeholders];
    }
    
    return finalList;
  }, [items, featured]);

  // Initialize rotated items when topThree changes
  React.useEffect(() => {
    if (topThree.length > 0) {
      setRotatedItems([...topThree]);
    }
  }, [topThree]);

  // Carousel navigation dengan rotasi array
  const itemsPerPage = 3;
  
  // Ambil 3 item pertama dari rotated array untuk ditampilkan
  const currentGridItems = React.useMemo(() => {
    return rotatedItems.slice(0, itemsPerPage);
  }, [rotatedItems, itemsPerPage]);

  // Navigation functions - array rotation carousel dengan animasi
  const goToPrevGrid = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    setIsTransitioning(true);
    setTimeout(() => {
      setRotatedItems(prevItems => {
        if (prevItems.length === 0) return prevItems;
        
        // Tombol KIRI: Pindahkan elemen pertama ke belakang (shift → push)
        const newItems = [...prevItems];
        const firstItem = newItems.shift();
        if (firstItem) {
          newItems.push(firstItem);
        }
        return newItems;
      });
      setIsTransitioning(false);
    }, 100);
  };
  
  const goToNextGrid = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    setIsTransitioning(true);
    setTimeout(() => {
      setRotatedItems(prevItems => {
        if (prevItems.length === 0) return prevItems;
        
        // Tombol KANAN: Pindahkan elemen terakhir ke depan (pop → unshift)
        const newItems = [...prevItems];
        const lastItem = newItems.pop();
        if (lastItem) {
          newItems.unshift(lastItem);
        }
        return newItems;
      });
      setIsTransitioning(false);
    }, 100);
  };

  return (
    <section
      className={`berita-section ${isVisible ? "animate" : ""}`} // Class conditional untuk animasi
      id="berita" // ID untuk scroll navigation
      ref={ref} // Ref untuk detect scroll position
    >
      <div className="berita-wrapper">
        <p className="berita-label">Berita</p>

        {/* Berita utama - Featured article dengan layout khusus */}
        <div className="berita-utama-card" onClick={() => navigate(featured?.id ? `/berita/${featured.id}` : '/berita4')}>
          <div className="berita-utama-content">
            <h3>
              {featured?.title || (
                <>
                  RUU Sistem Pendidikan Nasional <br />
                  "Kontribusi, Aspirasi dan Inspirasi Perguruan Tinggi, PAI, PJJ, Madrasah dan Pondok Pesantren"
                </>
              )}
            </h3>
            <p>
              {featured?.summary || 'Diskusi mengenai RUU Sisdiknas yang menyoroti kontribusi, aspirasi, dan inspirasi dari berbagai elemen pendidikan.'}
            </p>
            <button>
              baca selengkapnya
            </button>
          </div>
          <img src={featured ? (imageMap[featured.image || featured.imageUrl] || berita4Img) : berita4Img} alt="Berita utama" />
        </div>

        {/* Grid berita lainnya dengan navigasi - Layout grid untuk multiple articles*/}
        <div className="berita-grid-container" style={{position: 'relative'}}>
          {/* Navigation arrows - selalu aktif untuk carousel looping */}
          {rotatedItems.length > 0 && (
            <>
              <button 
                className="berita-nav-btn berita-nav-left" 
                onClick={goToPrevGrid}
                style={{
                  position: 'absolute',
                  left: '-50px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid #1e7e34',
                  background: 'white',
                  color: '#1e7e34',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(30, 126, 52, 0.2)',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#1e7e34';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#1e7e34';
                }}
              >
                ◀
              </button>
              <button 
                className="berita-nav-btn berita-nav-right" 
                onClick={goToNextGrid}
                style={{
                  position: 'absolute',
                  right: '-50px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid #1e7e34',
                  background: 'white',
                  color: '#1e7e34',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(30, 126, 52, 0.2)',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#1e7e34';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#1e7e34';
                }}
              >
                ▶
              </button>
            </>
          )}
          
          <div className={`berita-grid ${isTransitioning ? 'sliding' : ''}`}>
            {/* Jika API tersedia, tampilkan 3 berita per halaman; jika tidak, fallback ke konten statis */}
            {currentGridItems.length > 0 && !loading && !error ? (
              currentGridItems.map((n, idx) => {
                // Penanganan gambar: jika berita tidak punya gambar, tampilkan placeholder kosong
                let imgSrc = null;
                
                if (n.image || n.imageUrl) {
                  // Jika ada image/imageUrl, coba map ke import gambar
                  imgSrc = imageMap[n.image || n.imageUrl];
                }
                
                // Jika masih null, gunakan placeholder kosong
                if (!imgSrc) {
                  imgSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }
                
                // Dynamic routing berdasarkan ID berita
                const to = `/berita/${n.id}`;
                return (
                  <div key={n.id || idx} className="berita-card" onClick={() => navigate(to)}>
                    <img src={imgSrc} alt={n.title || `Berita ${idx + 1}`} />
                    <p>{n.title || "Berita"}</p>
                  </div>
                );
              })
            ) : (
              <>
                <div className="berita-card" onClick={() => navigate("/berita-1")}>
                  <img src={berita1Img} alt="Berita 1" />
                  <p>Penyerahan Sertifikat Hak Atas Tanah (SeHAT)...</p>
                </div>
                <div className="berita-card" onClick={() => navigate("/berita-2")}>
                  <img src={berita2Img} alt="Berita 2" />
                  <p>Pelatihan Teknologi Penangkapan Ikan oleh DKP Situbondo</p>
                </div>
                <div className="berita-card" onClick={() => navigate("/berita-3")}>
                  <img src={berita3Img} alt="Berita 3" />
                  <p>Bupati & Wakil Bupati Situbondo bersama DKP</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Berita;
