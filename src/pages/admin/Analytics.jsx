
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../../data/recipes";

function Analytics() {
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setRecipes(getRecipes());
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
    setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);
  }, []);

  // Count recipes by cuisine
  const cuisineData = recipes.reduce((result, recipe) => {
    result[recipe.cuisine] = (result[recipe.cuisine] || 0) + 1;
    return result;
  }, {});

  // Count recipes by meal
  const mealData = recipes.reduce((result, recipe) => {
    result[recipe.meal] = (result[recipe.meal] || 0) + 1;
    return result;
  }, {});

  const popularRecipes = recipes.filter(
    (recipe) => recipe.popular
  );

  const maxCuisine = Math.max(
    1,
    ...Object.values(cuisineData)
  );

  const maxMeal = Math.max(
    1,
    ...Object.values(mealData)
  );

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Foodiziess 💜</h2>
        <p className="sidebar-label">ADMIN PANEL</p>

        <nav>
          <Link to="/admin/dashboard">◈ Overview</Link>
          <Link to="/admin/recipes">◈ Manage Recipes</Link>
          <Link to="/admin/users">◈ Manage Users</Link>
          <Link to="/admin/analytics" className="active">
            ◈ Analytics
          </Link>
        </nav>
      </aside>

      {/* Analytics Content */}
      <main className="admin-main">

        <div className="admin-heading">
          <div>
            <h1>Website Analytics</h1>
            <p>Understand your Foodiziess website performance.</p>
          </div>
          <span className="admin-welcome">Analytics Overview</span>
        </div>

        {/* Statistics */}
        <div className="dashboard-cards">

          <div className="dashboard-stat">
            <span>👥</span>
            <p>Registered Users</p>
            <h2>{users.length}</h2>
          </div>

          <div className="dashboard-stat">
            <span>🍽️</span>
            <p>Total Recipes</p>
            <h2>{recipes.length}</h2>
          </div>

          <div className="dashboard-stat">
            <span>⭐</span>
            <p>Popular Recipes</p>
            <h2>{popularRecipes.length}</h2>
          </div>

          <div className="dashboard-stat">
            <span>💜</span>
            <p>Total Favorites</p>
            <h2>{favorites.length}</h2>
          </div>

        </div>

        {/* Website Traffic */}
        <section className="analytics-panel">
          <h2>Website Traffic</h2>
          <p className="analytics-description">
            Visitor tracking has not been connected yet.
          </p>

          <div className="traffic-empty">
            <span>📊</span>
            <h3>Traffic data coming soon!</h3>
            <p>
              Once visitor tracking is enabled, daily and weekly
              website traffic will appear here.
            </p>
          </div>
        </section>

        {/* Cuisine Analytics */}
        <div className="analytics-grid">

          <section className="analytics-panel">
            <h2>Recipes by Cuisine</h2>

            {Object.entries(cuisineData).length === 0 ? (
              <p>No recipe data available.</p>
            ) : (
              Object.entries(cuisineData).map(([name, count]) => (
                <div className="analytics-bar-item" key={name}>
                  <div className="analytics-bar-label">
                    <span>{name}</span>
                    <strong>{count}</strong>
                  </div>

                  <div className="analytics-bar-bg">
                    <div
                      className="analytics-bar-fill"
                      style={{
                        width: `${(count / maxCuisine) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Meal Analytics */}
          <section className="analytics-panel">
            <h2>Recipes by Meal</h2>

            {Object.entries(mealData).length === 0 ? (
              <p>No recipe data available.</p>
            ) : (
              Object.entries(mealData).map(([name, count]) => (
                <div className="analytics-bar-item" key={name}>
                  <div className="analytics-bar-label">
                    <span>{name}</span>
                    <strong>{count}</strong>
                  </div>

                  <div className="analytics-bar-bg">
                    <div
                      className="analytics-bar-fill"
                      style={{
                        width: `${(count / maxMeal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </section>

        </div>

        {/* Popular Recipes */}
        <section className="analytics-panel popular-analytics">
          <h2>Popular Recipes</h2>

          {popularRecipes.length === 0 ? (
            <p>No popular recipes selected.</p>
          ) : (
            popularRecipes.map((recipe) => (
              <div className="popular-analytics-item" key={recipe.id}>
                <span>⭐</span>
                <strong>{recipe.name}</strong>
                <span>{recipe.cuisine}</span>
              </div>
            ))
          )}
        </section>

      </main>
    </div>
  );
}

export default Analytics;
