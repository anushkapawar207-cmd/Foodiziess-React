
import React from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../data/recipes";

function Home() {
  const categories = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const popularRecipes = getRecipes().filter(
    (recipe) => recipe.popular === true
  );

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <p className="small-heading">
            WELCOME TO FOODIZIESS
          </p>

          <h1>
            Find recipes to all
            <br />
            <span>yum food you crave.</span>
          </h1>

          <p className="hero-description">
            Discover delicious recipes from around the world
            based on your taste, mood and cravings.
          </p>

          {/* SEARCH BAR */}
          <div className="search-box">
            <input
              type="text"
              id="search-input"
              placeholder="Search for recipes..."
            />

            <Link to="/explore">
              <button id="search-button">
                Search
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR RECIPES */}
      <section className="section">
        <h2>Popular Recipes</h2>

        <div className="recipe-grid">
          {popularRecipes.map((recipe) => (
            <Link
              to={`/recipe/${recipe.id}`}
              className="recipe-card"
              key={recipe.id}
            >
              <div className="recipe-image">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                />
              </div>

              <div className="recipe-info">
                <h3>{recipe.name}</h3>

                <p>
                  {recipe.meal} • {recipe.taste} • {recipe.cuisine}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="section">
        <h2>Explore Categories</h2>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to={`/explore?meal=${category}`}
              className="category-card"
              key={category}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about" id="about">
        <h2>About Foodiziess</h2>

        <p>
          Foodiziess helps you discover delicious recipes
          based on your taste, meal, cuisine and dietary
          preferences.
        </p>
      </section>
    </>
  );
}

export default Home;
