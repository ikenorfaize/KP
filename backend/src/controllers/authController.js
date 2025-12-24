// ===================================
// AUTHENTICATION CONTROLLER
// ===================================

import bcrypt from 'bcryptjs';
import { findOne, getCollection, saveCollection, addDocument } from '../utils/database.js';
import { isValidEmail, successResponse, errorResponse } from '../utils/helpers.js';

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json(errorResponse('Username and password are required'));
    }

    // Find user
    const user = findOne('users', { username });

    if (!user) {
      return res.status(401).json(errorResponse('Invalid username or password'));
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json(errorResponse('Invalid username or password'));
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log(`✅ Login successful: ${username}`);

    // Return user data directly in data field (not nested in user object)
    res.json(successResponse(userWithoutPassword));
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json(errorResponse('Login failed', error));
  }
};

/**
 * Register new user
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json(errorResponse('Username, email, and password are required'));
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(errorResponse('Invalid email format'));
    }

    if (password.length < 6) {
      return res.status(400).json(errorResponse('Password must be at least 6 characters'));
    }

    // Check if user exists
    const existingUser = findOne('users', { username });
    if (existingUser) {
      return res.status(400).json(errorResponse('Username already exists'));
    }

    const existingEmail = findOne('users', { email });
    if (existingEmail) {
      return res.status(400).json(errorResponse('Email already registered'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = addDocument('users', {
      username,
      email,
      password: hashedPassword,
      fullName: fullName || username,
      role: 'user',
      status: 'pending'
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    console.log(`✅ User registered: ${username}`);

    res.status(201).json(successResponse({
      user: userWithoutPassword,
      message: 'Registration successful'
    }));
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json(errorResponse('Registration failed', error));
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json(errorResponse('All fields are required'));
    }

    if (newPassword.length < 6) {
      return res.status(400).json(errorResponse('New password must be at least 6 characters'));
    }

    // Find user
    const user = findOne('users', { id: parseInt(userId) });

    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json(errorResponse('Current password is incorrect'));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const updatedUser = updateDocument('users', user.id, {
      password: hashedPassword
    });

    console.log(`✅ Password changed for user: ${user.username}`);

    res.json(successResponse({
      message: 'Password changed successfully'
    }));
  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json(errorResponse('Failed to change password', error));
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json(errorResponse('Not authenticated'));
    }

    const { password: _, ...userWithoutPassword } = req.user;

    res.json(successResponse({
      user: userWithoutPassword
    }));
  } catch (error) {
    console.error('❌ Get current user error:', error);
    res.status(500).json(errorResponse('Failed to get user', error));
  }
};
