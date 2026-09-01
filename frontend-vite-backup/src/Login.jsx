import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8081/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const student = await response.json();

        localStorage.setItem("student", JSON.stringify(student));

        setMessage("✅ Login successful!");

        // Go to dashboard
        window.location.href = "/dashboard";
      } else {
        setMessage("❌ Login failed. Check email and password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Cannot connect to backend.");
    }
  };

  return (
    <div>
      <h2>🔐 Student Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">🔐 Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
