import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          🎓
        </div>

        {/* Title */}
        <h1 className="login-title">
          Student Task Manager
        </h1>

        <p className="login-subtitle">
          🔐 Login to manage your tasks
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          <div className="login-form-group">
            <label>📧 Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-form-group">
            <label>🔑 Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            🔐 Login
          </button>

        </form>

        {/* Register */}
        <div className="register-section">
          <p>Don't have an account?</p>

          <Link to="/register">
            📝 Create Account
          </Link>
        </div>

        {/* Admin */}
        <div className="admin-section">
          <Link to="/admin-login">
            👨‍💼 Admin Login
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;
