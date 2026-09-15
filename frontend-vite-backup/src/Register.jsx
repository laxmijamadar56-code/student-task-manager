import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8080/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("Registration successful!");
        navigate("/");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      alert("Cannot connect to Spring Boot backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* Left Brand Section */}
        <div className="register-brand">

          <div className="brand-logo">✓</div>

          <p className="brand-label">STUDENT TASK MANAGER</p>

          <h1>
            Start managing
            <span> your tasks.</span>
          </h1>

          <p className="brand-description">
            Create your student account and stay organized with
            an easier way to manage your academic tasks.
          </p>

          <div className="brand-features">

            <div className="brand-feature">
              <div className="feature-icon">✓</div>
              <div>
                <strong>Organize your work</strong>
                <p>Keep all your academic tasks in one place.</p>
              </div>
            </div>

            <div className="brand-feature">
              <div className="feature-icon">✓</div>
              <div>
                <strong>Track your progress</strong>
                <p>Monitor pending and completed tasks easily.</p>
              </div>
            </div>

            <div className="brand-feature">
              <div className="feature-icon">✓</div>
              <div>
                <strong>Stay productive</strong>
                <p>Focus on what needs to be completed next.</p>
              </div>
            </div>

          </div>

        </div>

        {/* Registration Section */}
        <div className="register-form-section">

          <div className="register-form-wrapper">

            <div className="mobile-brand-icon">✓</div>

            <p className="form-label">CREATE ACCOUNT</p>

            <h2>Welcome!</h2>

            <p className="form-description">
              Create your account to get started.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="register-form-group">
                <label htmlFor="name">Full Name</label>

                <div className="input-wrapper">
                  <span className="input-icon">👤</span>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="register-form-group">
                <label htmlFor="email">Email Address</label>

                <div className="input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="register-form-group">
                <label htmlFor="password">Password</label>

                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>

            </form>

            <div className="register-login">
              <span>Already have an account?</span>
              <Link to="/">Login</Link>
            </div>

            <div className="register-note">
              Your account will be ready to use after registration.
            </div>

            <div className="project-label">
              Student Task Manager • Mini Project
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;
