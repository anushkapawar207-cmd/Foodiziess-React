
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const favoritesKey = currentUser
    ? `favorites_${currentUser.id}`
    : null;

  const [isFavorite, setIsFavorite] = useState(() => {
    if (!favoritesKey) return false;

    const favorites = JSON.parse(
      localStorage.getItem(favoritesKey) || "[]"
    );

    return favorites.some(
      (id) => String(id) === String(recipe.id)
    );
  });

  function toggleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const favorites = JSON.parse(
      localStorage.getItem(favoritesKey) || "[]"
    );

    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(
        (id) => String(id) !== String(recipe.id)
      );
    } else {
      updatedFavorites = [...favorites, recipe.id];
    }

    localStorage.setItem(
      favoritesKey,
      JSON.stringify(updatedFavorites)
    );

    setIsFavorite(!isFavorite);
  }

  return (
    <div className="recipe-card">
      <div className="recipe-card-image">
        <img src={recipe.image} alt={recipe.name} />

        <button
          type="button"
          className={`recipe-favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "♡"}
        </button>
      </div>

      <h3>{recipe.name}</h3>
      <p>{recipe.cuisine}</p>

      <Link to={`/recipe/${recipe.id}`}>
        View Recipe
      </Link>
    </div>
  );
}

export default RecipeCard;
