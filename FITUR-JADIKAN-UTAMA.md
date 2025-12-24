# Dokumentasi Fitur "Jadikan Utama" (Featured News)

## 📋 Overview
Fitur ini memungkinkan admin untuk menandai satu berita sebagai "Berita Utama" yang akan ditampilkan secara prominent di homepage. Fitur ini dilengkapi dengan toggle button, visual feedback, dan auto-sorting.

## ✅ Fitur Utama

### 1. **Toggle Button dengan Visual Feedback**
- Button berubah warna dan teks saat berita dijadikan utama
- State normal: `⭐ Jadikan Utama` (putih dengan border kuning)
- State aktif: `⭐ Berita Utama` (gradient kuning-oranye, teks putih bold)
- Hover effect dengan shadow untuk UX yang lebih baik

### 2. **Single Featured News Constraint**
- Hanya satu berita yang bisa featured di satu waktu
- Saat berita baru dijadikan utama, berita utama lama otomatis di-unset
- Backend menangani logic ini secara otomatis

### 3. **Auto-Sort di Admin Panel**
- Berita utama otomatis muncul paling atas di daftar
- Sorting: Featured first → Terbaru dulu (by createdAt)
- Real-time update saat status featured berubah

### 4. **Visual Highlight di Admin Panel**
- Card berita utama memiliki:
  - Border kuning (2px solid)
  - Background gradient subtle (cream to white)
  - Badge "⭐ Berita Utama" di pojok kanan atas
  - Shadow lebih prominent

### 5. **Prominent Display di Homepage**
- Berita utama tampil di section `.berita-utama-card`
- Border kuning untuk highlight
- Badge "⭐ Berita Utama" di atas card
- Gradient yellow-orange untuk visual emphasis

### 6. **Real-time Synchronization**
- Event system untuk live update tanpa reload:
  - `featured-news-changed`: Triggered saat status featured berubah
  - `news-updated`: Triggered saat ada perubahan berita
- Homepage otomatis update saat admin mengubah featured news

## 🔧 Technical Implementation

### Frontend Changes

#### 1. **NewsManager.jsx** (`frontend/src/componen/NewsManager/NewsManager.jsx`)

**handleSetFeatured Function** (Lines 479-520):
```javascript
const handleSetFeatured = async (newsId, currentFeaturedStatus) => {
  // Toggle logic dengan konfirmasi
  // Call API PUT /news/:id/feature dengan body { featured: !currentFeaturedStatus }
  // Dispatch 'featured-news-changed' event
  // Reload news list dengan auto-sort
};
```

**fetchNews Function** (Lines 79-104):
```javascript
const fetchNews = async () => {
  // Fetch dari API
  // Sort: Featured di atas, kemudian by createdAt
  const sortedData = data.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};
```

**Button UI** (Lines 853-859):
```jsx
<button
  className={`btn-feature ${news.featured ? 'btn-feature--active' : ''}`}
  onClick={() => handleSetFeatured(news.id, news.featured)}
  title={news.featured ? 'Klik untuk batalkan berita utama' : 'Jadikan berita utama'}
>
  {news.featured ? '⭐ Berita Utama' : '⭐ Jadikan Utama'}
</button>
```

#### 2. **NewsManager.css** (`frontend/src/componen/NewsManager/NewsManager.css`)

**Featured Button Styles** (Lines 140-177):
```css
/* Normal state */
.btn-feature {
  padding: 6px 12px;
  border: 1px solid #f59e0b;
  background: #fff;
  color: #b45309;
  font-weight: 500;
}

/* Active state - Berita Utama */
.btn-feature.btn-feature--active {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-color: #d97706;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
}
```

**Featured Card Highlight** (Lines 128-149):
```css
.admin-news-card.admin-news-card--featured {
  border: 2px solid #f59e0b;
  box-shadow: 0 4px 12px rgba(245,158,11,.25);
  background: linear-gradient(to bottom, #fffbeb 0%, #fff 100%);
  position: relative;
}

.admin-news-card.admin-news-card--featured::before {
  content: "⭐ Berita Utama";
  position: absolute;
  top: -8px;
  right: 12px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}
```

#### 3. **Berita.jsx** (`frontend/src/componen/Berita/Berita.jsx`)

**Event Listener for Featured Changes** (Lines 123-141):
```javascript
React.useEffect(() => {
  let isMounted = true;
  fetchBerita(isMounted);
  
  // Listen for news updates and featured changes
  const handler = () => fetchBerita(isMounted);
  const featuredHandler = (event) => {
    console.log('🔄 Featured news changed:', event.detail);
    fetchBerita(isMounted);
  };
  
  window.addEventListener('news-updated', handler);
  window.addEventListener('featured-news-changed', featuredHandler);
  
  return () => {
    isMounted = false;
    window.removeEventListener('news-updated', handler);
    window.removeEventListener('featured-news-changed', featuredHandler);
  };
}, [fetchBerita]);
```

