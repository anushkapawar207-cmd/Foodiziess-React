
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSignup(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully! Please log in 💜");
    navigate("/login");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-visual">
          <h2>Join the Foodiziess Family! 💜</h2>
          <p>
            Discover recipes, explore new flavours and
            find inspiration for every craving.
            Your delicious journey starts here!
          </p>
        </div>

        <div className="auth-form-panel">
          <h1>Create Account</h1>
          <p className="auth-subtitle">
            Sign up and start exploring delicious recipes.
          </p>

          <form className="auth-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
            />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit">Create My Account →</button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Signup;
