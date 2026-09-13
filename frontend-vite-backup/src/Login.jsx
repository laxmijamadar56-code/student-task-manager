import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        alert("Invalid email or password");
        return;
      }

      const student = await response.json();

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("student", JSON.stringify(student));

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to Spring Boot backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          🎓
        </div>

        <h1>Student Task Manager</h1>
        <p className="login-subtitle">
          Manage your academic tasks easily
        </p>

        <div className="login-heading">
          <h2>Student Login</h2>
          <p>Login to continue to your dashboard</p>
        </div>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="register-link">
          <span>Don't have an account?</span>
          <button onClick={() => navigate("/register")}>
            Create Account
          </button>
        </div>

        <div className="admin-link">
          <button onClick={() => navigate("/admin-login")}>
            Admin Login
          </button>
        </div>

        <p className="login-footer">
          Student Task Manager • Mini Project
        </p>

      </div>
    </div>
  );
}

export default Login;
