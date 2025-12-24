#!/usr/bin/env node

// ===================================
// DATABASE CLEANUP SCRIPT
// ===================================
// Jalankan: node cleanup-db.js
// Atau dari npm: npm run cleanup:db

import cleanDatabase from './src/utils/cleanDatabase.js';

console.log('🚀 PERGUNU Database Cleanup Tool');
console.log('═'.repeat(50));
console.log('');

const result = cleanDatabase();

if (result.success) {
  console.log('\n✅ Pembersihan database berhasil!');
  process.exit(0);
} else {
  console.error('\n❌ Pembersihan database gagal!');
  console.error('Error:', result.error);
  process.exit(1);
}
