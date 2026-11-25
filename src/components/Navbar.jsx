
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("foodiziessTheme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem(
      "foodiziessTheme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/");
    window.location.reload();
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Foodiziess 💜
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/favorites">Favorites</Link>

        {currentUser && (
          <Link to="/food-space">My Food Space</Link>
        )}

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Night"}
        </button>

        {currentUser ? (
          <>
            <span>Hi, {currentUser.name}!</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
