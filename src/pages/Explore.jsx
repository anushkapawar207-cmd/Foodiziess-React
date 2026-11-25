
import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getRecipes } from "../data/recipes";

function Explore() {
  const recipes = getRecipes();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [meal, setMeal] = useState(searchParams.get("meal") || "");
  const [taste, setTaste] = useState(searchParams.get("taste") || "");
  const [cuisine, setCuisine] = useState(searchParams.get("cuisine") || "");
  const [diet, setDiet] = useState(searchParams.get("diet") || "");

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const favoritesKey = currentUser
    ? `favorites_${currentUser.id}`
    : null;

  const [favorites, setFavorites] = useState(() => {
    if (!favoritesKey) return [];

    return JSON.parse(localStorage.getItem(favoritesKey) || "[]");
  });

  function toggleFavorite(event, recipeId) {
    event.preventDefault();
    event.stopPropagation();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    let updatedFavorites;

    const alreadyFavorite = favorites.some(
      (id) => String(id) === String(recipeId)
    );

    if (alreadyFavorite) {
      updatedFavorites = favorites.filter(
        (id) => String(id) !== String(recipeId)
      );
    } else {
      updatedFavorites = [...favorites, recipeId];
    }

    localStorage.setItem(
      favoritesKey,
      JSON.stringify(updatedFavorites)
    );

    setFavorites(updatedFavorites);
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      [
        recipe.name,
        recipe.meal,
        recipe.taste,
        recipe.cuisine,
        recipe.diet
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchText));

    return (
      matchesSearch &&
      (!meal || recipe.meal === meal) &&
      (!taste || recipe.taste === taste) &&
      (!cuisine || recipe.cuisine === cuisine) &&
      (!diet || recipe.diet === diet)
    );
  });

  function clearFilters() {
    setSearch("");
    setMeal("");
    setTaste("");
    setCuisine("");
    setDiet("");
  }

  const hasFilters = search || meal || taste || cuisine || diet;

  return (
    <main className="explore-page">

      <section className="explore-hero">
        <div className="explore-hero-content">
          <span className="explore-eyebrow">
            YOUR NEXT FAVOURITE MEAL STARTS HERE
          </span>

          <h1>
            Discover something
            <span> delicious.</span>
          </h1>

          <p>
            Explore recipes, find new flavours and discover
            dishes that match your cravings.
          </p>

          <div className="explore-search">
            <span className="explore-search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search recipes, cuisines or flavours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="explore-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="explore-content">

        <div className="explore-heading">
          <div>
            <span className="explore-eyebrow">FIND YOUR CRAVING</span>
            <h2>Explore Recipes</h2>
            <p>Something delicious is waiting for you.</p>
          </div>

          <div className="explore-count">
            <strong>{filteredRecipes.length}</strong>
            <span> recipes found</span>
          </div>
        </div>

        <div className="explore-filter-panel">
          <div className="explore-filter-heading">
            <span>Refine your search</span>

            {hasFilters && (
              <button
                className="explore-reset"
                onClick={clearFilters}
              >
                Clear all ×
              </button>
            )}
          </div>

          <div className="explore-filters">
            <select value={meal} onChange={(e) => setMeal(e.target.value)}>
              <option value="">All Meals</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
              <option value="Dessert">Dessert</option>
            </select>

            <select value={taste} onChange={(e) => setTaste(e.target.value)}>
              <option value="">All Tastes</option>
              <option value="Sweet">Sweet</option>
              <option value="Spicy">Spicy</option>
              <option value="Tangy">Tangy</option>
            </select>

            <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
              <option value="">All Cuisines</option>
              <option value="Indian">Indian</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Korean">Korean</option>
              <option value="Mexican">Mexican</option>
            </select>

            <select value={diet} onChange={(e) => setDiet(e.target.value)}>
              <option value="">All Diets</option>
              <option value="Vegan">Vegan</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>
          </div>
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="explore-recipe-grid">
            {filteredRecipes.map((recipe) => {
              const isFavorite = favorites.some(
                (id) => String(id) === String(recipe.id)
              );

              return (
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
                      className={`explore-favorite-btn ${isFavorite ? "active" : ""}`}
                      onClick={(event) =>
                        toggleFavorite(event, recipe.id)
                      }
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {isFavorite ? "❤️" : "♡"}
                    </button>

                    {recipe.popular && (
                      <span className="explore-popular-tag">
                        ★ Popular
                      </span>
                    )}
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
              );
            })}
          </div>
        ) : (
          <div className="explore-empty">
            <span>🍽️</span>
            <h3>No recipes found</h3>
            <p>
              We couldn't find a match. Try another search
              or adjust your filters.
            </p>
            <button onClick={clearFilters}>
              Explore all recipes
            </button>
          </div>
        )}

      </section>
    </main>
  );
}

export default Explore;
