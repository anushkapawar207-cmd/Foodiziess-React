
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

function getMonday(date) {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (day === 0 ? -6 : 1 - day));
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

function Nutrition() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const email = currentUser?.email || "";

  const [weekStart, setWeekStart] = useState(() =>
    getMonday(new Date())
  );

  const [logs, setLogs] = useState(() => {
    if (!email) return [];

    try {
      return JSON.parse(
        localStorage.getItem(`nutritionLog_${email}`) || "[]"
      );
    } catch {
      return [];
    }
  });

  const [estimates, setEstimates] = useState(() => {
    if (!email) return {};

    try {
      return JSON.parse(
        localStorage.getItem(`nutritionEstimates_${email}`) || "{}"
      );
    } catch {
      return {};
    }
  });

  const [calorieInputs, setCalorieInputs] = useState({});
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [foodDate, setFoodDate] = useState(formatDate(new Date()));
  const [foodType, setFoodType] = useState("Breakfast");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCalories, setEditCalories] = useState("");

  const profile = useMemo(() => {
    if (!email) return {};

    try {
      return JSON.parse(
        localStorage.getItem(`foodProfile_${email}`) || "{}"
      );
    } catch {
      return {};
    }
  }, [email]);

  const calorieGoal = Number(profile.calorieGoal) || 0;

  useEffect(() => {
    if (email) {
      localStorage.setItem(
        `nutritionLog_${email}`,
        JSON.stringify(logs)
      );
    }
  }, [logs, email]);

  useEffect(() => {
    if (email) {
      localStorage.setItem(
        `nutritionEstimates_${email}`,
        JSON.stringify(estimates)
      );
    }
  }, [estimates, email]);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date;
  });

  const weekDates = days.map(formatDate);
  const weekLogs = logs.filter((log) =>
    weekDates.includes(log.date)
  );

  const weekCalories = weekLogs.reduce(
    (total, log) => total + Number(log.calories || 0),
    0
  );

  const today = formatDate(new Date());

  const todayCalories = logs
    .filter((log) => log.date === today)
    .reduce(
      (total, log) => total + Number(log.calories || 0),
      0
    );

  const progress = calorieGoal
    ? Math.min((todayCalories / calorieGoal) * 100, 100)
    : 0;

  function getPlanForDate(dateKey) {
    try {
      const date = new Date(`${dateKey}T00:00:00`);
      const monday = getMonday(date);
      const key = `mealPlanner_${email}_${formatDate(monday)}`;
      const plan = JSON.parse(localStorage.getItem(key) || "{}");
      return plan[dateKey] || {};
    } catch {
      return {};
    }
  }

  function getPlannedMeals(dateKey) {
    const dayPlan = getPlanForDate(dateKey);

    return mealTypes.flatMap((type) =>
      (dayPlan[type] || []).map((meal) => ({
        ...meal,
        mealType: type,
        date: dateKey,
        estimateKey: `${dateKey}_${meal.id}`,
      }))
    );
  }

  function saveEstimate(key, value) {
    setEstimates((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function markAsEaten(meal) {
    const key = meal.estimateKey;
    const calories = Number(calorieInputs[key] ?? estimates[key] ?? "");

    if (!Number.isFinite(calories) || calories <= 0) {
      alert("Please enter a valid calorie amount first.");
      return;
    }

    const alreadyLogged = logs.some(
      (log) =>
        log.date === meal.date &&
        log.sourcePlanId === meal.id
    );

    if (alreadyLogged) {
      alert("This planned meal is already marked as eaten.");
      return;
    }

    const newLog = {
      id: `${Date.now()}_${Math.random()}`,
      date: meal.date,
      name: meal.name,
      mealType: meal.mealType,
      calories,
      source: "planned",
      sourcePlanId: meal.id,
    };

    setLogs((previous) => [...previous, newLog]);
    setCalorieInputs((previous) => ({
      ...previous,
      [key]: "",
    }));
  }

  function addFood(event) {
    event.preventDefault();

    const name = foodName.trim();
    const calories = Number(foodCalories);

    if (!name || !Number.isFinite(calories) || calories <= 0) {
      alert("Please enter a food name and valid calories.");
      return;
    }

    const newLog = {
      id: `${Date.now()}_${Math.random()}`,
      date: foodDate,
      name,
      mealType: foodType,
      calories,
      source: "manual",
    };

    setLogs((previous) => [...previous, newLog]);
    setFoodName("");
    setFoodCalories("");
  }

  function deleteLog(id) {
    setLogs((previous) =>
      previous.filter((log) => log.id !== id)
    );
    if (editingId === id) setEditingId(null);
  }

  function startEditing(log) {
    setEditingId(log.id);
    setEditName(log.name);
    setEditCalories(String(log.calories));
  }

  function saveEdit(id) {
    const name = editName.trim();
    const calories = Number(editCalories);

    if (!name || !Number.isFinite(calories) || calories <= 0) {
      alert("Please enter a valid name and calorie amount.");
      return;
    }

    setLogs((previous) =>
      previous.map((log) =>
        log.id === id
          ? { ...log, name, calories }
          : log
      )
    );

    setEditingId(null);
  }

  function changeWeek(direction) {
    const nextWeek = new Date(weekStart);
    nextWeek.setDate(nextWeek.getDate() + direction * 7);
    setWeekStart(nextWeek);
  }

  function getWeekTotalForDay(dateKey) {
    return logs
      .filter((log) => log.date === dateKey)
      .reduce(
        (total, log) => total + Number(log.calories || 0),
        0
      );
  }

  if (!currentUser) {
    return (
      <main className="nutrition-page">
        <div className="nutrition-login">
          <h2>Please log in to use your Nutrition Tracker 💜</h2>
          <Link to="/login">Login here</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="nutrition-page">
      <div className="nutrition-container">

        <Link to="/food-space" className="nutrition-back">
          ← Back to My Food Space
        </Link>

        <header className="nutrition-header">
          <span>YOUR FOOD, YOUR WELLNESS ✨</span>
          <h1>Nutrition Tracker</h1>
          <p>
            Keep track of what you plan, what you eat and
            your daily calorie progress.
          </p>
        </header>

        <section className="nutrition-overview">
          <article className="nutrition-stat-card nutrition-goal-card">
            <span>🎯 DAILY CALORIE GOAL</span>
            <h2>
              {calorieGoal ? calorieGoal.toLocaleString("en-IN") : "Not set"}
            </h2>
            <p>
              {calorieGoal
                ? "Your goal from My Food Profile"
                : "Add a goal in your Food Profile"}
            </p>
            <Link to="/food-profile">Update goal →</Link>
          </article>

          <article className="nutrition-stat-card">
            <span>🍽️ TODAY'S CONSUMPTION</span>
            <h2>{todayCalories.toLocaleString("en-IN")}</h2>
            <p>Calories logged today</p>
          </article>

          <article className="nutrition-stat-card">
            <span>📅 THIS WEEK</span>
            <h2>{weekCalories.toLocaleString("en-IN")}</h2>
            <p>Calories logged in this displayed week</p>
          </article>
        </section>

        <section className="nutrition-progress-card">
          <div className="nutrition-progress-heading">
            <div>
              <span>YOUR DAILY PROGRESS</span>
              <h2>
                {calorieGoal
                  ? `${todayCalories.toLocaleString("en-IN")} / ${calorieGoal.toLocaleString("en-IN")} kcal`
                  : "Set a daily goal to see your progress"}
              </h2>
            </div>
            <strong>{calorieGoal ? `${Math.round(progress)}%` : "—"}</strong>
          </div>

          <div className="nutrition-progress-track">
            <div
              className="nutrition-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {calorieGoal && (
            <p>
              {todayCalories >= calorieGoal
                ? "You've reached your entered daily target."
                : `${(calorieGoal - todayCalories).toLocaleString("en-IN")} kcal remaining to your entered target.`}
            </p>
          )}
        </section>

        <section className="nutrition-week-section">
          <div className="nutrition-section-heading">
            <div>
              <span>YOUR PLANNED MEALS</span>
              <h2>Meal Planner Connection 🥗</h2>
              <p>
                Add calorie estimates to your planned meals,
                then mark them as eaten when you have them.
              </p>
            </div>
          </div>

          <div className="nutrition-week-navigation">
            <button type="button" onClick={() => changeWeek(-1)}>
              ← Previous
            </button>
            <h3>
              {weekStart.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
              {" – "}
              {days[6].toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </h3>
            <button type="button" onClick={() => changeWeek(1)}>
              Next →
            </button>
          </div>

          <div className="nutrition-days">
            {days.map((date) => {
              const dateKey = formatDate(date);
              const plannedMeals = getPlannedMeals(dateKey);

              return (
                <article className="nutrition-day-card" key={dateKey}>
                  <div className="nutrition-day-heading">
                    <div>
                      <span>
                        {date.toLocaleDateString("en-IN", {
                          weekday: "long",
                        })}
                      </span>
                      <h3>
                        {date.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </h3>
                    </div>
                    <strong>
                      {getWeekTotalForDay(dateKey).toLocaleString("en-IN")} kcal
                    </strong>
                  </div>

                  {plannedMeals.length === 0 ? (
                    <p className="nutrition-empty">
                      No meals planned for this day.
                    </p>
                  ) : (
                    <div className="nutrition-planned-list">
                      {plannedMeals.map((meal) => {
                        const alreadyLogged = logs.some(
                          (log) =>
                            log.date === dateKey &&
                            log.sourcePlanId === meal.id
                        );

                        return (
                          <div
                            className="nutrition-planned-item"
                            key={meal.id}
                          >
                            <div className="nutrition-planned-info">
                              <strong>{meal.name}</strong>
                              <span>{meal.mealType}</span>
                            </div>

                            <div className="nutrition-planned-actions">
                              <label>
                                <span>Estimated kcal</span>
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="e.g. 350"
                                  value={
                                    calorieInputs[meal.estimateKey] ??
                                    estimates[meal.estimateKey] ??
                                    ""
                                  }
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setCalorieInputs((previous) => ({
                                      ...previous,
                                      [meal.estimateKey]: value,
                                    }));
                                    saveEstimate(meal.estimateKey, value);
                                  }}
                                />
                              </label>

                              <button
                                type="button"
                                className={
                                  alreadyLogged
                                    ? "nutrition-eaten-button"
                                    : "nutrition-mark-button"
                                }
                                disabled={alreadyLogged}
                                onClick={() => markAsEaten(meal)}
                              >
                                {alreadyLogged ? "✓ Eaten" : "Mark as Eaten"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="nutrition-add-section">
          <div className="nutrition-section-heading">
            <div>
              <span>NOT IN YOUR PLAN?</span>
              <h2>Log Food Manually 🍓</h2>
              <p>
                Add anything you actually ate, even if it wasn't
                included in your meal planner.
              </p>
            </div>
          </div>

          <form className="nutrition-add-form" onSubmit={addFood}>
            <label>
              Food name
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="Example: A bowl of poha"
                required
              />
            </label>

            <label>
              Calories (kcal)
              <input
                type="number"
                min="1"
                value={foodCalories}
                onChange={(e) => setFoodCalories(e.target.value)}
                placeholder="Example: 250"
                required
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={foodDate}
                onChange={(e) => setFoodDate(e.target.value)}
                required
              />
            </label>

            <label>
              Meal type
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
              >
                {mealTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <button type="submit">+ Add to Food Log</button>
          </form>
        </section>

        <section className="nutrition-log-section">
          <div className="nutrition-section-heading">
            <div>
              <span>WHAT YOU ACTUALLY ATE</span>
              <h2>Your Weekly Food Log 📋</h2>
              <p>
                Review, edit or remove your recorded meals.
              </p>
            </div>
          </div>

          {weekLogs.length === 0 ? (
            <div className="nutrition-empty-log">
              <span>🥣</span>
              <h3>Your food log is waiting!</h3>
              <p>
                Mark a planned meal as eaten or add food manually.
              </p>
            </div>
          ) : (
            <div className="nutrition-log-list">
              {days.map((date) => {
                const dateKey = formatDate(date);
                const dayLogs = weekLogs.filter(
                  (log) => log.date === dateKey
                );

                if (dayLogs.length === 0) return null;

                return (
                  <div className="nutrition-log-day" key={dateKey}>
                    <div className="nutrition-log-day-heading">
                      <h3>
                        {date.toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                        })}
                      </h3>
                      <strong>
                        {getWeekTotalForDay(dateKey).toLocaleString("en-IN")} kcal
                      </strong>
                    </div>

                    {dayLogs.map((log) => (
                      <div className="nutrition-log-item" key={log.id}>
                        {editingId === log.id ? (
                          <div className="nutrition-edit-fields">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Food name"
                            />
                            <input
                              type="number"
                              min="1"
                              value={editCalories}
                              onChange={(e) => setEditCalories(e.target.value)}
                              placeholder="Calories"
                            />
                            <button
                              type="button"
                              onClick={() => saveEdit(log.id)}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div>
                              <strong>{log.name}</strong>
                              <span>
                                {log.mealType} ·{" "}
                                {log.source === "planned"
                                  ? "From meal planner"
                                  : "Manual entry"}
                              </span>
                            </div>

                            <strong>{Number(log.calories).toLocaleString("en-IN")} kcal</strong>

                            <div className="nutrition-log-actions">
                              <button
                                type="button"
                                onClick={() => startEditing(log)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteLog(log.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="nutrition-disclaimer">
          <strong>A little reminder 💜</strong>
          <p>
            Calorie values are entered by you and are estimates,
            not medical measurements. Your daily goal is optional
            and should be chosen with appropriate guidance for
            your needs.
          </p>
        </section>

      </div>
    </main>
  );
}

export default Nutrition;