#### 4. **Berita.css** (`frontend/src/componen/Berita/Berita.css`)

**Featured News Highlight on Homepage** (Lines 25-54):
```css
.berita-utama-card {
  /* ... existing styles ... */
  border: 2px solid #fbbf24; /* Yellow border */
  position: relative;
}

.berita-utama-card::before {
  content: "⭐ Berita Utama";
  position: absolute;
  top: -12px;
  left: 20px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  z-index: 2;
}
```

### Backend Changes

#### **newsController.js** (`backend/src/controllers/newsController.js`)

**setFeaturedNews Function** (Lines 128-168):
```javascript
export const setFeaturedNews = (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;
    
    const allNews = getCollection('news');
    const targetNews = allNews.find(news => news.id === parseInt(id));
    
    if (!targetNews) {
      return res.status(404).json(errorResponse('News not found'));
    }
    
    // Toggle logic: if featured is provided use it, otherwise toggle current status
    const shouldBeFeatured = featured !== undefined ? featured : !targetNews.featured;
    
    // Update all news: only one can be featured
    const updatedNews = allNews.map(news => ({
      ...news,
      featured: shouldBeFeatured ? (news.id === parseInt(id)) : false
    }));
    
    saveCollection('news', updatedNews);
    
    console.log(`✅ Featured news ${shouldBeFeatured ? 'set' : 'unset'}: ID ${id}`);
    
    res.json(successResponse({ 
      id, 
      featured: shouldBeFeatured 
    }, `Featured news ${shouldBeFeatured ? 'set' : 'unset'} successfully`));
  } catch (error) {
    console.error('❌ Set featured news error:', error);
    res.status(500).json(errorResponse('Failed to set featured news', error));
  }
};
```

## 🎨 Design System

### Color Palette
- **Primary Yellow**: `#fbbf24` (featured highlight)
- **Secondary Orange**: `#f59e0b` (gradient end, borders)
- **Dark Orange**: `#d97706` (hover states)
- **Warm Orange**: `#b45309` (text color)
- **Light Cream**: `#fffbeb` (subtle background)

### Typography
- **Badge Font Size**: `0.75rem` - `0.85rem`
- **Button Font Weight**: `500` (normal), `600` (active)

### Shadows & Effects
- **Normal Shadow**: `0 2px 6px rgba(245, 158, 11, 0.3)`
- **Hover Shadow**: `0 3px 8px rgba(245, 158, 11, 0.4)`
- **Card Shadow**: `0 4px 12px rgba(245, 158, 11, 0.25)`

## 📊 API Endpoints

### PUT `/api/news/:id/feature`
**Purpose**: Toggle featured status untuk berita tertentu

**Headers**:
```json
{
  "Content-Type": "application/json",
  "x-user-id": "admin_user_id"
}
```

**Request Body**:
```json
{
  "featured": true  // atau false untuk unset
}
```

**Response Success** (200):
```json
{
  "success": true,
  "data": {
    "id": 123,
    "featured": true
  },
  "message": "Featured news set successfully"
}
```

**Response Error** (404):
```json
{
  "success": false,
  "error": "News not found"
}
```

### GET `/api/news/featured`
**Purpose**: Ambil berita utama saat ini

**Response Success** (200):
```json
{
  "id": 123,
  "title": "Judul Berita Utama",
  "content": "...",
  "featured": true,
  "image": "https://...",
  "author": "Admin",
  "category": "Pengumuman",
  "createdAt": "2025-01-20T10:00:00.000Z"
}
```

**Response Error** (404):
```json
{
  "success": false,
  "error": "No featured news found"
}
```

## 🔄 Event System

### Custom Events

#### 1. **`featured-news-changed`**
**Triggered**: Saat status featured news berubah (set/unset)
**Payload**:
```javascript
{
  detail: {
    newsId: 123,
    featured: true,
    imageUrl: "https://..." // optional
  }
}
```

**Dispatch Example**:
```javascript
window.dispatchEvent(new CustomEvent('featured-news-changed', {
  detail: {
    newsId: newsId,
    featured: !currentFeaturedStatus
  }
}));
```

#### 2. **`news-updated`**
**Triggered**: Saat ada perubahan umum pada berita
**Payload**: None (simple Event)

**Dispatch Example**:
```javascript
window.dispatchEvent(new Event('news-updated'));
```

## 🧪 Testing Guide

### Manual Testing Checklist

#### Admin Panel
- [ ] Login sebagai admin
- [ ] Klik "⭐ Jadikan Utama" pada berita non-featured
  - ✅ Button berubah ke "⭐ Berita Utama" (yellow gradient)
  - ✅ Card mendapat border kuning dan badge
  - ✅ Berita pindah ke posisi teratas list
  - ✅ Success message muncul
- [ ] Klik "⭐ Berita Utama" pada berita featured
  - ✅ Button kembali ke "⭐ Jadikan Utama" (white)
  - ✅ Border dan badge hilang
  - ✅ Success message muncul
