// ===== INPUT VALIDATION AND SANITIZATION UTILITIES =====
// Security utilities for input validation and XSS prevention

/**
 * Email validation using RFC compliant regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Username validation - alphanumeric, underscores, hyphens
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid username
 */
export const isValidUsername = (username) => {
  if (!username || username.length < 3 || username.length > 50) {
    return false;
  }
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username);
};

/**
 * Password strength validation
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Full name validation
 * @param {string} fullName - Full name to validate
 * @returns {boolean} - True if valid full name
 */
export const isValidFullName = (fullName) => {
  if (!fullName || fullName.trim().length < 2 || fullName.trim().length > 100) {
    return false;
  }
  // Allow letters, spaces, apostrophes, hyphens, and dots
  const nameRegex = /^[a-zA-Z\s'.-]+$/;
  return nameRegex.test(fullName.trim());
};

/**
 * Phone number validation (Indonesian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone number
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Indonesian phone numbers: 8-15 digits, can start with +62 or 0
  return /^(\+?62|0)[0-9]{8,13}$/.test(cleanPhone);
};

/**
 * Sanitize HTML input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeHtml = (input) => {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize user input by trimming and limiting length
 * @param {string} input - Input to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input, maxLength = 255) => {
  if (!input) return '';
  
  return String(input)
    .trim()
    .slice(0, maxLength);
};

/**
 * Validate and sanitize user registration data
 * @param {object} userData - User data to validate
 * @returns {object} - Validation result
 */
export const validateUserRegistration = (userData) => {
  const errors = [];
  const sanitizedData = {};
  
  // Validate and sanitize full name
  const fullName = sanitizeInput(userData.fullName, 100);
  if (!isValidFullName(fullName)) {
    errors.push('Full name must be 2-100 characters and contain only letters, spaces, and basic punctuation');
  }
  sanitizedData.fullName = fullName;
  
  // Validate and sanitize email
  const email = sanitizeInput(userData.email, 254).toLowerCase();
  if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address');
  }
  sanitizedData.email = email;
  
  // Validate and sanitize username
  const username = sanitizeInput(userData.username, 50).toLowerCase();
  if (!isValidUsername(username)) {
    errors.push('Username must be 3-50 characters and contain only letters, numbers, underscores, and hyphens');
  }
  sanitizedData.username = username;
  
  // Validate password
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }
  sanitizedData.password = userData.password; // Don't sanitize password
  
  // Validate phone if provided
  if (userData.phone) {
    const phone = sanitizeInput(userData.phone, 20);
    if (!isValidPhone(phone)) {
      errors.push('Please enter a valid phone number');
    }
    sanitizedData.phone = phone;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
};

/**
 * Validate and sanitize login credentials
 * @param {object} credentials - Login credentials
 * @returns {object} - Validation result
 */
export const validateLoginCredentials = (credentials) => {
  const errors = [];
  const sanitizedData = {};
  
  // Validate username/email
  const usernameOrEmail = sanitizeInput(credentials.username, 254).toLowerCase();
  if (!usernameOrEmail) {
    errors.push('Username or email is required');
  } else if (!isValidEmail(usernameOrEmail) && !isValidUsername(usernameOrEmail)) {
    errors.push('Please enter a valid username or email address');
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

/**
 * Generate a secure random string
 * @param {number} length - Length of the random string
 * @returns {string} - Random string
 */
export const generateSecureToken = (length = 32) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Use crypto.getRandomValues if available
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    // Fallback to Math.random (less secure)
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  return result;
};

/**
 * Check if a string contains potentially malicious patterns
 * @param {string} input - Input to check
 * @returns {boolean} - True if suspicious patterns found
 */
export const containsSuspiciousPatterns = (input) => {
  if (!input) return false;
  
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /vbscript:/i,
    /data:.*base64/i,
    /eval\s*\(/i,
    /expression\s*\(/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  } = options;
  
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  // Check file extension
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    errors.push(`File extension ${extension} is not allowed`);
  }
  
  // Check for suspicious file names
  if (containsSuspiciousPatterns(file.name)) {
    errors.push('File name contains suspicious patterns');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  isValidEmail,
  isValidUsername,
  validatePassword,
  isValidFullName,
  isValidPhone,
  sanitizeHtml,
  sanitizeInput,
  validateUserRegistration,
  validateLoginCredentials,
  checkRateLimit,
  resetRateLimit,
  generateSecureToken,
  containsSuspiciousPatterns,
  validateFileUpload
};
