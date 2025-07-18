import bcrypt from 'bcryptjs';

// Password utility untuk encryption dan verification
class PasswordUtils {
  
  // Hash password dengan salt
  static async hashPassword(plainPassword) {
    try {
      const saltRounds = 12; // Semakin tinggi, semakin secure tapi semakin lambat
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Password hashing failed');
    }
  }
  
  // Verify password dengan hash
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }
  
  // Generate strong password (optional utility)
  static generateStrongPassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
  
  // Validate password strength
  static validatePasswordStrength(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = {
      isValid: password.length >= minLength,
      length: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      score: 0
    };
    
    // Calculate strength score
    if (strength.length) strength.score++;
    if (strength.hasUpperCase) strength.score++;
    if (strength.hasLowerCase) strength.score++;
    if (strength.hasNumbers) strength.score++;
    if (strength.hasSpecialChar) strength.score++;
    
    // Strength levels
    if (strength.score >= 4) strength.level = 'Strong';
    else if (strength.score >= 3) strength.level = 'Medium';
    else if (strength.score >= 2) strength.level = 'Weak';
    else strength.level = 'Very Weak';
    
    return strength;
  }
}

export default PasswordUtils;
