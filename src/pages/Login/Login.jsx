import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { apiService } from '../../services/apiService';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value.trim() // Automatically trim whitespace
    }));
    setApiMessage(''); // Clear message when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiMessage('');
    
    console.log('🔐 Starting login process...');
    
    try {
      const result = await apiService.login({
        username: loginData.username,
        password: loginData.password
      });
      
      console.log('✅ Login successful:', result.user);
      
      // Check if user is admin
      if (result.user.role === 'admin') {
        console.log('🔑 Admin login detected, redirecting to admin dashboard...');
        
        // Store admin session
        localStorage.setItem('adminAuth', JSON.stringify({
          username: result.user.username,
          role: 'admin',
          fullName: result.user.fullName,
          userId: result.user.id, // Add missing userId
          email: result.user.email,
          loginTime: new Date().toISOString()
        }));
        
        // Immediate redirect to admin dashboard
        navigate('/admin', { replace: true });
        
      } else {
        console.log('👤 User login detected, redirecting to user dashboard...');
        
        // Store user session
        localStorage.setItem('userAuth', JSON.stringify({
          username: result.user.username,
          role: result.user.role || 'user',
          fullName: result.user.fullName,
          email: result.user.email,
          userId: result.user.id,
          loginTime: new Date().toISOString()
        }));
        
        // Immediate redirect to user dashboard
        navigate('/user-dashboard', { replace: true });
      }
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      setApiMessage(`❌ Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* KIRI */}
      <div className="login-left">
        <div className="login-overlay">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2>Hey! Welcome</h2>
          <p>Join us and give information to people</p>
        </div>
      </div>

      {/* KANAN */}
      <div className="login-right">
        <div className="login-box">
          <h2>Log in</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="username"
              placeholder="Username or Email" 
              value={loginData.username}
              onChange={handleInputChange}
              required 
            />
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleInputChange}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={0}
                aria-label="Show or hide password"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="login-options">
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
            
            {/* API Status Message */}
            {apiMessage && (
              <div className={`api-message ${apiMessage.includes('✅') ? 'success' : 'error'}`}>
                {apiMessage}
              </div>
            )}

            <p className="login-divider">Or with</p>

            <div className="login-social">
              <button className="google">G+</button>
              <button className="facebook">f</button>
              <button className="twitter">t</button>
            </div>
          </form>

          <p className="create-account">
            <Link to="/register">Create a new Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
