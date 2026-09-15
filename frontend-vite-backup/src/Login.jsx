import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8080/students/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        alert("Invalid email or password.");
        return;
      }

      const student = await response.json();

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("student", JSON.stringify(student));

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to Spring Boot backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* =========================
            LEFT BRAND PANEL
        ========================== */}
        <div className="login-brand">

          <div className="login-brand-top">
            <div className="brand-logo">✓</div>

            <span className="brand-small-text">
              STUDENT PORTAL
            </span>
          </div>

          <div className="brand-content">
            <p className="brand-label">
              STUDENT TASK MANAGER
            </p>

            <h1>
              Stay organized.
              <span> Stay ahead.</span>
            </h1>

            <p className="brand-description">
              Manage your academic tasks, track your progress,
              and keep everything organized in one simple place.
            </p>

            <div className="login-features">

              <div className="login-feature">
                <div className="feature-icon">✓</div>

                <div>
                  <strong>Manage your tasks</strong>
                  <p>Create and organize academic tasks easily.</p>
                </div>
              </div>

              <div className="login-feature">
                <div className="feature-icon">✓</div>

                <div>
                  <strong>Track your progress</strong>
                  <p>See what is pending and what is completed.</p>
                </div>
              </div>

              <div className="login-feature">
                <div className="feature-icon">✓</div>

                <div>
                  <strong>Boost productivity</strong>
                  <p>Focus on important work and meet deadlines.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="brand-footer">
            <span>Student Task Manager</span>
            <span>•</span>
            <span>College Mini Project</span>
          </div>

        </div>

        {/* =========================
            RIGHT LOGIN PANEL
        ========================== */}
        <div className="login-form-section">

          <div className="login-form-wrapper">

            <div className="mobile-logo">
              ✓
            </div>

            <p className="form-label">
              STUDENT LOGIN
            </p>

            <h2>Welcome back!</h2>

            <p className="login-subtitle">
              Sign in to continue to your dashboard.
            </p>

            {/* Login Form */}

            <form onSubmit={handleLogin}>

              {/* Email */}

              <div className="input-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* Password */}

              <div className="input-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>

            </form>

            {/* Divider */}

            <div className="login-divider">
              <span>OR</span>
            </div>

            {/* Register */}

            <div className="register-section">

              <p>
                Don't have a student account?
              </p>

              <Link
                to="/register"
                className="create-account-button"
              >
                Create Student Account
                <span>→</span>
              </Link>

            </div>

            {/* Admin Login */}

            <div className="admin-section">

              <span>Are you an administrator?</span>

              <Link
                to="/admin-login"
                className="admin-link"
              >
                Admin Login
              </Link>

            </div>

            {/* Security Note */}

            <div className="login-note">
              <span className="note-icon">✓</span>

              <span>
                Sign in with your registered student account
                to access your tasks.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
