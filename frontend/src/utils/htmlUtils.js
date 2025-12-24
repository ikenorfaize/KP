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
