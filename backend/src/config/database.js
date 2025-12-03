// ===================================
// DATABASE CONFIGURATION
// ===================================

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path
export const DB_PATH = join(__dirname, '..', 'db.json');

// MongoDB disabled - using LOCAL JSON only
export const USE_MONGODB = false;

export const config = {
  dbPath: DB_PATH,
  useMongoDB: USE_MONGODB,
  port: process.env.PORT || 3001,
  fileServerPort: 3002,
  corsOrigins: [
    'http://localhost:5173',
    'https://pergunu.fairuzfd.dev',
    'https://kp-mocha.vercel.app'
  ]
};
