import { API_URL } from "./api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/students/login`,
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

      if (response.ok) {
        const student = await response.json();

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "student",
          JSON.stringify(student)
        );

        navigate("/dashboard");
      } else {
        setMessage("Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to Spring Boot backend");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-card">

          <h1>Student Task Manager</h1>

          <p className="login-tagline">
            Manage your tasks easily and efficiently
          </p>

          <h2>Welcome Back</h2>

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
            >
              LOGIN NOW
            </button>

          </form>

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

          <p className="signup-text">
            New user?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="link-button"
            >
              Sign Up Here
            </button>
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin-login")}
            className="admin-login-button"
          >
            Admin Login
          </button>

        </div>

      </div>
    </div>
  );
}

export default Login;
