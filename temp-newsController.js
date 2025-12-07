// ===================================
// NEWS CONTROLLER
// ===================================

import { getCollection, saveCollection, addDocument, updateDocument, deleteDocument, findOne } from '../utils/database.js';
import { generateId, sanitizeHtml, successResponse, errorResponse, paginate } from '../utils/helpers.js';

/**
 * Get all news
 */
export const getAllNews = (req, res) => {
  try {
    const news = getCollection('news').sort((a, b) => {
      const idA = typeof a.id === 'string' ? parseInt(a.id) : a.id;
      const idB = typeof b.id === 'string' ? parseInt(b.id) : b.id;
      return idB - idA;
    });

    const { page, limit } = req.query;

    if (page && limit) {
      const result = paginate(news, parseInt(page), parseInt(limit));
      return res.json(successResponse(result));
    }

    res.json(news);
  } catch (error) {
    console.error('Error get news:', error);
    res.status(500).json(errorResponse('Failed to fetch news', error));
  }
};

/**
 * Get news by ID - supports both string and integer ID
 */
export const getNewsById = (req, res) => {
  try {
    const { id } = req.params;
    const allNews = getCollection('news');
    const news = allNews.find(n => n.id === id || n.id === parseInt(id));

    if (!news) {
      return res.status(404).json(errorResponse('News not found'));
    }

    res.json(news);
  } catch (error) {
    console.error('Error get news by ID:', error);
    res.status(500).json(errorResponse('Failed to fetch news', error));
  }
};

/**
 * Create news
 */
export const createNews = (req, res) => {
  try {
    const { title, content, author, category, image, featured } = req.body;

    if (!title || !content) {
      return res.status(400).json(errorResponse('Title and content are required'));
    }

    const newNews = addDocument('news', {
      title: title.trim(),
      content: sanitizeHtml(content),
      author: author || 'Admin',
      category: category || 'Umum',
      image: image || '/uploads/images/placeholder-news.png',
      featured: featured || false,
      views: 0,
      published: true
    });

    console.log('News created:', newNews.title);

    res.status(201).json(successResponse(newNews, 'News created successfully'));
  } catch (error) {
    console.error('Error create news:', error);
    res.status(500).json(errorResponse('Failed to create news', error));
  }
};

/**
 * Update news - supports both string and integer ID
 */
export const updateNews = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Sanitize content if provided
    if (updates.content) {
      updates.content = sanitizeHtml(updates.content);
    }

    // Get news collection
    const allNews = getCollection('news');
    const newsIndex = allNews.findIndex(n => n.id === id || n.id === parseInt(id));

    if (newsIndex === -1) {
      return res.status(404).json(errorResponse('News not found'));
    }

    // Update news
    allNews[newsIndex] = {
      ...allNews[newsIndex],
      ...updates,
      id: allNews[newsIndex].id // Keep original ID
    };

    saveCollection('news', allNews);

    console.log('News updated: ID', id);

    res.json(successResponse(allNews[newsIndex], 'News updated successfully'));
  } catch (error) {
    console.error('Error update news:', error);
    res.status(500).json(errorResponse('Failed to update news', error));
  }
};

/**
 * Delete news - supports both string and integer ID
 */
export const deleteNews = (req, res) => {
  try {
    const { id } = req.params;

    const allNews = getCollection('news');
    const newsIndex = allNews.findIndex(n => n.id === id || n.id === parseInt(id));

    if (newsIndex === -1) {
      return res.status(404).json(errorResponse('News not found'));
    }

    allNews.splice(newsIndex, 1);
    saveCollection('news', allNews);

    console.log('News deleted: ID', id);

    res.json(successResponse({ id }, 'News deleted successfully'));
  } catch (error) {
    console.error('Error delete news:', error);
    res.status(500).json(errorResponse('Failed to delete news', error));
  }
};

/**
 * Set featured news - supports both string and integer ID
 */
export const setFeaturedNews = (req, res) => {
  try {
    const { id } = req.params;

    // Remove featured from all news
    const allNews = getCollection('news');
    const updatedNews = allNews.map(news => ({
      ...news,
      featured: news.id === id || news.id === parseInt(id)
    }));

    saveCollection('news', updatedNews);

    console.log('Featured news set: ID', id);

    res.json(successResponse({ id }, 'Featured news updated'));
  } catch (error) {
    console.error('Error set featured news:', error);
    res.status(500).json(errorResponse('Failed to set featured news', error));
  }
};

/**
 * Get featured news
 */
export const getFeaturedNews = (req, res) => {
  try {
    const allNews = getCollection('news');
    const featured = allNews.find(news => news.featured);

    if (!featured) {
      return res.status(404).json(errorResponse('No featured news found'));
    }

    res.json(featured);
  } catch (error) {
    console.error('Error get featured news:', error);
    res.status(500).json(errorResponse('Failed to fetch featured news', error));
  }
};

/**
 * Increment news views - supports both string and integer ID
 */
export const incrementViews = (req, res) => {
  try {
    const { id } = req.params;
    const allNews = getCollection('news');
    const newsIndex = allNews.findIndex(n => n.id === id || n.id === parseInt(id));

    if (newsIndex === -1) {
      return res.status(404).json(errorResponse('News not found'));
    }

    allNews[newsIndex].views = (allNews[newsIndex].views || 0) + 1;
    saveCollection('news', allNews);

    res.json(successResponse({ views: allNews[newsIndex].views }));
  } catch (error) {
    console.error('Error increment views:', error);
    res.status(500).json(errorResponse('Failed to update views', error));
  }
};
