
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../../data/recipes";

const emptyRecipe = {
  name: "",
  meal: "Breakfast",
  taste: "Sweet",
  cuisine: "Indian",
  diet: "Vegetarian",
  image: "",
  ingredients: "",
  instructions: "",
  popular: false,
};

function ManageRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState(emptyRecipe);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setRecipes(getRecipes());
  }, []);

  function saveRecipes(updatedRecipes) {
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    setRecipes(updatedRecipes);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    let updatedRecipes;

    if (editingId !== null) {
      updatedRecipes = recipes.map((recipe) =>
        recipe.id === editingId
          ? { ...formData, id: editingId }
          : recipe
      );
    } else {
      const newRecipe = {
        ...formData,
        id: Date.now(),
      };

      updatedRecipes = [...recipes, newRecipe];
    }

    saveRecipes(updatedRecipes);
    setFormData(emptyRecipe);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(recipe) {
    setFormData({ ...recipe });
    setEditingId(recipe.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (confirmDelete) {
      const updatedRecipes = recipes.filter(
        (recipe) => recipe.id !== id
      );

      saveRecipes(updatedRecipes);
    }
  }

  function handleCancel() {
    setFormData(emptyRecipe);
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Foodiziess 💜</h2>
        <p className="sidebar-label">ADMIN PANEL</p>

        <nav>
          <Link to="/admin/dashboard">◈ Overview</Link>
          <Link to="/admin/recipes" className="active">
            ◈ Manage Recipes
          </Link>
          <Link to="/admin/users">◈ Manage Users</Link>
          <Link to="/admin/analytics">◈ Analytics</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">

        <div className="admin-heading">
          <div>
            <h1>Manage Recipes</h1>
            <p>Add, edit, delete and organise your dishes.</p>
          </div>

          <button
            className="add-recipe-btn"
            onClick={() => {
              setFormData(emptyRecipe);
              setEditingId(null);
              setShowForm(!showForm);
            }}
          >
            + Add New Recipe
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <section className="recipe-admin-form">
            <h2>
              {editingId !== null ? "Edit Recipe" : "Add New Recipe"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="recipe-form-grid">
                <input
                  type="text"
                  name="name"
                  placeholder="Recipe Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="image"
                  placeholder="Image path or image URL"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />

                <select name="meal" value={formData.meal} onChange={handleChange}>
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snacks</option>
                  <option>Dessert</option>
                </select>

                <select name="taste" value={formData.taste} onChange={handleChange}>
                  <option>Sweet</option>
                  <option>Spicy</option>
                  <option>Tangy</option>
                </select>

                <select name="cuisine" value={formData.cuisine} onChange={handleChange}>
                  <option>Indian</option>
                  <option>Italian</option>
                  <option>Chinese</option>
                  <option>Korean</option>
                  <option>Mexican</option>
                </select>

                <select name="diet" value={formData.diet} onChange={handleChange}>
                  <option>Vegan</option>
                  <option>Vegetarian</option>
                  <option>Non-Vegetarian</option>
                </select>
              </div>

              <textarea
                name="ingredients"
                placeholder="Ingredients (separate using commas)"
                value={formData.ingredients}
                onChange={handleChange}
                required
              />

              <textarea
                name="instructions"
                placeholder={"Cooking Instructions (put each step on a new line)"}
                value={formData.instructions}
                onChange={handleChange}
                required
              />

              <label className="popular-checkbox">
                <input
                  type="checkbox"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleChange}
                />
                Show in Popular Recipes
              </label>

              <div className="recipe-form-actions">
                <button type="submit">
                  {editingId !== null ? "Update Recipe" : "Save Recipe"}
                </button>

                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>

            </form>
          </section>
        )}

        {/* Recipe List */}
        <section className="recipe-table-section">
          <div className="recipe-table-heading">
            <h2>All Recipes</h2>
            <span>{recipes.length} Recipes</span>
          </div>

          {recipes.length === 0 ? (
            <p>No recipes available. Add your first recipe!</p>
          ) : (
            <div className="recipe-table-wrapper">
              <table className="recipe-table">
                <thead>
                  <tr>
                    <th>Recipe</th>
                    <th>Meal</th>
                    <th>Cuisine</th>
                    <th>Diet</th>
                    <th>Popular</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {recipes.map((recipe) => (
                    <tr key={recipe.id}>
                      <td>
                        <div className="admin-recipe-name">
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                          <span>{recipe.name}</span>
                        </div>
                      </td>

                      <td>{recipe.meal}</td>
                      <td>{recipe.cuisine}</td>
                      <td>{recipe.diet}</td>
                      <td>{recipe.popular ? "⭐ Yes" : "No"}</td>

                      <td>
                        <div className="recipe-actions">
                          <button onClick={() => handleEdit(recipe)}>
                            Edit
                          </button>

                          <button onClick={() => handleDelete(recipe.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default ManageRecipes;
