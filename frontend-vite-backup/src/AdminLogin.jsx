import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === "admin@studenttaskmanager.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin");
    } else {
      alert("Invalid Admin Email or Password");
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-logo">
          🎓
        </div>

        <h1>Admin Portal</h1>

        <p className="admin-subtitle">
          Student Task Manager
        </p>

        <div className="admin-welcome">
          <span>🔐</span>
          <div>
            <strong>Administrator Login</strong>
            <p>Sign in to manage students and tasks</p>
          </div>
        </div>

        <form onSubmit={handleLogin}>

          <label>Admin Email</label>

          <div className="input-box">
            <span>📧</span>
            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Admin Password</label>

          <div className="input-box">
            <span>🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" className="admin-login-btn">
            LOGIN AS ADMIN
          </button>

        </form>

        <button
          className="back-login"
          onClick={() => navigate("/")}
        >
          ← Back to Student Login
        </button>

        <p className="admin-footer">
          Student Task Manager • Admin Access
        </p>

      </div>

    </div>
  );
}

export default AdminLogin;
