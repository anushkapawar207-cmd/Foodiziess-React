
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getRecipes } from "../data/recipes";

function Explore() {
  const recipes = getRecipes();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [meal, setMeal] = useState(searchParams.get("meal") || "");
  const [taste, setTaste] = useState(searchParams.get("taste") || "");
  const [cuisine, setCuisine] = useState(searchParams.get("cuisine") || "");
  const [diet, setDiet] = useState(searchParams.get("diet") || "");

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesMeal = !meal || recipe.meal === meal;
    const matchesTaste = !taste || recipe.taste === taste;
    const matchesCuisine = !cuisine || recipe.cuisine === cuisine;
    const matchesDiet = !diet || recipe.diet === diet;

    return (
      matchesSearch &&
      matchesMeal &&
      matchesTaste &&
      matchesCuisine &&
      matchesDiet
    );
  });

  function clearFilters() {
    setSearch("");
    setMeal("");
    setTaste("");
    setCuisine("");
    setDiet("");
  }

  return (
    <div className="page">
      <section className="section">
        <h1>Explore Recipes 🍜</h1>
        <p>Discover something delicious today!</p>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTERS */}
        <div className="filters">
          <select value={meal} onChange={(e) => setMeal(e.target.value)}>
            <option value="">All Meals</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
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

          <button onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        {/* RECIPE COUNT */}
        <h2>All Recipes ({filteredRecipes.length})</h2>

        {/* RECIPE GRID */}
        <div className="recipe-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <Link
                to={`/recipe/${recipe.id}`}
                className="recipe-card"
                key={recipe.id}
              >
                <div className="recipe-image">
                  <img src={recipe.image} alt={recipe.name} />
                </div>

                <div className="recipe-info">
                  <h3>{recipe.name}</h3>
                  <p>
                    {recipe.meal} • {recipe.taste} • {recipe.cuisine}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results">
              <h2>No recipes found 😭</h2>
              <p>Try changing your search or filters.</p>
              <button onClick={clearFilters}>View All Recipes</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Explore;
