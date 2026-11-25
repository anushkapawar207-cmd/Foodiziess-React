
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleAdminLogin(event) {
    event.preventDefault();
    setError("");

    if (
      email.trim().toLowerCase() === "admin@foodiziess.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin email or password.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card admin-auth-card">

        <div className="auth-visual admin-visual">
          <div className="admin-icon">♛</div>
          <h2>Welcome, Admin!</h2>
          <p>
            Manage your recipes, monitor users and keep
            the Foodiziess experience delicious.
          </p>
          <span className="admin-tag">FOODIZIESS ADMIN PORTAL</span>
        </div>

        <div className="auth-form-panel">
          <h1>Admin Login</h1>
          <p className="auth-subtitle">
            Sign in to access your administration dashboard.
          </p>

          <form className="auth-form" onSubmit={handleAdminLogin}>
            <input
              type="email"
              placeholder="Admin Email Address"
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

            <button type="submit">
              Access Dashboard →
            </button>
          </form>

          <p className="auth-switch">
            Restricted access · Authorized admins only
          </p>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;
