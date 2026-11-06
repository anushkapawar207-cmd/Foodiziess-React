
const defaultRecipes = [
  {
    id: 1,
    name: "Paneer Tikka",
    meal: "Dinner",
    taste: "Spicy",
    cuisine: "Indian",
    diet: "Vegetarian",
    image: "/images/paneer-tikka.jpg",
    popular: true,
    ingredients:
      "Paneer, Capsicum, Onion, Yogurt, Ginger-Garlic Paste, Red Chilli Powder, Turmeric, Garam Masala, Salt, Lemon Juice",
    instructions:
      "Cut the paneer and vegetables into cubes.\nMarinate them with yogurt and spices.\nLet them rest for 30 minutes.\nPlace the paneer and vegetables on skewers.\nGrill or cook until golden brown.\nServe hot with chutney."
  },
  {
    id: 2,
    name: "Italian Pasta",
    meal: "Lunch",
    taste: "Tangy",
    cuisine: "Italian",
    diet: "Vegetarian",
    image: "/images/italian-pasta.jpg",
    popular: true,
    ingredients:
      "Pasta, Tomato Sauce, Onion, Garlic, Olive Oil, Oregano, Chilli Flakes, Salt, Cheese",
    instructions:
      "Boil the pasta until cooked.\nHeat olive oil in a pan.\nAdd onion and garlic and cook until soft.\nAdd tomato sauce and spices.\nAdd the cooked pasta.\nMix well and top with cheese."
  },
  {
    id: 3,
    name: "Chocolate Cake",
    meal: "Snacks",
    taste: "Sweet",
    cuisine: "Italian",
    diet: "Vegetarian",
    image: "/images/chocolate-cake.jpg",
    popular: true,
    ingredients:
      "Flour, Cocoa Powder, Sugar, Eggs, Milk, Butter, Baking Powder, Vanilla Essence",
    instructions:
      "Mix flour, cocoa powder and baking powder.\nAdd sugar, eggs, milk and butter.\nMix until smooth.\nPour the batter into a baking pan.\nBake until fully cooked.\nAllow the cake to cool before serving."
  },
  {
    id: 4,
    name: "Masala Dosa",
    meal: "Breakfast",
    taste: "Spicy",
    cuisine: "Indian",
    diet: "Vegetarian",
    image: "/images/masala-dosa.jpg",
    popular: true,
    ingredients:
      "Rice, Urad Dal, Potato, Onion, Green Chilli, Mustard Seeds, Curry Leaves, Salt, Oil",
    instructions:
      "Prepare dosa batter using rice and urad dal.\nCook potatoes and prepare the masala filling.\nHeat a dosa pan.\nSpread the batter into a thin circle.\nAdd the potato filling.\nFold the dosa and serve hot."
  },
  {
    id: 5,
    name: "Veg Fried Rice",
    meal: "Lunch",
    taste: "Spicy",
    cuisine: "Chinese",
    diet: "Vegan",
    image: "/images/veg-friedrice.jpg",
    popular: true,
    ingredients:
      "Cooked Rice, Carrot, Beans, Capsicum, Spring Onion, Soy Sauce, Garlic, Pepper, Salt, Oil",
    instructions:
      "Heat oil in a wok.\nAdd garlic and vegetables.\nStir-fry the vegetables on high heat.\nAdd cooked rice.\nAdd soy sauce, pepper and salt.\nMix everything well and serve hot."
  },
  {
    id: 6,
    name: "Mango Smoothie",
    meal: "Breakfast",
    taste: "Sweet",
    cuisine: "Indian",
    diet: "Vegan",
    image: "/images/mango-smoothie.jpg",
    popular: true,
    ingredients:
      "Mango, Plant Milk, Sugar, Ice Cubes",
    instructions:
      "Peel and cut the mango.\nAdd mango pieces to a blender.\nAdd plant milk and sugar.\nAdd ice cubes.\nBlend until smooth.\nServe chilled."
  }
];

export function getRecipes() {
  const savedRecipes = localStorage.getItem("recipes");

  if (savedRecipes) {
    try {
      const parsedRecipes = JSON.parse(savedRecipes);

      if (Array.isArray(parsedRecipes) && parsedRecipes.length > 0) {
        return parsedRecipes.map((recipe) => ({
          ...recipe,
          image:
            recipe.image === "images/fried-rice.jpg" ||
            recipe.image === "/images/fried-rice.jpg"
              ? "/images/veg-friedrice.jpg"
              : recipe.image?.startsWith("/")
                ? recipe.image
                : `/${recipe.image}`
        }));
      }
    } catch (error) {
      console.error("Could not load saved recipes:", error);
    }
  }

  localStorage.setItem("recipes", JSON.stringify(defaultRecipes));

  return defaultRecipes;
}
