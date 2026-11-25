
import React from "react";
import { Link } from "react-router-dom";

function FoodSpace() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  if (!currentUser) {
    return (
      <div className="food-space-login">
        <h2>Welcome to My Food Space 💜</h2>
        <p>Please log in to explore your personal food dashboard.</p>
        <Link to="/login">Login here</Link>
      </div>
    );
  }

  const firstName = currentUser.name?.split(" ")[0] || "there";

  const features = [
    {
      number: "01",
      icon: "🥗",
      title: "My Food Profile",
      description:
        "Set your allergies, dietary preferences and personal food choices.",
      detail: "YOUR PREFERENCES",
      className: "profile-card",
      link: "/food-profile",
    },
    {
      number: "02",
      icon: "📅",
      title: "Weekly Meal Planner",
      description:
        "Organize your breakfast, lunch, dinner and snacks for the week.",
      detail: "PLAN YOUR WEEK",
      className: "planner-card",
      link: "/meal-planner",
    },
    {
      number: "03",
      icon: "🍓",
      title: "Recipe Suggestions",
      description:
        "Discover recipes that match your taste and dietary requirements.",
      detail: "MADE FOR YOU",
      className: "suggestions-card",
      link: "/food-suggestions",
    },
    {
      number: "04",
      icon: "📊",
      title: "Nutrition Tracker",
      description:
        "Compare planned meals with what you actually eat and track nutrition.",
      detail: "YOUR NUTRITION",
      className: "nutrition-card",
      link: "/nutrition",
    },
  ];

  return (
    <main className="food-space-page">

      {/* Welcome section */}
      <section className="food-space-hero">
        <div className="food-space-hero-content">
          <span className="food-space-eyebrow">
            ✨ YOUR PERSONAL FOOD JOURNEY
          </span>

          <h1>
            A little more
            <br />
            <span>you in every bite.</span>
          </h1>

          <p>
            Welcome back, {firstName}! Your own little corner
            for planning meals, discovering recipes and
            making food choices that feel right for you.
          </p>

          <div className="food-space-hero-note">
            <span>💜</span>
            <span>Eat well. Plan better. Enjoy every bite.</span>
          </div>
        </div>

        <div className="food-space-hero-art">
          <div className="food-space-art-circle">
            <span className="food-space-main-emoji">🥑</span>
          </div>

          <span className="food-space-floating food-space-float-one">
            🍓
          </span>

          <span className="food-space-floating food-space-float-two">
            🥕
          </span>

          <span className="food-space-floating food-space-float-three">
            🥬
          </span>

          <div className="food-space-art-caption">
            <span>YOUR SPACE</span>
            <strong>YOUR RULES 💜</strong>
          </div>
        </div>
      </section>

      {/* Feature heading */}
      <section className="food-space-features">
        <div className="food-space-section-heading">
          <div>
            <span className="food-space-section-label">
              YOUR DASHBOARD
            </span>

            <h2>Make yourself at home.</h2>

            <p>
              Everything you need for your personal food journey.
            </p>
          </div>

          <span className="food-space-heart">♡</span>
        </div>

        {/* Feature cards */}
        <div className="food-space-grid">
          {features.map((feature) => (
            <Link
              to={feature.link}
              className={`food-space-card ${feature.className}`}
              key={feature.number}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="food-space-card-top">
                <span className="food-space-card-number">
                  {feature.number}
                </span>

                <span className="food-space-card-icon">
                  {feature.icon}
                </span>
              </div>

              <span className="food-space-card-label">
                {feature.detail}
              </span>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <div className="food-space-card-bottom">
                <span>EXPLORE YOUR SPACE</span>
                <span className="food-space-card-arrow">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom banner */}
      <section className="food-space-bottom">
        <div>
          <span>🌷 A FRESH START, EVERY DAY</span>

          <h2>Your food journey, your way.</h2>

          <p>
            Small choices, delicious meals and a little
            more time for yourself.
          </p>
        </div>

        <div className="food-space-bottom-art">
          🍒
        </div>
      </section>

    </main>
  );
}

export default FoodSpace;
