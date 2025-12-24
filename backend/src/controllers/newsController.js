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
    const news = getCollection('news').sort((a, b) => b.id - a.id);
    
    const { page, limit } = req.query;
    
    if (page && limit) {
      const result = paginate(news, parseInt(page), parseInt(limit));
      return res.json(successResponse(result));
    }
    
    res.json(news);
  } catch (error) {
    console.error('❌ Get news error:', error);
    res.status(500).json(errorResponse('Failed to fetch news', error));
  }
};

/**
 * Get news by ID
 */
export const getNewsById = (req, res) => {
  try {
    const { id } = req.params;
    const news = findOne('news', { id: parseInt(id) });
    
    if (!news) {
      return res.status(404).json(errorResponse('News not found'));
    }
    
    res.json(news);
  } catch (error) {
    console.error('❌ Get news by ID error:', error);
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
    
    console.log(`✅ News created: ${newNews.title}`);
    
    res.status(201).json(successResponse(newNews, 'News created successfully'));
  } catch (error) {
    console.error('❌ Create news error:', error);
    res.status(500).json(errorResponse('Failed to create news', error));
  }
};

/**
 * Update news
 */
export const updateNews = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Sanitize content if provided
    if (updates.content) {
      updates.content = sanitizeHtml(updates.content);
    }
    
    const updatedNews = updateDocument('news', parseInt(id), updates);
    
    if (!updatedNews) {
      return res.status(404).json(errorResponse('News not found'));
    }
    
    console.log(`✅ News updated: ID ${id}`);
    
    res.json(successResponse(updatedNews, 'News updated successfully'));
  } catch (error) {
    console.error('❌ Update news error:', error);
    res.status(500).json(errorResponse('Failed to update news', error));
  }
};

/**
 * Delete news
 */
export const deleteNews = (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = deleteDocument('news', parseInt(id));
    
    if (!deleted) {
      return res.status(404).json(errorResponse('News not found'));
    }
    
    console.log(`✅ News deleted: ID ${id}`);
    
    res.json(successResponse({ id }, 'News deleted successfully'));
  } catch (error) {
    console.error('❌ Delete news error:', error);
    res.status(500).json(errorResponse('Failed to delete news', error));
  }
};

/**
 * Set/Toggle featured news
 * If news is already featured, unset it
 * Otherwise, set it as featured and unset all others
 */
export const setFeaturedNews = (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body; // Get desired featured status from request body
    
    // Get all news
    const allNews = getCollection('news');
    
    // Check if this news is currently featured
    const targetNews = allNews.find(news => news.id === parseInt(id));
    if (!targetNews) {
      return res.status(404).json(errorResponse('News not found'));
    }
    
    // If featured status is explicitly provided in request body, use that
    // Otherwise, toggle current status
    const shouldBeFeatured = featured !== undefined ? featured : !targetNews.featured;
    
    // Update all news: 
    // - If shouldBeFeatured is true, only target news is featured
    // - If shouldBeFeatured is false, unset featured from target news (and all others)
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
    console.error('❌ Get featured news error:', error);
    res.status(500).json(errorResponse('Failed to fetch featured news', error));
  }
};

/**
 * Increment news views
 */
export const incrementViews = (req, res) => {
  try {
    const { id } = req.params;
    const news = findOne('news', { id: parseInt(id) });
    
    if (!news) {
      return res.status(404).json(errorResponse('News not found'));
    }
    
    const updated = updateDocument('news', parseInt(id), {
      views: (news.views || 0) + 1
    });
    
    res.json(successResponse({ views: updated.views }));
  } catch (error) {
    console.error('❌ Increment views error:', error);
    res.status(500).json(errorResponse('Failed to update views', error));
  }
};
