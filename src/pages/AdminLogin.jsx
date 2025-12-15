import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/home_background.jpg";

import "../styles/pages/admin-login.css"; // ← NEW

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // SECURITY FEATURE: 
  // When this page loads (even via Back button), WIPE the token immediately.
  // This ensures that "Forward" navigation will fail because the session is dead.
  useEffect(() => {
    localStorage.removeItem("admin_token");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === "stamatics" && password === "stamatics2025") {
      // Create the session
      localStorage.setItem("admin_token", "valid-token");
      
      // Standard navigation (Pushes to history, so Back button works)
      navigate("/admin/dashboard");
    } else {
      setError("Invalid Username or Password");
    }
  };

  return (
    <div
      className="admin-login-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="admin-login-overlay" />
      
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin Portal</h1>
        
        <p className="admin-login-subtitle">Authorized Personnel Only</p>
        
        <form onSubmit={handleLogin} className="admin-login-form">
          
          <div className="admin-login-input-group">
            <input
              type="text"
              className="admin-login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="off"
            />
          </div>

          <div className="admin-login-input-group">
            <div className="admin-login-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="admin-login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="admin-login-eye-button"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" className="admin-login-button">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
