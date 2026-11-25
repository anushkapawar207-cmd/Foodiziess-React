
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRecipes } from "../data/recipes";

function Home() {
  const navigate = useNavigate();
  const recipes = getRecipes();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const favoritesKey = currentUser
    ? `favorites_${currentUser.id}`
    : null;

  const [search, setSearch] = useState("");

  const [favorites, setFavorites] = useState(() => {
    if (!favoritesKey) return [];

    try {
      return JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    } catch {
      return [];
    }
  });

  const popularRecipes = recipes.filter(
    (recipe) => recipe.popular === true
  );

  const featuredRecipe = popularRecipes[0];

  const favoriteRecipes = recipes.filter((recipe) =>
    favorites.some((id) => String(id) === String(recipe.id))
  );

  const categories = [
    { name: "Breakfast", emoji: "🍳", description: "Start your day deliciously" },
    { name: "Lunch", emoji: "🥗", description: "Make your midday special" },
    { name: "Dinner", emoji: "🍝", description: "End your day with flavour" },
    { name: "Snacks", emoji: "🥪", description: "Little bites, big happiness" },
    { name: "Dessert", emoji: "🍰", description: "A little sweetness" }
  ];

  function handleSearch(event) {
    event.preventDefault();

    navigate(
      `/explore?search=${encodeURIComponent(search.trim())}`
    );
  }

  function toggleFavorite(event, recipeId) {
    event.preventDefault();
    event.stopPropagation();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const alreadyFavorite = favorites.some(
      (id) => String(id) === String(recipeId)
    );

    const updatedFavorites = alreadyFavorite
      ? favorites.filter((id) => String(id) !== String(recipeId))
      : [...favorites, recipeId];

    localStorage.setItem(
      favoritesKey,
      JSON.stringify(updatedFavorites)
    );

    setFavorites(updatedFavorites);
  }

  function RecipeCard({ recipe }) {
    const isFavorite = favorites.some(
      (id) => String(id) === String(recipe.id)
    );

    return (
      <article className="home-recipe-card">
        <div className="home-recipe-image">
          <Link to={`/recipe/${recipe.id}`}>
            <img src={recipe.image} alt={recipe.name} />
          </Link>

          <button
            className={`home-heart ${isFavorite ? "active" : ""}`}
            onClick={(event) => toggleFavorite(event, recipe.id)}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            type="button"
          >
            {isFavorite ? "❤️" : "♡"}
          </button>

          {recipe.popular && (
            <span className="home-recipe-tag">Popular</span>
          )}
        </div>

        <div className="home-recipe-info">
          <span className="home-recipe-meta">
            {recipe.cuisine} · {recipe.meal}
          </span>

          <h3>{recipe.name}</h3>

          <div className="home-recipe-bottom">
            <span>{recipe.taste}</span>

            <Link to={`/recipe/${recipe.id}`}>
              View recipe →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">
            ✦ GOOD FOOD, GOOD MOOD
          </span>

          <h1>
            Every craving has
            <span> a story.</span>
          </h1>

          <p>
            From comforting classics to exciting new flavours,
            discover recipes that make every meal special.
          </p>

          <form className="home-search" onSubmit={handleSearch}>
            <span>⌕</span>

            <input
              type="text"
              placeholder="What are you craving today?"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit">Find Recipes</button>
          </form>

          <div className="home-hero-links">
            <Link to="/explore">Explore all recipes →</Link>
            <span>Discover · Cook · Enjoy</span>
          </div>
        </div>

        {featuredRecipe && (
          <div className="home-hero-visual">
            <Link to={`/recipe/${featuredRecipe.id}`}>
              <img
                src={featuredRecipe.image}
                alt={featuredRecipe.name}
              />
            </Link>

            <div className="home-hero-caption">
              <span>OUR PICK FOR YOU</span>
              <h3>{featuredRecipe.name}</h3>
              <p>{featuredRecipe.cuisine} · {featuredRecipe.meal}</p>
            </div>

            <div className="home-hero-decoration">Yum!</div>
          </div>
        )}
      </section>

      {/* POPULAR RECIPES */}
      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">THE CROWD FAVOURITES</span>
            <h2>Popular this week</h2>
            <p>Recipes everyone is loving right now.</p>
          </div>

          <Link to="/explore" className="home-section-link">
            View all recipes →
          </Link>
        </div>

        {popularRecipes.length > 0 ? (
          <div className="home-recipe-grid">
            {popularRecipes.slice(0, 4).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="home-empty-message">
            New popular recipes are coming soon!
          </p>
        )}
      </section>

      {/* PERSONALIZED FAVORITES */}
      <section className="home-favorites-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">SAVED WITH LOVE</span>
            <h2>Your little collection ❤️</h2>
            <p>Your favourite recipes, all in one place.</p>
          </div>

          {currentUser && favoriteRecipes.length > 0 && (
            <Link to="/favorites" className="home-section-link">
              View your collection →
            </Link>
          )}
        </div>

        {!currentUser ? (
          <div className="home-favorites-prompt">
            <span>♡</span>
            <div>
              <h3>Your favourite recipes deserve a home.</h3>
              <p>Login to save recipes and build your own collection.</p>
            </div>
            <Link to="/login">Login to get started →</Link>
          </div>
        ) : favoriteRecipes.length > 0 ? (
          <div className="home-recipe-grid">
            {favoriteRecipes.slice(0, 4).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="home-favorites-prompt">
            <span>♡</span>
            <div>
              <h3>Your collection is waiting!</h3>
              <p>Tap the heart on any recipe to save it here.</p>
            </div>
            <Link to="/explore">Discover recipes →</Link>
          </div>
        )}
      </section>

      {/* MEAL CATEGORIES */}
      <section className="home-category-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">WHAT ARE YOU IN THE MOOD FOR?</span>
            <h2>Something for every craving.</h2>
            <p>Find the perfect recipe for every moment of your day.</p>
          </div>
        </div>

        <div className="home-category-grid">
          {categories.map((category) => (
            <Link
              to={`/explore?meal=${category.name}`}
              className="home-category-card"
              key={category.name}
            >
              <span>{category.emoji}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="home-category-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="home-about">
        <span className="home-eyebrow">A LITTLE ABOUT US</span>
        <h2>Made for people who love good food.</h2>
        <p>
          Foodiziess is your little corner of the internet to discover
          delicious recipes, explore different cuisines and find
          inspiration for whatever you're craving.
        </p>
        <Link to="/explore">Start exploring →</Link>
      </section>

    </main>
  );
}

export default Home;
