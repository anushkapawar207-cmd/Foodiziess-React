
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event) {
    event.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const loggedInUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!loggedInUser) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(loggedInUser));

    alert("Login successful! Welcome back 💜");
    navigate("/");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-visual">
          <h2>Good Food.<br />Good Mood. 💜</h2>
          <p>
            Your next favourite recipe is waiting for you.
            Sign in and discover something delicious today!
          </p>
        </div>

        <div className="auth-form-panel">
          <h1>Welcome Back!</h1>
          <p className="auth-subtitle">
            Login to continue your delicious journey.
          </p>

          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit">Login to Foodiziess →</button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
