// utils/formatCurrency.js - Helper function untuk format mata uang
// Digunakan untuk format nominal beasiswa agar tampil sebagai Rp 20.000.000

/**
 * Format angka menjadi format rupiah
 * @param {number|string} value - Nilai yang akan diformat
 * @returns {string} - Format rupiah (contoh: Rp 20.000.000)
 */
export const formatRupiah = (value) => {
  // Jika value kosong atau null, return default
  if (!value) return 'Rp 0';
  
  // Convert ke string dan hapus semua karakter non-digit
  const numberString = value.toString().replace(/[^\d]/g, '');
  
  // Jika setelah dibersihkan tidak ada angka, return default
  if (!numberString) return 'Rp 0';
  
  // Convert ke number
  const number = parseInt(numberString, 10);
  
  // Format dengan Intl.NumberFormat untuk Indonesia
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
  
  return formatted;
};

/**
 * Parse rupiah format string menjadi number
 * @param {string} rupiahString - String format rupiah
 * @returns {number} - Angka murni
 */
export const parseRupiah = (rupiahString) => {
  if (!rupiahString) return 0;
  const numberString = rupiahString.toString().replace(/[^\d]/g, '');
  return parseInt(numberString, 10) || 0;
};

/**
 * Format input nominal saat user mengetik
 * @param {string} value - Input value dari user
 * @returns {string} - Format rupiah tanpa "Rp" prefix untuk input field
 */
export const formatNominalInput = (value) => {
  // Hapus semua karakter non-digit
  const numberString = value.replace(/[^\d]/g, '');
  
  if (!numberString) return '';
  
  // Format dengan separator titik
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
