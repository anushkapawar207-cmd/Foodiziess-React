
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    recipes: 0,
    users: 0,
    favorites: 0,
  });

  const [recentRecipes, setRecentRecipes] = useState([]);

  useEffect(() => {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    setStats({
      recipes: recipes.length,
      users: users.length,
      favorites: favorites.length,
    });

    setRecentRecipes(recipes.slice(-5).reverse());
  }, []);

  function handleLogout() {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  }

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Foodiziess 💜</h2>
        <p className="sidebar-label">ADMIN PANEL</p>

        <nav>
          <Link to="/admin/dashboard" className="active">
            ◈ Overview
          </Link>

          <Link to="/admin/recipes">
            ◈ Manage Recipes
          </Link>

          <Link to="/admin/users">
            ◈ Manage Users
          </Link>

          <Link to="/admin/analytics">
            ◈ Analytics
          </Link>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      {/* Main Dashboard */}
      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening at Foodiziess.</p>
          </div>
          <span className="admin-welcome">Administrator ♛</span>
        </div>

        {/* Statistics */}
        <div className="dashboard-cards">
          <div className="dashboard-stat">
            <span>🍽️</span>
            <p>Total Recipes</p>
            <h2>{stats.recipes}</h2>
          </div>

          <div className="dashboard-stat">
            <span>👥</span>
            <p>Total Users</p>
            <h2>{stats.users}</h2>
          </div>

          <div className="dashboard-stat">
            <span>💜</span>
            <p>Total Favorites</p>
            <h2>{stats.favorites}</h2>
          </div>
        </div>

        {/* Recent Recipes */}
        <section className="recent-section">
          <h2>Recently Added Recipes</h2>

          {recentRecipes.length === 0 ? (
            <p>No recipes found yet. Add your first recipe!</p>
          ) : (
            <div className="recent-list">
              {recentRecipes.map((recipe) => (
                <div className="recent-item" key={recipe.id}>
                  <span>🍴</span>
                  <div>
                    <h3>{recipe.name}</h3>
                    <p>{recipe.cuisine || "Recipe"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to="/admin/recipes" className="manage-link">
            Manage All Recipes →
          </Link>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
