import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "admin123") {
      navigate("/admin-dashboard");
    } else {
      alert("Invalid Admin Email or Password");
    }
  };

  return (
    <div>
      <h2>👨‍💼 Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">🔐 Admin Login</button>
      </form>

      <br />

      <button onClick={() => navigate("/")}>
        ← Back to Student Login
      </button>
    </div>
  );
}

export default AdminLogin;
