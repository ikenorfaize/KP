// ===================================
// DATABASE CONFIGURATION
// ===================================

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path (can be overridden by env var DB_PATH)
export const DB_PATH = process.env.DB_PATH || join(__dirname, '..', 'db.json');

// MongoDB disabled - using LOCAL JSON only
export const USE_MONGODB = false;

// Environment-aware CORS origins - NEVER hardcode localhost
const getCorsOrigins = () => {
  const origins = [];
  
  // Add env-specified origins (comma-separated)
  if (process.env.ALLOWED_ORIGINS) {
    origins.push(...process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()));
  }
  
  // Add frontend URL if specified
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  // In development only, allow localhost
  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:5173', 'http://localhost:3000');
  }
  
  // Always allow production domains
  origins.push('https://pergunu.fairuzfd.site', 'https://kp-mocha.vercel.app');
  
  // Remove duplicates
  return [...new Set(origins.filter(Boolean))];
};

export const config = {
  dbPath: DB_PATH,
  useMongoDB: USE_MONGODB,
  port: process.env.PORT || 3001,
  fileServerPort: process.env.FILE_PORT || 3002,
  corsOrigins: getCorsOrigins(),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};
