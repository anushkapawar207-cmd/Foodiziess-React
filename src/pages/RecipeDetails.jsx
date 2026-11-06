
import React from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipes } from "../data/recipes";

function RecipeDetails() {
  const { id } = useParams();

  const recipes = getRecipes();

  const recipe = recipes.find(
    (item) => String(item.id) === id
  );

  if (!recipe) {
    return (
      <div className="page">
        <h1>Recipe Not Found 😢</h1>
        <Link to="/explore">Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="recipe-details">

        <Link to="/explore" className="back-link">
          ← Back to Explore
        </Link>

        <div className="recipe-details-content">

          {/* RECIPE IMAGE */}
          <div className="recipe-details-image">
            <img src={recipe.image} alt={recipe.name} />
          </div>

          {/* RECIPE INFORMATION */}
          <div className="recipe-details-info">

            <h1>{recipe.name}</h1>

            <p>
              {recipe.meal} • {recipe.taste} • {recipe.cuisine}
            </p>

            <p>
              <strong>Diet:</strong> {recipe.diet}
            </p>

            <h2>Ingredients 🥗</h2>

            <ul>
              {recipe.ingredients.split(",").map((ingredient, index) => (
                <li key={index}>{ingredient.trim()}</li>
              ))}
            </ul>

            <h2>Cooking Instructions 👩‍🍳</h2>

            <ol>
              {recipe.instructions.split("\n").map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>

          </div>
        </div>
      </section>
    </div>
  );
}

export default RecipeDetails;
