import React from "react";
import { useNavigate } from "react-router-dom"; // Hook untuk navigasi programmatic
import "./Berita.css";
import { useScrollAnimation } from "../../hooks/useScrollAnimation"; // Custom hook scroll animation
// Import gambar-gambar berita
import beritaUtamaImg from "../../assets/BeritaUtama.png";
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
  const [gridPage, setGridPage] = React.useState(0); // Navigation for berita-grid

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  // Map path di database ke import gambar yang tersedia di FE
  const imageMap = React.useMemo(() => ({
    "/src/assets/Berita1.png": berita1Img,
    "/src/assets/Berita2.png": berita2Img,
    "/src/assets/Berita3.png": berita3Img,
  }), []);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        // fetch list first
        const listResp = await fetch(`${API_BASE}/news`);
        if (listResp.ok) {
          const data = await listResp.json();
          if (isMounted && Array.isArray(data)) {
            setItems(data);
            // check if any item is featured in the list
            const featuredItem = data.find(n => n.featured === true);
            if (featuredItem && isMounted) {
              setFeatured(featuredItem);
            }
          }
        }
      } catch (e) {
        setError(e?.message || "Gagal memuat berita");
      } finally {
        setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [API_BASE]);

  // top 3 excluding featured if present + navigation
  const topThree = React.useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    const filtered = featured ? list.filter(n => n.id !== featured.id) : list;
    return filtered;
  }, [items, featured]);

  // Grid navigation (3 items per page with looping)
  const itemsPerPage = 3;
  const totalGridPages = Math.max(1, Math.ceil(topThree.length / itemsPerPage));
  
  // Create current grid items with looping support
  const currentGridItems = React.useMemo(() => {
    if (topThree.length === 0) return [];
    
    const result = [];
    const startIndex = gridPage * itemsPerPage;
    
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (startIndex + i) % topThree.length;
      result.push(topThree[index]);
    }
    
    return result;
  }, [topThree, gridPage, itemsPerPage]);

  const goToPrevGrid = () => {
    setGridPage(p => p === 0 ? totalGridPages - 1 : p - 1);
  };
  
  const goToNextGrid = () => {
    setGridPage(p => (p + 1) % totalGridPages);
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
        <div className="berita-utama-card" onClick={() => navigate('/berita-utama')}>
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
          <img src={featured ? (imageMap[featured.image || featured.imageUrl] || beritaUtamaImg) : beritaUtamaImg} alt="Berita utama" />
        </div>

        {/* Grid berita lainnya dengan navigasi - Layout grid untuk multiple articles*/}
        <div className="berita-grid-container" style={{position: 'relative'}}>
          {/* Navigation arrows - Always show if there are items */}
          {topThree.length > 0 && (
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
                  fontWeight: 'bold'
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
                  fontWeight: 'bold'
                }}
              >
                ▶
              </button>
            </>
          )}
          
          <div className="berita-grid">
            {/* Jika API tersedia, tampilkan 3 berita per halaman; jika tidak, fallback ke konten statis */}
            {currentGridItems.length >= 3 && !loading && !error ? (
              currentGridItems.map((n, idx) => {
                const imgSrc = imageMap[n.image || n.imageUrl] || (idx === 0 ? berita1Img : idx === 1 ? berita2Img : berita3Img);
                // Sementara, rute detail tetap yang lama (berita-1/2/3) agar kompatibel dengan halaman yang sudah ada
                const to = idx === 0 ? "/berita-1" : idx === 1 ? "/berita-2" : "/berita-3";
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
