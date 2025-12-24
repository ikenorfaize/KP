// ===== INPUT VALIDATION AND SANITIZATION UTILITIES =====
// Security utilities for input validation and XSS prevention

/**
 * Validate and sanitize login credentials
 * @param {object} credentials - Login credentials
 * @returns {object} - Validation result
 */
export const validateLoginCredentials = (credentials) => {
  const errors = [];
  const sanitizedData = {};
  
  // Validate username/email
  const usernameOrEmail = credentials.username ? String(credentials.username).trim().slice(0, 254).toLowerCase() : '';
  if (!usernameOrEmail) {
    errors.push('Username or email is required');
  }
  sanitizedData.username = usernameOrEmail;
  
  // Validate password
  if (!credentials.password || credentials.password.length < 1) {
    errors.push('Password is required');
  }
  sanitizedData.password = credentials.password; // Don't sanitize password
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
};

/**
 * Rate limiting helper - check if action is allowed
 * @param {string} key - Unique key for rate limiting (e.g., IP address)
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} - Rate limit result
 */
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 900000) => { // 15 minutes default
  const now = Date.now();
  const storageKey = `rateLimit_${key}`;
  
  try {
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : { attempts: 0, resetTime: now + windowMs };
    
    // Reset if window has passed
    if (now > data.resetTime) {
      data.attempts = 0;
      data.resetTime = now + windowMs;
    }
    
    // Check if limit exceeded
    if (data.attempts >= maxAttempts) {
      const timeUntilReset = Math.ceil((data.resetTime - now) / 60000); // minutes
      return {
        allowed: false,
        attemptsRemaining: 0,
        resetInMinutes: timeUntilReset
      };
    }
    
    // Increment attempts
    data.attempts++;
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    return {
      allowed: true,
      attemptsRemaining: maxAttempts - data.attempts,
      resetInMinutes: Math.ceil((data.resetTime - now) / 60000)
    };
    
  } catch (error) {
    console.error('Rate limiting error:', error);
    // If there's an error with rate limiting, allow the action
    return { allowed: true, attemptsRemaining: maxAttempts };
  }
};

/**
 * Reset rate limit for a key
 * @param {string} key - Rate limit key to reset
 */
export const resetRateLimit = (key) => {
  const storageKey = `rateLimit_${key}`;
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Error resetting rate limit:', error);
  }
};

export default {
  validateLoginCredentials,
  checkRateLimit,
  resetRateLimit
};
