
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../data/recipes";

function FoodSuggestions() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const recipes = getRecipes();

  const profile = useMemo(() => {
    if (!currentUser) return null;

    try {
      return JSON.parse(
        localStorage.getItem(`foodProfile_${currentUser.email}`) || "{}"
      );
    } catch {
      return {};
    }
  }, [currentUser?.email]);

  if (!currentUser) {
    return (
      <main className="food-suggestions-page">
        <h2>Please log in to view your recipe suggestions.</h2>
        <Link to="/login">Login here</Link>
      </main>
    );
  }

  const allergies = (profile?.allergies || []).map((item) =>
    item.toLowerCase()
  );

  const diet = profile?.diet || "No Preference";
  const cuisines = profile?.cuisines || [];

  // Basic ingredient matching for common allergen terms.
  const allergenTerms = {
    peanuts: ["peanut", "groundnut"],
    milk: ["milk", "cheese", "butter", "yogurt", "curd", "cream", "paneer"],
    eggs: ["egg"],
    soy: ["soy", "soya"],
    wheat: ["wheat", "flour", "maida", "bread"],
    "tree nuts": ["almond", "cashew", "walnut", "pistachio", "hazelnut"],
    fish: ["fish"],
    shellfish: ["shrimp", "prawn", "crab", "lobster", "shellfish"],
  };

  function containsAllergen(recipe) {
    const ingredients = (
      `${recipe.ingredients || ""} ${recipe.name || ""}`
    ).toLowerCase();

    return allergies.some((allergy) => {
      const terms = allergenTerms[allergy] || [allergy];

      return terms.some((term) =>
        new RegExp(`\\b${term}\\b`, "i").test(ingredients)
      );
    });
  }

  const suggestions = recipes.filter((recipe) => {
    if (containsAllergen(recipe)) return false;

    if (
      diet !== "No Preference" &&
      recipe.diet !== diet
    ) {
      return false;
    }

    return true;
  });

  const preferredSuggestions = suggestions.filter((recipe) =>
    cuisines.includes(recipe.cuisine)
  );

  const displayedRecipes =
    preferredSuggestions.length > 0
      ? preferredSuggestions
      : suggestions;

  return (
    <main className="food-suggestions-page">
      <div className="food-suggestions-container">

        <Link to="/food-space" className="food-suggestions-back">
          ← Back to My Food Space
        </Link>

        <header className="food-suggestions-header">
          <span>MADE JUST FOR YOUR TASTE 💜</span>
          <h1>Your Recipe Suggestions</h1>
          <p>
            A little inspiration based on your food preferences
            and dietary choices.
          </p>
        </header>

        <section className="food-suggestions-summary">
          <h2>Your food preferences</h2>

          <p>
            <strong>Diet:</strong> {diet}
          </p>

          <p>
            <strong>Favourite cuisines:</strong>{" "}
            {cuisines.length > 0
              ? cuisines.join(", ")
              : "No preferences selected"}
          </p>

          <p>
            <strong>Allergies selected:</strong>{" "}
            {allergies.length > 0
              ? profile.allergies.join(", ")
              : "None selected"}
          </p>

          <Link to="/food-profile">
            Update My Food Profile →
          </Link>
        </section>

        <section className="food-suggestions-results">
          <h2>Recipes picked for you 🍓</h2>

          <p>
            {displayedRecipes.length} recipe(s) match your
            current filters.
          </p>

          {displayedRecipes.length > 0 ? (
            <div className="food-suggestions-grid">
              {displayedRecipes.map((recipe) => (
                <article
                  className="food-suggestion-card"
                  key={recipe.id}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="food-suggestion-content">
                    <span>{recipe.cuisine} • {recipe.diet}</span>

                    <h3>{recipe.name}</h3>

                    <p>
                      {recipe.meal} · {recipe.taste}
                    </p>

                    <Link to={`/recipe/${recipe.id}`}>
                      View Recipe →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="food-suggestions-empty">
              <span>🥺</span>
              <h3>No matching recipes found.</h3>
              <p>
                Try changing your food preferences or exploring
                all available recipes.
              </p>
              <Link to="/explore">Explore All Recipes</Link>
            </div>
          )}
        </section>

        <p className="food-suggestions-note">
          Allergy filtering is based on the ingredient text
          available in Foodiziess. It cannot guarantee that
          a recipe is allergen-free or free from cross-contact.
          Always verify ingredients and preparation details.
        </p>

      </div>
    </main>
  );
}

export default FoodSuggestions;
