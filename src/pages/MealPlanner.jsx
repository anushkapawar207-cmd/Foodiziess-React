
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../data/recipes";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

function getMonday(date) {
  const result = new Date(date);
  const day = result.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);
  result.setHours(0, 0, 0, 0);

  return result;
}

function formatDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getWeekLabel(date) {
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function MealPlanner() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const recipes = getRecipes();

  const [weekStart, setWeekStart] = useState(() =>
    getMonday(new Date())
  );

  const storageKey = currentUser
    ? `mealPlanner_${currentUser.email}_${formatDate(weekStart)}`
    : null;

  const [plan, setPlan] = useState(() => {
    if (!currentUser) return {};

    const key = `mealPlanner_${currentUser.email}_${formatDate(
      getMonday(new Date())
    )}`;

    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      return {};
    }
  });

  const [selectedRecipes, setSelectedRecipes] = useState({});
  const [customMeals, setCustomMeals] = useState({});

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(plan));
    }
  }, [plan, storageKey]);

  function changeWeek(direction) {
    const newWeek = new Date(weekStart);
    newWeek.setDate(newWeek.getDate() + direction * 7);

    setWeekStart(newWeek);

    const newKey = `mealPlanner_${currentUser.email}_${formatDate(
      newWeek
    )}`;

    try {
      setPlan(JSON.parse(localStorage.getItem(newKey) || "{}"));
    } catch {
      setPlan({});
    }

    setSelectedRecipes({});
    setCustomMeals({});
  }

  function updateSelectedRecipe(slotKey, value) {
    setSelectedRecipes((previous) => ({
      ...previous,
      [slotKey]: value,
    }));
  }

  function updateCustomMeal(slotKey, value) {
    setCustomMeals((previous) => ({
      ...previous,
      [slotKey]: value,
    }));
  }

  function addRecipe(dateKey, mealType) {
    const slotKey = `${dateKey}_${mealType}`;
    const recipeId = selectedRecipes[slotKey];

    if (!recipeId) {
      alert("Please select a recipe first.");
      return;
    }

    const recipe = recipes.find(
      (item) => String(item.id) === String(recipeId)
    );

    if (!recipe) return;

    const newMeal = {
      id: `${Date.now()}_${Math.random()}`,
      name: recipe.name,
      type: "recipe",
      recipeId: recipe.id,
    };

    setPlan((previous) => ({
      ...previous,
      [dateKey]: {
        ...previous[dateKey],
        [mealType]: [
          ...(previous[dateKey]?.[mealType] || []),
          newMeal,
        ],
      },
    }));

    updateSelectedRecipe(slotKey, "");
  }

  function addCustomMeal(dateKey, mealType) {
    const slotKey = `${dateKey}_${mealType}`;
    const mealName = (customMeals[slotKey] || "").trim();

    if (!mealName) {
      alert("Please enter your meal name.");
      return;
    }

    const newMeal = {
      id: `${Date.now()}_${Math.random()}`,
      name: mealName,
      type: "custom",
    };

    setPlan((previous) => ({
      ...previous,
      [dateKey]: {
        ...previous[dateKey],
        [mealType]: [
          ...(previous[dateKey]?.[mealType] || []),
          newMeal,
        ],
      },
    }));

    updateCustomMeal(slotKey, "");
  }

  function removeMeal(dateKey, mealType, mealId) {
    setPlan((previous) => ({
      ...previous,
      [dateKey]: {
        ...previous[dateKey],
        [mealType]: (
          previous[dateKey]?.[mealType] || []
        ).filter((meal) => meal.id !== mealId),
      },
    }));
  }

  function getDayDate(index) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date;
  }

  if (!currentUser) {
    return (
      <main className="meal-planner-page">
        <div className="meal-planner-login">
          <h2>Welcome to your Weekly Meal Planner 💜</h2>
          <p>Please log in to plan and save your meals.</p>
          <Link to="/login">Login here</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="meal-planner-page">
      <div className="meal-planner-container">

        <Link to="/food-space" className="meal-planner-back">
          ← Back to My Food Space
        </Link>

        <header className="meal-planner-header">
          <span>YOUR WEEK, YOUR MEALS ✨</span>
          <h1>Weekly Meal Planner</h1>
          <p>
            Plan your meals ahead, discover new recipes and
            make every day a little more delicious.
          </p>
        </header>

        <section className="meal-planner-week-navigation">
          <button
            type="button"
            onClick={() => changeWeek(-1)}
          >
            ← Previous Week
          </button>

          <h2>{getWeekLabel(weekStart)}</h2>

          <button
            type="button"
            onClick={() => changeWeek(1)}
          >
            Next Week →
          </button>
        </section>

        <div className="meal-planner-days">
          {Array.from({ length: 7 }, (_, index) => {
            const date = getDayDate(index);
            const dateKey = formatDate(date);

            return (
              <section className="meal-planner-day" key={dateKey}>
                <div className="meal-planner-day-heading">
                  <div>
                    <span>
                      {date.toLocaleDateString("en-IN", {
                        weekday: "long",
                      })}
                    </span>

                    <h2>
                      {date.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </h2>
                  </div>

                  <span className="meal-planner-day-emoji">
                    {["🌸", "🥑", "🍓", "🥕", "🥗", "🍒", "🌷"][index]}
                  </span>
                </div>

                <div className="meal-planner-meals">
                  {mealTypes.map((mealType) => {
                    const slotKey = `${dateKey}_${mealType}`;
                    const meals = plan[dateKey]?.[mealType] || [];

                    return (
                      <div
                        className="meal-planner-slot"
                        key={mealType}
                      >
                        <h3>
                          {mealType === "Breakfast" && "🌞 "}
                          {mealType === "Lunch" && "🍱 "}
                          {mealType === "Dinner" && "🌙 "}
                          {mealType === "Snacks" && "🍪 "}
                          {mealType}
                        </h3>

                        {meals.length > 0 ? (
                          <ul className="meal-planner-list">
                            {meals.map((meal) => (
                              <li key={meal.id}>
                                <span>
                                  {meal.name}
                                  <small>
                                    {meal.type === "recipe"
                                      ? "Foodiziess Recipe"
                                      : "Custom Meal"}
                                  </small>
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeMeal(
                                      dateKey,
                                      mealType,
                                      meal.id
                                    )
                                  }
                                  title="Remove meal"
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="meal-planner-empty">
                            No meals planned yet.
                          </p>
                        )}

                        <select
                          value={selectedRecipes[slotKey] || ""}
                          onChange={(e) =>
                            updateSelectedRecipe(
                              slotKey,
                              e.target.value
                            )
                          }
                        >
                          <option value="">Choose a recipe</option>

                          {recipes.map((recipe) => (
                            <option
                              key={recipe.id}
                              value={recipe.id}
                            >
                              {recipe.name}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="meal-planner-add-recipe"
                          onClick={() =>
                            addRecipe(dateKey, mealType)
                          }
                        >
                          + Add Recipe
                        </button>

                        <input
                          type="text"
                          value={customMeals[slotKey] || ""}
                          onChange={(e) =>
                            updateCustomMeal(
                              slotKey,
                              e.target.value
                            )
                          }
                          placeholder="Or enter your own meal..."
                        />

                        <button
                          type="button"
                          className="meal-planner-add-custom"
                          onClick={() =>
                            addCustomMeal(dateKey, mealType)
                          }
                        >
                          + Add Custom Meal
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="meal-planner-footer">
          <span>💜</span>
          Your meal plans are automatically saved for your account.
        </div>

      </div>
    </main>
  );
}

export default MealPlanner;
