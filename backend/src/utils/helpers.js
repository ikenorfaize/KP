// ===================================
// HELPER UTILITIES
// ===================================

/**
 * Generate unique ID based on timestamp
 */
export const generateId = () => {
  return Date.now();
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize HTML content (basic)
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';
  // Basic sanitization - remove script tags
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

/**
 * Format response
 */
export const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

export const errorResponse = (message, error = null) => {
  return {
    success: false,
    message,
    error: error ? error.message : null
  };
};

/**
 * Paginate array
 */
export const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(array.length / limit),
      totalItems: array.length,
      itemsPerPage: limit
    }
  };
};
