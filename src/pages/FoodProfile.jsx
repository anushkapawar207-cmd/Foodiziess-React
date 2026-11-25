
import React, { useState } from "react";
import { Link } from "react-router-dom";

function FoodProfile() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const userKey = currentUser
    ? `foodProfile_${currentUser.email}`
    : null;

  const defaultProfile = {
    allergies: [],
    diet: "No Preference",
    cuisines: [],
    likes: "",
    dislikes: "",
    calorieGoal: "",
  };

  const [profile, setProfile] = useState(() => {
    if (!userKey) return defaultProfile;

    try {
      return {
        ...defaultProfile,
        ...JSON.parse(localStorage.getItem(userKey) || "{}"),
      };
    } catch {
      return defaultProfile;
    }
  });

  const allergyOptions = [
    "Peanuts",
    "Milk",
    "Eggs",
    "Soy",
    "Wheat",
    "Tree Nuts",
    "Fish",
    "Shellfish",
  ];

  const cuisineOptions = [
    "Indian",
    "Italian",
    "Chinese",
    "Korean",
    "Mexican",
  ];

  function updateField(field, value) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function toggleOption(field, option) {
    setProfile((previous) => ({
      ...previous,
      [field]: previous[field].includes(option)
        ? previous[field].filter((item) => item !== option)
        : [...previous[field], option],
    }));
  }

  function saveProfile(event) {
    event.preventDefault();

    if (!currentUser) return;

    localStorage.setItem(userKey, JSON.stringify(profile));

    alert("Your food profile has been saved successfully! 💜");
  }

  if (!currentUser) {
    return (
      <div className="food-profile-page">
        <h2>Please log in to create your food profile.</h2>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <main className="food-profile-page">
      <div className="food-profile-container">

        <Link to="/food-space" className="food-profile-back">
          ← Back to My Food Space
        </Link>

        <div className="food-profile-header">
          <span>YOUR PERSONAL FOOD DETAILS 💜</span>
          <h1>My Food Profile</h1>
          <p>
            Tell us about your food preferences so we can
            make your Foodiziess experience more personal.
          </p>
        </div>

        <form onSubmit={saveProfile}>

          {/* Allergies */}
          <section className="food-profile-section">
            <h2>🚫 Food Allergies</h2>
            <p>Select any ingredients you are allergic to.</p>

            <div className="food-profile-options">
              {allergyOptions.map((option) => (
                <label key={option} className="food-profile-option">
                  <input
                    type="checkbox"
                    checked={profile.allergies.includes(option)}
                    onChange={() => toggleOption("allergies", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </section>

          {/* Diet */}
          <section className="food-profile-section">
            <h2>🥗 Dietary Preference</h2>
            <p>Choose the type of food you prefer.</p>

            <select
              value={profile.diet}
              onChange={(e) => updateField("diet", e.target.value)}
            >
              <option>No Preference</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Non-Vegetarian</option>
            </select>
          </section>

          {/* Cuisines */}
          <section className="food-profile-section">
            <h2>🍜 Favourite Cuisines</h2>
            <p>Select the cuisines you enjoy.</p>

            <div className="food-profile-options">
              {cuisineOptions.map((option) => (
                <label key={option} className="food-profile-option">
                  <input
                    type="checkbox"
                    checked={profile.cuisines.includes(option)}
                    onChange={() => toggleOption("cuisines", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </section>

          {/* Likes */}
          <section className="food-profile-section">
            <h2>💗 Foods You Love</h2>
            <p>Tell us about ingredients or dishes you enjoy.</p>

            <textarea
              value={profile.likes}
              onChange={(e) => updateField("likes", e.target.value)}
              placeholder="Example: Paneer, pasta, mango, spicy food..."
              rows="3"
            />
          </section>

          {/* Dislikes */}
          <section className="food-profile-section">
            <h2>🙅 Foods You Dislike</h2>
            <p>Tell us what you would rather avoid.</p>

            <textarea
              value={profile.dislikes}
              onChange={(e) => updateField("dislikes", e.target.value)}
              placeholder="Example: Mushrooms, bitter gourd..."
              rows="3"
            />
          </section>

          {/* Calories */}
          <section className="food-profile-section">
            <h2>🎯 Daily Calorie Goal</h2>
            <p>
              Optional. Enter a daily calorie target if you
              already have one.
            </p>

            <input
              type="number"
              min="1"
              max="10000"
              value={profile.calorieGoal}
              onChange={(e) =>
                updateField("calorieGoal", e.target.value)
              }
              placeholder="Example: 2000"
            />
            <small>Calories per day (optional)</small>
          </section>

          <button type="submit" className="food-profile-save">
            Save My Food Profile 💜
          </button>

        </form>
      </div>
    </main>
  );
}

export default FoodProfile;
