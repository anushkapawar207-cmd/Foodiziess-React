import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.name} />

      <h3>{recipe.name}</h3>
      <p>{recipe.cuisine}</p>

      <Link to={`/recipe/${recipe.id}`}>
        View Recipe
      </Link>
    </div>
  );
}

export default RecipeCard;