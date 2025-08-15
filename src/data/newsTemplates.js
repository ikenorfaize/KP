/**
 * News Templates dan Default Data untuk Sistem Berita
 * File ini berisi template dan data default yang digunakan oleh sistem berita
 * Semua data berita sekarang disimpan di database (api/db.json)
 */

// Template struktur data berita standar
export const newsTemplate = {
  id: '', // Will be generated automatically (timestamp format: 17550xxxxx)
  title: '',
  summary: '',
  content: '', // HTML content for Quill editor
  author: '',
  category: 'general', // Options: general, education, technology, announcement, etc.
  featured: false,
  publishDate: '', // ISO string format
  createdAt: '', // ISO string format
  updatedAt: '', // ISO string format
  image: '', // Path to image: /src/assets/BeritaX.png
  tags: [] // Array of strings
};

// Categories yang tersedia
export const newsCategories = [
  { value: 'general', label: 'Umum' },
  { value: 'education', label: 'Pendidikan' },
  { value: 'technology', label: 'Teknologi' },
  { value: 'announcement', label: 'Pengumuman' },
  { value: 'training', label: 'Pelatihan' },
  { value: 'certification', label: 'Sertifikasi' },
  { value: 'government', label: 'Pemerintahan' }
];

// Default news data for fallback (if API fails)
export const defaultNewsData = [
  {
    id: '1755000000001',
    title: 'Penyerahan Sertifikat Hak Atas Tanah (SeHAT) Nelayan',
    summary: 'Program sertifikasi tanah untuk meningkatkan kesejahteraan nelayan di wilayah pesisir.',
    author: 'PERGUNU Situbondo',
    category: 'certification',
    image: '/src/assets/Berita1.png',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '1755000000002',
    title: 'Pelatihan Teknologi Penangkapan Ikan Modern',
    summary: 'Upaya peningkatan kapasitas nelayan melalui teknologi modern dan berkelanjutan.',
    author: 'DKP Situbondo',
    category: 'training',
    image: '/src/assets/Berita2.png',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '1755000000003',
    title: 'Kunjungan Bupati & Wakil Bupati Situbondo',
    summary: 'Koordinasi program pembangunan sektor kelautan dan perikanan daerah.',
    author: 'Pemerintah Situbondo',
    category: 'government',
    image: '/src/assets/Berita3.png',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '1755000000004',
    title: 'RUU Sistem Pendidikan Nasional - Kontribusi, Aspirasi dan Inspirasi Perguruan Tinggi, PAI, PJJ, Madrasah dan Pondok Pesantren',
    summary: 'Diskusi mengenai Rancangan Undang-Undang Sistem Pendidikan Nasional (RUU Sisdiknas) yang menyoroti kontribusi, aspirasi, dan inspirasi dari berbagai elemen pendidikan.',
    author: 'Tim Redaksi PERGUNU',
    category: 'education',
    image: '/src/assets/Berita4.png',
    createdAt: new Date(Date.now() - 345600000).toISOString()
  }
];

// Image mapping untuk konversi path database ke imported images
export const imageMapping = {
  '/src/assets/Berita1.png': 'berita1Img',
  '/src/assets/Berita2.png': 'berita2Img',
  '/src/assets/Berita3.png': 'berita3Img',
  '/src/assets/Berita4.png': 'berita4Img',
  'Berita1.png': 'berita1Img',
  'Berita2.png': 'berita2Img',
  'Berita3.png': 'berita3Img',
  'Berita4.png': 'berita4Img'
};

// Helper function untuk generate ID berita baru
export const generateNewsId = () => {
  return Date.now().toString();
};

// Helper function untuk format tanggal
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Helper function untuk create news object
export const createNewsObject = (data) => {
  const now = new Date().toISOString();
  return {
    ...newsTemplate,
    ...data,
    id: data.id || generateNewsId(),
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    publishDate: data.publishDate || now
  };
};

// Legacy route mapping untuk backward compatibility
export const legacyRouteMapping = {
  'berita-1': '1755000000001',
  'berita-2': '1755000000002', 
  'berita-3': '1755000000003',
  'berita4': '1755000000004'
};

export default {
  newsTemplate,
  newsCategories,
  defaultNewsData,
  imageMapping,
  generateNewsId,
  formatDate,
  createNewsObject,
  legacyRouteMapping
};
