
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRecipes } from "../data/recipes";

function Favorites() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const favoritesKey = currentUser
    ? `favorites_${currentUser.id}`
    : null;

  const [favoriteIds, setFavoriteIds] = useState(() => {
    if (!favoritesKey) return [];

    try {
      return JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    } catch {
      return [];
    }
  });

  const recipes = getRecipes();

  const favoriteRecipes = recipes.filter((recipe) =>
    favoriteIds.some(
      (id) => String(id) === String(recipe.id)
    )
  );

  function removeFavorite(recipeId) {
    const updatedFavorites = favoriteIds.filter(
      (id) => String(id) !== String(recipeId)
    );

    localStorage.setItem(
      favoritesKey,
      JSON.stringify(updatedFavorites)
    );

    setFavoriteIds(updatedFavorites);
  }

  if (!currentUser) {
    return (
      <main className="explore-content">
        <div className="explore-empty">
          <span>❤️</span>
          <h3>Login to see your favorites</h3>
          <p>
            Sign in to save and access your favourite recipes.
          </p>
          <button onClick={() => navigate("/login")}>
            Login Now
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="explore-page">
      <section className="explore-content">

        <div className="explore-heading">
          <div>
            <span className="explore-eyebrow">
              YOUR PERSONAL COLLECTION
            </span>
            <h2>My Favorite Recipes ❤️</h2>
            <p>
              All the delicious recipes you've saved in one place.
            </p>
          </div>

          <div className="explore-count">
            <strong>{favoriteRecipes.length}</strong>
            <span> saved recipes</span>
          </div>
        </div>

        {favoriteRecipes.length > 0 ? (
          <div className="explore-recipe-grid">
            {favoriteRecipes.map((recipe) => (
              <div
                className="explore-recipe-card"
                key={recipe.id}
              >
                <div className="explore-card-image">
                  <Link to={`/recipe/${recipe.id}`}>
                    <img src={recipe.image} alt={recipe.name} />
                  </Link>

                  <button
                    type="button"
                    className="explore-favorite-btn active"
                    onClick={() => removeFavorite(recipe.id)}
                    aria-label="Remove from favorites"
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                </div>

                <div className="explore-card-info">
                  <span className="explore-card-category">
                    {recipe.cuisine} · {recipe.meal}
                  </span>

                  <h3>{recipe.name}</h3>

                  <div className="explore-card-footer">
                    <span>{recipe.taste}</span>

                    <Link
                      to={`/recipe/${recipe.id}`}
                      className="explore-view-recipe"
                    >
                      View Recipe →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="explore-empty">
            <span>♡</span>
            <h3>No favorite recipes yet!</h3>
            <p>
              Explore delicious recipes and tap the heart
              to save the ones you love.
            </p>

            <Link to="/explore">
              <button>Explore Recipes</button>
            </Link>
          </div>
        )}

      </section>
    </main>
  );
}

export default Favorites;
