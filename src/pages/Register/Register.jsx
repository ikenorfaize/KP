import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import './Register.css';
import logo from '../../assets/logo.png';
import { apiService } from '../../services/apiService';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    console.log('Input changed:', { name, value, type, checked }); // Debug log
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (value?.trim() || '') // Trim text inputs
    }));
    
    // Clear terms error when checkbox is checked
    if (name === 'agreeTerms' && checked) {
      console.log('Clearing terms error'); // Debug log
      setTermsError(false);
    }
    
    // Clear password error when user types in password fields
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted!'); // Debug log
    console.log('agreeTerms:', formData.agreeTerms); // Debug log
    console.log('password:', formData.password); // Debug log
    console.log('confirmPassword:', formData.confirmPassword); // Debug log
    
    let hasError = false;
    
    // Validate password matching
    if (formData.password !== formData.confirmPassword) {
      console.log('Passwords do not match - showing error'); // Debug log
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }
    
    // Validate terms and conditions
    if (!formData.agreeTerms) {
      console.log('Terms not agreed - showing error'); // Debug log
      setTermsError(true);
      hasError = true;
    } else {
      setTermsError(false);
    }
    
    // Stop submission if there are errors
    if (hasError) {
      return;
    }

    // API Registration Process
    setIsLoading(true);
    setApiMessage('');
    
    try {
      const result = await apiService.register({
        fullName: formData.fullName,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      
      console.log('Registration successful:', result);
      setApiMessage('✅ Registration successful! Redirecting to login...');
      
      // Reset form
      setFormData({
        fullName: '', email: '', username: '', 
        password: '', confirmPassword: '', agreeTerms: false
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration failed:', error);
      setApiMessage(`❌ Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* LEFT PANEL */}
      <div className="register-left">
        <div className="register-overlay">
          <img src={logo} alt="Logo" className="register-logo" />
          <h2>Welcome to Join Us!</h2>
          <p>
            Create your account and become part of our community to access exclusive features and stay updated with the latest information.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="register-right">
        <div className="register-box">
          <h2>Create Your Account</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />

            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className={passwordError ? 'error' : ''}
              />
              <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            
            {passwordError && (
              <div className="error-message">
                Passwords do not match. Please make sure both passwords are identical.
              </div>
            )}

            {/* Custom Checkbox */}
            <div className="register-options">
              <label className={`custom-checkbox-wrapper ${termsError ? 'error' : ''}`}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                />
                <span className="custom-checkbox-box">
                  {formData.agreeTerms && <span className="checkmark">✓</span>}
                </span>
                <span className="checkbox-text">
                  I agree to the <Link to="#">Terms & Conditions</Link> and <Link to="#">Privacy Policy</Link>
                </span>
              </label>
              
              {termsError && (
                <div className="error-message">
                  Please agree to the Terms & Conditions and Privacy Policy to continue.
                </div>
              )}
            </div>

            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            {/* API Status Message */}
            {apiMessage && (
              <div className={`api-message ${apiMessage.includes('✅') ? 'success' : 'error'}`}>
                {apiMessage}
              </div>
            )}
          </form>

          <div className="register-divider">or sign up with</div>

          <div className="register-social">
            <button className="google">
              <FaGoogle />
            </button>
            <button className="facebook">
              <FaFacebookF />
            </button>
            <button className="twitter">
              <FaTwitter />
            </button>
          </div>

          {/* Replaced the big green button with this clean link */}
          <div className="login-text-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
