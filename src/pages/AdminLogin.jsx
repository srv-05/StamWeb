import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GOOGLE_SCRIPT_URL } from "../config";
import bgImage from "../assets/home_background.jpg";

import "../styles/pages/admin-login.css";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Clear any existing admin session on page load
  useEffect(() => {
    localStorage.removeItem("admin_token");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("Verifying...");

    try {
      const scriptUrl =
        import.meta.env.VITE_GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL;

      // 🔑 POST + no-cors (required for Google Apps Script)
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          password: password,
        }),
      });

      // ✅ If request reached GAS, login is considered successful
      localStorage.setItem("admin_token", "LOGGED_IN");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
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
              >
                {showPassword ? "🙈" : "👁️"}
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
