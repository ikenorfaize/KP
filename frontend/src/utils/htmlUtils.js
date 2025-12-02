// htmlUtils.js - Utility functions for handling HTML content safely

/**
 * Strip all HTML tags from a string and return clean text
 * @param {string} html - HTML string to clean
 * @returns {string} - Clean text without HTML tags
 */
export const stripHtmlTags = (html) => {
  if (!html) return '';
  
  // Create a temporary div element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Get text content (automatically strips all HTML tags)
  let text = temp.textContent || temp.innerText || '';
  
  // Clean up extra whitespace and newlines
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
};

/**
 * Get a clean text excerpt from HTML content
 * @param {string} html - HTML string to extract from
 * @param {number} maxLength - Maximum length of excerpt (default: 150)
 * @returns {string} - Clean excerpt with ellipsis if truncated
 */
export const getExcerpt = (html, maxLength = 150) => {
  const cleanText = stripHtmlTags(html);
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Cut at maxLength and find the last complete word
  const excerpt = cleanText.substring(0, maxLength);
  const lastSpace = excerpt.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? excerpt.substring(0, lastSpace) + '...'
    : excerpt + '...';
};

/**
 * Convert HTML to plain text with preserved line breaks
 * @param {string} html - HTML string to convert
 * @returns {string} - Plain text with line breaks
 */
export const htmlToText = (html) => {
  if (!html) return '';
  
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Convert <br> and </p> tags to newlines before stripping
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n');
  
  // Create temp div with processed text
  temp.innerHTML = text;
  text = temp.textContent || temp.innerText || '';
  
  // Clean up multiple newlines and spaces
  text = text
    .replace(/\n\s*\n\s*\n/g, '\n\n') // max 2 consecutive newlines
    .replace(/[ \t]+/g, ' ') // normalize spaces
    .trim();
  
  return text;
};

/**
 * Sanitize HTML to prevent XSS attacks (basic version)
 * For production, consider using DOMPurify library
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';
  
  const temp = document.createElement('div');
  temp.textContent = html; // This escapes all HTML
  
  return temp.innerHTML;
};

/**
 * Check if string contains HTML tags
 * @param {string} str - String to check
 * @returns {boolean} - True if contains HTML tags
 */
export const hasHtmlTags = (str) => {
  if (!str) return false;
  return /<\/?[a-z][\s\S]*>/i.test(str);
};

/**
 * Get word count from HTML content
 * @param {string} html - HTML string
 * @returns {number} - Word count
 */
export const getWordCount = (html) => {
  const text = stripHtmlTags(html);
  if (!text) return 0;
  
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Get reading time estimate in minutes
 * @param {string} html - HTML string
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number} - Estimated reading time in minutes
 */
export const getReadingTime = (html, wordsPerMinute = 200) => {
  const wordCount = getWordCount(html);
  return Math.ceil(wordCount / wordsPerMinute);
};
