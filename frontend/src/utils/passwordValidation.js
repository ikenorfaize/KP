// ===================================
// PASSWORD VALIDATION UTILITIES
// ===================================
// Utilities for validating password uniqueness across the system
// Works both locally and on Azure VM (environment-aware)

import { apiService } from '../services/apiService';

/**
 * Check if password already exists in the system
 * Validates against ALL users' passwords via backend API
 * 
 * @param {string} candidatePassword - Password to check for duplicates
 * @returns {Promise<{isDuplicate: boolean, existingUser?: string}>}
 */
export async function checkPasswordDuplicate(candidatePassword) {
  if (!candidatePassword || !candidatePassword.trim()) {
    return { isDuplicate: false };
  }

  try {
    // Initialize API service
    await apiService.init();

    // Call backend API to check password uniqueness
    const response = await fetch(`${apiService.API_URL}/auth/check-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: candidatePassword.trim() })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        isDuplicate: data.exists || false,
        existingUser: data.username || null
      };
    }

    // If API call fails, return false (allow the operation)
    console.warn('Password check API failed, allowing operation');
    return { isDuplicate: false };

  } catch (error) {
    console.error('Error checking password duplicate:', error);
    // On error, allow the operation (fail open for better UX)
    return { isDuplicate: false };
  }
}

/**
 * Validate password meets uniqueness requirements before user creation
 * Use this in ApplicationManager before calling approveAndRegister
 * 
 * @param {string} password - Password to validate
 * @returns {Promise<{isValid: boolean, error?: string}>}
 */
export async function validatePasswordUniqueness(password) {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters'
    };
  }

  const { isDuplicate, existingUser } = await checkPasswordDuplicate(password);

  if (isDuplicate) {
    return {
      isValid: false,
      error: existingUser 
        ? `Password already used by user: ${existingUser}. Please choose a different password.`
        : 'This password is already in use. Please choose a different password.'
    };
  }

  return { isValid: true };
}

/**
 * Generate a unique random password that doesn't exist in system
 * Retries up to maxAttempts times if generated password already exists
 * 
 * @param {number} maxAttempts - Maximum retry attempts (default: 5)
 * @returns {Promise<string>} - Unique password
 */
export async function generateUniquePassword(maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate random password: Pg + 6 random chars + 2 digits
    const randomPart = Math.random().toString(36).slice(2, 8);
    const digits = Math.floor(Math.random() * 90 + 10);
    const password = `Pg${randomPart}${digits}`;

    // Check if unique
    const { isDuplicate } = await checkPasswordDuplicate(password);
    if (!isDuplicate) {
      return password;
    }

    console.log(`Generated password already exists, retrying... (${attempt + 1}/${maxAttempts})`);
  }

  // Fallback: add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36).slice(-4);
  const randomPart = Math.random().toString(36).slice(2, 6);
  return `Pg${randomPart}${timestamp}`;
}

export default {
  validatePasswordUniqueness,
  generateUniquePassword
};