- [ ] Jadikan berita A utama, lalu jadikan berita B utama
  - ✅ Hanya berita B yang featured
  - ✅ Berita A otomatis di-unset
- [ ] Refresh halaman
  - ✅ Status featured tetap tersimpan

#### Homepage
- [ ] Buka homepage sebagai visitor
- [ ] Scroll ke section "Berita"
  - ✅ Berita utama tampil di `.berita-utama-card`
  - ✅ Badge "⭐ Berita Utama" muncul
  - ✅ Border kuning terlihat
  - ✅ Image dan konten sesuai
- [ ] Admin set berita berbeda sebagai utama (di tab lain)
  - ✅ Homepage otomatis update tanpa reload (event listener)
- [ ] Admin unset featured news
  - ✅ Homepage menampilkan berita terbaru sebagai fallback

## 📝 User Flow

### Scenario 1: Set Featured News
1. Admin masuk ke dashboard
2. Scroll ke section "Kelola Berita"
3. Klik button "⭐ Jadikan Utama" pada berita yang diinginkan
4. Konfirmasi muncul: "Jadikan berita ini sebagai berita utama? Berita utama sebelumnya akan diganti."
5. Klik "OK"
6. Button berubah ke "⭐ Berita Utama" (yellow)
7. Card berita mendapat highlight
8. Berita pindah ke posisi teratas
9. Success notification: "✅ Berita berhasil dijadikan utama!"
10. Buka homepage → Berita tampil di section utama

### Scenario 2: Unset Featured News
1. Admin melihat berita dengan button "⭐ Berita Utama" (yellow)
2. Klik button tersebut
3. Konfirmasi: "Batalkan berita utama ini?"
4. Klik "OK"
5. Button kembali ke "⭐ Jadikan Utama" (white)
6. Highlight hilang dari card
7. Success notification: "✅ Status berita utama dibatalkan!"
8. Homepage fallback ke berita terbaru

### Scenario 3: Replace Featured News
1. Berita A sedang featured
2. Admin klik "⭐ Jadikan Utama" pada berita B
3. Konfirmasi: "Jadikan berita ini sebagai berita utama? Berita utama sebelumnya akan diganti."
4. Klik "OK"
5. Berita B menjadi featured (yellow button, badge muncul, pindah ke atas)
6. Berita A otomatis di-unset (button kembali white, highlight hilang)
7. Homepage update menampilkan berita B

## 🐛 Known Issues & Solutions

### Issue 1: Event tidak ter-trigger
**Symptom**: Homepage tidak update saat admin set featured
**Solution**: 
```javascript
// Pastikan event listener terpasang di useEffect
window.addEventListener('featured-news-changed', featuredHandler);
```

### Issue 2: Multiple featured news
**Symptom**: Lebih dari satu berita menjadi featured
**Solution**: Backend controller sudah handle dengan `map()` dan condition `news.id === parseInt(id)`

### Issue 3: Featured news tidak persist setelah refresh
**Symptom**: Status featured hilang setelah reload
**Solution**: Backend menyimpan ke `db.json` dengan `saveCollection()`, pastikan write permission OK

## 🚀 Future Enhancements

### Potential Improvements
1. **Featured News Duration**
   - Auto-unset featured setelah X hari
   - Schedule featured news (set tanggal mulai/selesai)

2. **Analytics**
   - Track views untuk featured news
   - Analytics dashboard untuk performa featured news

3. **Multiple Featured Categories**
   - Featured news per kategori
   - Featured news + Featured tutorial + Featured event

4. **Rich Preview**
   - OG tags untuk featured news
   - Twitter card untuk sharing

5. **Notification System**
   - Notify followers saat ada featured news baru
   - Email blast untuk featured announcements

## 📚 Related Files

### Frontend
- `frontend/src/componen/NewsManager/NewsManager.jsx` - Admin panel
- `frontend/src/componen/NewsManager/NewsManager.css` - Admin styles
- `frontend/src/componen/Berita/Berita.jsx` - Homepage display
- `frontend/src/componen/Berita/Berita.css` - Homepage styles
- `frontend/src/context/NewsImageContext.jsx` - Image sync context

### Backend
- `backend/src/routes/news.js` - API routes
- `backend/src/controllers/newsController.js` - Business logic
- `backend/src/db.json` - Data persistence

## ✍️ Changelog

### Version 1.0 (2025-01-23)
- ✅ Implement toggle button dengan visual feedback
- ✅ Add auto-sort (featured first)
- ✅ Add featured card highlight di admin panel
- ✅ Add featured badge di homepage
- ✅ Implement single featured constraint
- ✅ Add real-time event synchronization
- ✅ Backend toggle functionality
- ✅ Complete documentation

---

**Developed by**: Fairuz Fuadi & Ike Norfaize  
**Project**: PERGUNU Situbondo Website  
**Date**: 23 Januari 2025  
**Status**: ✅ Production Ready
