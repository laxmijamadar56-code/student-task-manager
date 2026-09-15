import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    setLoggingIn(true);

    if (
      email === "admin@studenttaskmanager.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin");
    } else {
      setLoggingIn(false);
      alert("Invalid Admin Email or Password");
    }
  };

  return (
    <div className="admin-login-page">

      {/* LEFT BRAND PANEL */}
      <div className="admin-brand-panel">

        <div className="admin-brand-content">

          <div className="admin-brand-icon">
            ✓
          </div>

          <p className="admin-brand-label">
            STUDENT TASK MANAGER
          </p>

          <h1>
            Manage your
            <br />
            student workspace.
          </h1>

          <p className="admin-brand-description">
            A centralized administration portal for managing
            students, academic tasks and task progress.
          </p>

          <div className="admin-feature-list">

            <div className="admin-feature">
              <span>✓</span>
              <div>
                <strong>Student Management</strong>
                <p>View and manage registered students.</p>
              </div>
            </div>

            <div className="admin-feature">
              <span>✓</span>
              <div>
                <strong>Task Management</strong>
                <p>Monitor and organize academic tasks.</p>
              </div>
            </div>

            <div className="admin-feature">
              <span>✓</span>
              <div>
                <strong>Progress Overview</strong>
                <p>Track pending and completed work.</p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="admin-login-panel">

        <div className="admin-login-card">

          <div className="admin-mobile-logo">
            ✓
          </div>

          <div className="admin-login-heading">

            <p className="admin-page-label">
              ADMINISTRATION
            </p>

            <h2>Welcome back</h2>

            <p>
              Sign in to access the administration dashboard.
            </p>

          </div>

          <div className="admin-welcome">

            <div className="admin-welcome-icon">
              🔐
            </div>

            <div>
              <strong>Administrator Login</strong>
              <p>
                Manage students and academic tasks
              </p>
            </div>

          </div>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="admin-form-group">

              <label htmlFor="adminEmail">
                Admin Email
              </label>

              <div className="admin-input-box">

                <span>✉</span>

                <input
                  id="adminEmail"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="admin-form-group">

              <label htmlFor="adminPassword">
                Admin Password
              </label>

              <div className="admin-input-box">

                <span>🔒</span>

                <input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>

            {/* LOGIN */}
            <button
              type="submit"
              className="admin-login-btn"
              disabled={loggingIn}
            >
              {loggingIn
                ? "Signing in..."
                : "LOGIN AS ADMIN →"}
            </button>

          </form>

          <button
            className="back-login"
            onClick={() => navigate("/")}
            type="button"
          >
            ← Back to Student Login
          </button>

          <div className="admin-security-note">
            <span>🔒</span>
            <p>
              Authorized administrator access only.
            </p>
          </div>

          <p className="admin-footer">
            Student Task Manager
            <span>•</span>
            Admin Access
          </p>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;
