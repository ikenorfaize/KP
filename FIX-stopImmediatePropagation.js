// Fix untuk error stopImmediatePropagation - tambahkan di RegisterForm.jsx

// Ganti fungsi handleSubmit dengan versi yang aman:

const handleSubmit = async (e) => {
  console.log('🚀 === FORM SUBMIT INTERCEPTED ===');
  
  // Safe event prevention
  try {
    e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    
    // Only call stopImmediatePropagation if it exists
    if (typeof e.stopImmediatePropagation === 'function') {
      e.stopImmediatePropagation();
    }
    
    console.log('✅ Form events prevented safely');
  } catch (err) {
    console.warn('⚠️ Event prevention error (ignored):', err.message);
  }

  // Rest of your handleSubmit code...
  // (keep everything else the same)
};
