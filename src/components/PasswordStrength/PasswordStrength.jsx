import { useState, useEffect } from 'react';
import PasswordUtils from '../../utils/passwordUtils';
import './PasswordStrength.css';

const PasswordStrength = ({ password, onStrengthChange }) => {
  const [strength, setStrength] = useState(null);

  useEffect(() => {
    if (password) {
      const strengthResult = PasswordUtils.validatePasswordStrength(password);
      setStrength(strengthResult);
      if (onStrengthChange) {
        onStrengthChange(strengthResult);
      }
    } else {
      setStrength(null);
      if (onStrengthChange) {
        onStrengthChange(null);
      }
    }
  }, [password, onStrengthChange]);

  if (!strength || !password) return null;

  const getStrengthColor = (level) => {
    switch (level) {
      case 'Very Weak': return '#dc3545';
      case 'Weak': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Strong': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div 
          className="strength-fill"
          style={{
            width: `${(strength.score / 5) * 100}%`,
            backgroundColor: getStrengthColor(strength.level)
          }}
        />
      </div>
      
      <div className="strength-info">
        <span 
          className="strength-level"
          style={{ color: getStrengthColor(strength.level) }}
        >
          {strength.level}
        </span>
        
        <div className="strength-requirements">
          {!strength.length && (
            <span className="requirement invalid">
              ❌ Minimal 6 karakter
            </span>
          )}
          {!strength.hasLowerCase && (
            <span className="requirement invalid">
              ❌ Huruf kecil (a-z)
            </span>
          )}
          {!strength.hasUpperCase && (
            <span className="requirement invalid">
              ❌ Huruf besar (A-Z)
            </span>
          )}
          {!strength.hasNumbers && (
            <span className="requirement invalid">
              ❌ Angka (0-9)
            </span>
          )}
          {!strength.hasSpecialChar && (
            <span className="requirement invalid">
              ❌ Karakter khusus (!@#$%)
            </span>
          )}
          
          {strength.isValid && strength.level === 'Strong' && (
            <span className="requirement valid">
              ✅ Password sangat aman!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;
