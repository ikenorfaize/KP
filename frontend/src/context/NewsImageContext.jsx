// src/context/NewsImageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const NewsImageContext = createContext();

export const useNewsImage = () => {
  const context = useContext(NewsImageContext);
  if (!context) {
    throw new Error('useNewsImage must be used within a NewsImageProvider');
  }
  return context;
};

export const NewsImageProvider = ({ children }) => {
  const [newsImages, setNewsImages] = useState({});
  const [featuredNewsImage, setFeaturedNewsImage] = useState('/src/assets/noimage.png');
  
  // Fungsi untuk update gambar news berdasarkan ID
  const updateNewsImage = (newsId, imageUrl) => {
    setNewsImages(prev => ({
      ...prev,
      [newsId]: imageUrl
    }));
  };

  // Fungsi untuk mendapatkan gambar berdasarkan news ID
  const getNewsImage = (newsId, fallbackImage = '/src/assets/noimage.png') => {
    return newsImages[newsId] || fallbackImage;
  };

  // Fungsi untuk update featured news image secara manual
  const updateFeaturedImage = (imageUrl) => {
    setFeaturedNewsImage(imageUrl);
  };

  // Fungsi untuk check dan update featured image dari API
  const checkAndUpdateFeaturedImage = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
      const FILE_SERVER = import.meta.env.VITE_FILE_SERVER_URL || 'https://kp-mocha.vercel.app';
      
      const response = await fetch(`${API_BASE}/news`);
      if (response.ok) {
        const allNews = await response.json();
        const featuredNews = allNews.find(news => news.featured);
        
        if (featuredNews && featuredNews.image) {
          // Konversi image path ke full URL jika diperlukan
          let imageUrl = featuredNews.image;
          
          if (imageUrl.startsWith('/uploads/')) {
            imageUrl = `${FILE_SERVER}${imageUrl}`;
          } else if (imageUrl && !imageUrl.includes('/') && !imageUrl.startsWith('http') && !imageUrl.startsWith('/src/')) {
            // Handle uploaded image files (filename only) - point to file-server
            imageUrl = `${FILE_SERVER}/uploads/images/${imageUrl}`;
          }
          
          setFeaturedNewsImage(imageUrl);
          updateNewsImage(featuredNews.id, imageUrl);
        }
      }
    } catch (error) {
      console.log('Error fetching featured news:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    checkAndUpdateFeaturedImage();
    
    // Listen untuk perubahan dari admin panel
    const handleNewsUpdate = (event) => {
      if (event.detail) {
        const { newsId, imageUrl, featured } = event.detail;
        
        if (newsId && imageUrl) {
          updateNewsImage(newsId, imageUrl);
        }
        
        if (featured && imageUrl) {
          updateFeaturedImage(imageUrl);
        }
      }
    };

    // Listen untuk custom events
    window.addEventListener('news-image-updated', handleNewsUpdate);
    window.addEventListener('featured-news-changed', handleNewsUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('news-image-updated', handleNewsUpdate);
      window.removeEventListener('featured-news-changed', handleNewsUpdate);
    };
  }, []);

  const value = {
    newsImages,
    featuredNewsImage,
    updateNewsImage,
    getNewsImage,
    updateFeaturedImage,
    checkAndUpdateFeaturedImage
  };

  return (
    <NewsImageContext.Provider value={value}>
      {children}
    </NewsImageContext.Provider>
  );
};