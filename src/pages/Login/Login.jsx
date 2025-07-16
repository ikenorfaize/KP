import React, { useState } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

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
          <form>
            <input type="text" placeholder="Username" required />
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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

            <button type="submit" className="login-button">
              Log in
            </button>

            <p className="login-divider">Or with</p>

            <div className="login-social">
              <button className="google">G+</button>
              <button className="facebook">f</button>
              <button className="twitter">t</button>
            </div>
          </form>

          <p className="create-account">Create a new Account</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
