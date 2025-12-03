# 🔄 **SISTEM SINKRONISASI GAMBAR BERITA**

## 📋 **Penjelasan Sistem**

Sistem ini memungkinkan sinkronisasi otomatis gambar berita antara:
- **Admin Panel** (`admin-news-grid` dengan `admin-card-cover`)
- **Sidebar Widget** (gambar dengan `loading="lazy"`)
- **Section Berita Utama** (featured image)
- **Detail Berita** (image overlay)

### 🏗️ **Arsitektur Sistem**

```
NewsImageContext (Provider)
├── State Management
│   ├── newsImages: { [newsId]: imageUrl }
│   ├── featuredNewsImage: string
│   └── Event Listeners
├── Components
│   ├── NewsManager → Dispatch Events
│   ├── SidebarWidget → Listen & Sync
│   ├── Berita → Listen & Sync
│   └── NewsDetail → Listen & Sync
```

## 🎯 **Cara Kerja**

### 1. **Upload Gambar di Admin Panel**
```javascript
// Di NewsManager.jsx
const uploadedImagePath = imageResult.filename;
const fullImageUrl = `http://localhost:3002/uploads/images/${uploadedImagePath}`;

// Dispatch event untuk sinkronisasi
window.dispatchEvent(new CustomEvent('news-image-updated', {
  detail: {
    newsId: updatedNews.id,
    imageUrl: fullImageUrl,
    featured: updatedNews.featured
  }
}));
```

### 2. **Context Menangkap Event**
```javascript
// Di NewsImageContext.jsx
useEffect(() => {
  const handleNewsUpdate = (event) => {
    const { newsId, imageUrl, featured } = event.detail;
    
    if (newsId && imageUrl) {
      updateNewsImage(newsId, imageUrl);
    }
    
    if (featured && imageUrl) {
      updateFeaturedImage(imageUrl);
    }
  };

  window.addEventListener('news-image-updated', handleNewsUpdate);
}, []);
```

### 3. **Komponen Menggunakan Context**
```javascript
// Di SidebarWidget.jsx, Berita.jsx, NewsDetail.jsx
const { getNewsImage, featuredNewsImage } = useNewsImage();

const getImageSrc = (imageUrl, newsId, isFeatured) => {
  // Prioritas:
  // 1. Featured image dari context (jika featured)
  // 2. Image untuk newsId spesifik dari context
  // 3. Image URL asli
  // 4. Fallback default
  
  if (isFeatured && featuredNewsImage !== '/src/assets/noimage.png') {
    return featuredNewsImage;
  }
  
  if (newsId) {
    const contextImage = getNewsImage(newsId);
    if (contextImage !== '/src/assets/noimage.png') {
      return contextImage;
    }
  }
  
  return processOriginalImageUrl(imageUrl);
};
```

## 🔧 **Implementasi Detail**

### **App.jsx**
```jsx
import { NewsImageProvider } from "./context/NewsImageContext";

return (
  <NewsImageProvider>
    <Routes>
      // ... semua routes
    </Routes>
  </NewsImageProvider>
);
```

### **NewsManager.jsx** (Admin Panel)
- Upload gambar ke `http://localhost:3002/upload-image`
- Simpan filename ke database
- Dispatch event `news-image-updated` dengan detail lengkap
- Jika featured news, dispatch `featured-news-changed`

### **Komponen Berita**
- Import `useNewsImage` hook
- Update `getImageSrc`/`getImageWithFallback` functions
- Tambahkan parameter `newsId` dan `isFeatured`
- Prioritaskan context image over original URL

## 📝 **Contoh Penggunaan**

### **Upload di Admin Panel:**
1. Pilih file gambar di form admin
2. Klik "Simpan" atau "Update"
3. Gambar otomatis ter-upload ke file server
4. Event dispatched ke semua komponen
5. Semua section yang menampilkan berita ini akan update gambar

### **Melihat Hasil Sinkronisasi:**
1. Buka homepage dengan berita section
2. Buka sidebar widget (berita terbaru)
3. Buka detail berita individual
4. Semua gambar akan sama dan sinkron

## 🚀 **Testing**

### **Server URLs:**
- Frontend: http://localhost:5174/
- API Server: http://localhost:3001/api
- File Server: http://localhost:3002/

### **Test Steps:**
1. Login sebagai admin
2. Upload gambar baru untuk berita featured
3. Check homepage berita section
4. Check sidebar widget
5. Check detail berita
6. Semua gambar harus sama dan ter-update

## ⚡ **Event System**

### **Events yang Di-dispatch:**
```javascript
// Ketika gambar news di-update
'news-image-updated' → {
  newsId: string,
  imageUrl: string,
  featured: boolean
}

// Ketika featured news berubah
'featured-news-changed' → {
  imageUrl: string,
  newsData: object
}
```

### **Components yang Listen:**
- `NewsImageContext` → Update state
- Semua komponen auto-update via context
- Real-time synchronization tanpa refresh

## 🎨 **Keunggulan Sistem**

✅ **Real-time Sync** - Perubahan langsung terlihat
✅ **Single Source of Truth** - Context sebagai state manager
✅ **Automatic Fallback** - Graceful handling jika image tidak ada
✅ **Performance Optimized** - Event-driven updates
✅ **Scalable** - Mudah tambah komponen baru
✅ **Type Safe** - Consistent parameter handling

## 🔧 **Troubleshooting**

### **Gambar tidak sync:**
1. Check console untuk event dispatch
2. Pastikan NewsImageProvider membungkus semua komponen
3. Verify file server berjalan di port 3002

### **Performance Issues:**
1. Event listeners auto-cleanup di unmount
2. useCallback untuk prevent re-renders
3. Conditional updates only when needed

---
**Status: ✅ IMPLEMENTED & READY TO USE**