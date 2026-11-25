
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getRecipes } from "../data/recipes";

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const recipes = getRecipes();
  const recipe = recipes.find(
    (item) => String(item.id) === id
  );

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
      (favoriteId) => String(favoriteId) === String(id)
    );
  });

  const [checkedIngredients, setCheckedIngredients] = useState([]);

  if (!recipe) {
    return (
      <div className="page">
        <h1>Recipe Not Found 😢</h1>
        <Link to="/explore">Back to Explore</Link>
      </div>
    );
  }

  const ingredients = recipe.ingredients
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const instructions = recipe.instructions
    .split("\n")
    .map((step) => step.trim())
    .filter(Boolean);

  function toggleFavorite() {
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
        (favoriteId) => String(favoriteId) !== String(id)
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

  function toggleIngredient(index) {
    setCheckedIngredients((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    );
  }

  return (
    <div className="recipe-page">

      <div className="recipe-topbar">
        <Link to="/explore" className="recipe-back-link">
          ← Back to Explore
        </Link>

        <button
          className={`recipe-save-btn ${isFavorite ? "saved" : ""}`}
          onClick={toggleFavorite}
        >
          {isFavorite ? "❤️ Saved" : "♡ Save Recipe"}
        </button>
      </div>

      <section className="recipe-hero">

        <div className="recipe-hero-image">
          <img src={recipe.image} alt={recipe.name} />
          <span className="recipe-image-label">
            FOODIZIESS SPECIAL
          </span>
        </div>

        <div className="recipe-hero-info">

          <p className="recipe-eyebrow">
            GOOD FOOD, GOOD MOOD ✨
          </p>

          <h1>{recipe.name}</h1>

          <p className="recipe-intro">
            Discover the delicious flavours of {recipe.name}.
            Follow this simple recipe and make something
            wonderful in your kitchen!
          </p>

          <div className="recipe-tags">
            <span>🍽️ {recipe.meal}</span>
            <span>🌶️ {recipe.taste}</span>
            <span>🌍 {recipe.cuisine}</span>
            <span>🥗 {recipe.diet}</span>
          </div>

          <div className="recipe-hero-note">
            <span>👩‍🍳</span>
            <div>
              <strong>Let's get cooking!</strong>
              <p>Everything you need is right below.</p>
            </div>
          </div>

        </div>
      </section>

      <section className="recipe-content">

        <div className="recipe-section-heading">
          <p className="recipe-eyebrow">PREPARE YOUR KITCHEN</p>
          <h2>Let's Make {recipe.name}!</h2>
          <p>Gather your ingredients and follow the steps.</p>
        </div>

        <div className="recipe-cooking-layout">

          <div className="recipe-ingredients-card">

            <div className="recipe-card-heading">
              <div>
                <span>01</span>
                <h2>Ingredients</h2>
              </div>
              <span className="recipe-emoji">🥗</span>
            </div>

            <p className="recipe-card-subtitle">
              Tick off each ingredient as you prepare it.
            </p>

            <div className="ingredient-progress">
              <div className="ingredient-progress-text">
                <span>Your preparation</span>
                <strong>
                  {checkedIngredients.length}/{ingredients.length}
                </strong>
              </div>

              <div className="ingredient-progress-track">
                <div
                  className="ingredient-progress-fill"
                  style={{
                    width: `${
                      ingredients.length
                        ? (checkedIngredients.length / ingredients.length) * 100
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div className="ingredient-list">
              {ingredients.map((ingredient, index) => (
                <label
                  key={index}
                  className={`ingredient-item ${
                    checkedIngredients.includes(index) ? "completed" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkedIngredients.includes(index)}
                    onChange={() => toggleIngredient(index)}
                  />

                  <span className="ingredient-custom-check">
                    {checkedIngredients.includes(index) ? "✓" : ""}
                  </span>

                  <span>{ingredient}</span>
                </label>
              ))}
            </div>

            {checkedIngredients.length === ingredients.length && (
              <p className="ingredients-complete">
                🎉 All ingredients are ready!
              </p>
            )}

          </div>

          <div className="recipe-instructions-card">

            <div className="recipe-card-heading">
              <div>
                <span>02</span>
                <h2>Cooking Instructions</h2>
              </div>
              <span className="recipe-emoji">👩‍🍳</span>
            </div>

            <p className="recipe-card-subtitle">
              Follow these steps to create your delicious dish.
            </p>

            <div className="cooking-steps">
              {instructions.map((step, index) => (
                <div className="cooking-step" key={index}>
                  <div className="cooking-step-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="cooking-step-content">
                    <h3>Step {index + 1}</h3>
                    <p>{step}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        <div className="recipe-bottom-note">
          <span>💜</span>
          <div>
            <h3>Made with love, served with happiness!</h3>
            <p>Enjoy your homemade {recipe.name}!</p>
          </div>
        </div>

        <div className="recipe-more-link">
          <Link to="/explore">← Discover More Recipes</Link>
        </div>

      </section>
    </div>
  );
}

export default RecipeDetails;
