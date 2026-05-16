/**
 * ComponentShowcase.example.tsx
 *
 * A non-production usage reference that shows StatsCard, RecipeCard, and
 * PromotionalCard wired with mock data shaped exactly like the DummyJSON API.
 *
 * Drop any of these into your DashboardPage once you have real API data.
 * All imports use the barrel index of each component.
 */

import React, { useState } from "react";
import StatsCard  from "./StatsCard/StatsCard";
import RecipeCard  from "./RecipeCard/RecipeCardDashboard";
import PromotionalCard  from "./PromotionalCard/PromotionalCard";
import type { DummyJSONRecipe }  from "../../../shared/types/dashboard.types";

// ---------------------------------------------------------------------------
// Shared icon atoms — these would normally live in src/components/icons/
// ---------------------------------------------------------------------------

const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
  </svg>
);

const IconCrown = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const IconCart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 5.9 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.43 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Mock recipe data — shaped exactly like GET /recipes from DummyJSON
// ---------------------------------------------------------------------------

const MOCK_FAVORITE_RECIPES: DummyJSONRecipe[] = [
  {
    id: 1,
    name: "Creamy Garlic Pasta",
    ingredients: ["Pasta", "Garlic", "Cream", "Parmesan"],
    instructions: ["Boil pasta", "Sauté garlic", "Mix cream", "Serve"],
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    caloriesPerServing: 480,
    tags: ["Pasta", "Italian"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/1.webp",
    rating: 4.6,
    reviewCount: 128,
    mealType: ["Dinner"],
  },
  {
    id: 2,
    name: "Honey Glazed Salmon",
    ingredients: ["Salmon", "Honey", "Soy sauce", "Ginger"],
    instructions: ["Mix glaze", "Brush salmon", "Bake 18 min"],
    prepTimeMinutes: 5,
    cookTimeMinutes: 20,
    servings: 2,
    difficulty: "Medium",
    cuisine: "Asian",
    caloriesPerServing: 320,
    tags: ["Seafood", "Healthy"],
    userId: 2,
    image: "https://cdn.dummyjson.com/recipe-images/2.webp",
    rating: 4.8,
    reviewCount: 96,
    mealType: ["Dinner"],
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    ingredients: ["Dark chocolate", "Butter", "Eggs", "Sugar", "Flour"],
    instructions: ["Melt chocolate", "Fold batter", "Bake 12 min"],
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 4,
    difficulty: "Hard",
    cuisine: "French",
    caloriesPerServing: 550,
    tags: ["Desserts", "Chocolate"],
    userId: 3,
    image: "https://cdn.dummyjson.com/recipe-images/3.webp",
    rating: 4.9,
    reviewCount: 211,
    mealType: ["Dessert"],
  },
  {
    id: 4,
    name: "Avocado Quinoa Salad",
    ingredients: ["Quinoa", "Avocado", "Cherry tomatoes", "Lime"],
    instructions: ["Cook quinoa", "Dice avocado", "Toss together"],
    prepTimeMinutes: 15,
    cookTimeMinutes: 0,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Mexican",
    caloriesPerServing: 290,
    tags: ["Salads", "Healthy"],
    userId: 4,
    image: "https://cdn.dummyjson.com/recipe-images/4.webp",
    rating: 4.5,
    reviewCount: 74,
    mealType: ["Lunch"],
  },
];

const MOCK_EXPLORE_RECIPES: DummyJSONRecipe[] = [
  {
    id: 5,
    name: "Roasted Tomato Soup",
    ingredients: ["Tomatoes", "Basil", "Onion", "Cream"],
    instructions: ["Roast tomatoes", "Blend", "Add cream"],
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    caloriesPerServing: 180,
    tags: ["Soup"],
    userId: 5,
    image: "https://cdn.dummyjson.com/recipe-images/5.webp",
    rating: 4.6,
    reviewCount: 128,
    mealType: ["Soup"],
  },
  {
    id: 6,
    name: "Margherita Pizza",
    ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil"],
    instructions: ["Preheat oven", "Assemble pizza", "Bake 15 min"],
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Italian",
    caloriesPerServing: 300,
    tags: ["Pizza", "Italian"],
    userId: 6,
    image: "https://cdn.dummyjson.com/recipe-images/6.webp",
    rating: 4.7,
    reviewCount: 96,
    mealType: ["Dinner"],
  },
  {
    id: 7,
    name: "Quinoa Buddha Bowl",
    ingredients: ["Quinoa", "Chickpeas", "Kale", "Tahini"],
    instructions: ["Cook quinoa", "Roast chickpeas", "Assemble bowl"],
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Mediterranean",
    caloriesPerServing: 420,
    tags: ["Bowl", "Healthy"],
    userId: 7,
    image: "https://cdn.dummyjson.com/recipe-images/7.webp",
    rating: 4.8,
    reviewCount: 112,
    mealType: ["Bowl"],
  },
  {
    id: 8,
    name: "Berry Pancakes",
    ingredients: ["Flour", "Milk", "Eggs", "Mixed berries", "Maple syrup"],
    instructions: ["Mix batter", "Cook on griddle", "Top with berries"],
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 4,
    difficulty: "Easy",
    cuisine: "American",
    caloriesPerServing: 310,
    tags: ["Breakfast", "Pancakes"],
    userId: 8,
    image: "https://cdn.dummyjson.com/recipe-images/8.webp",
    rating: 4.5,
    reviewCount: 80,
    mealType: ["Breakfast"],
  },
];

// ---------------------------------------------------------------------------
// Showcase component
// ---------------------------------------------------------------------------

const ComponentShowcase: React.FC = () => {
  // Favourite toggle state — in production this lives in your global store
  const [favorites, setFavorites] = useState<Set<number>>(new Set([1, 2, 3, 4]));

  const handleFavoriteToggle = (id: number): void => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "28px" }}>

      {/* ── StatsCard row ── */}
      <section>
        <h2 style={{ fontFamily: "Lato, sans-serif", marginBottom: 14, fontSize: 16, color: "#1a1714" }}>
          StatsCard
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          <StatsCard
            icon={<IconHeart />}
            variant="orange"
            value={24}
            label="Saved Recipes"
            helperText="Your favorite recipes"
          />
          <StatsCard
            icon={<IconEye />}
            variant="green"
            value={12}
            label="Recently Viewed"
            helperText="Recipes you explored"
          />
          <StatsCard
            icon={<IconBook />}
            variant="purple"
            value={36}
            label="Recipes Explored"
            helperText="Keep exploring!"
          />
        </div>
      </section>

      {/* ── RecipeCard — favorite mode ── */}
      <section>
        <h2 style={{ fontFamily: "Lato, sans-serif", marginBottom: 14, fontSize: 16, color: "#1a1714" }}>
          RecipeCard — <code>mode="favorite"</code>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
          {MOCK_FAVORITE_RECIPES.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              mode="favorite"
              isFavorite={favorites.has(recipe.id)}
              onFavoriteToggle={handleFavoriteToggle}
              onMenuOpen={(id) => console.log("menu for recipe", id)}
            />
          ))}
        </div>
      </section>

      {/* ── RecipeCard — explore mode ── */}
      <section>
        <h2 style={{ fontFamily: "Lato, sans-serif", marginBottom: 14, fontSize: 16, color: "#1a1714" }}>
          RecipeCard — <code>mode="explore"</code>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
          {MOCK_EXPLORE_RECIPES.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              mode="explore"
              isFavorite={favorites.has(recipe.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      </section>

      {/* ── PromotionalCard column ── */}
      <section>
        <h2 style={{ fontFamily: "Lato, sans-serif", marginBottom: 14, fontSize: 16, color: "#1a1714" }}>
          PromotionalCard
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "300px" }}>
          <PromotionalCard
            variant="orange"
            icon={<IconCrown />}
            title="Try Premium"
            description="Get early access to exclusive recipes and powerful features."
            hasNotificationBadge
            onNotify={() => console.log("notify: premium")}
          />
          <PromotionalCard
            variant="blue"
            icon={<IconStar />}
            title="Leave Reviews"
            description="Share your thoughts and help others discover great recipes."
            hasNotificationBadge
            onNotify={() => console.log("notify: reviews")}
          />
          <PromotionalCard
            variant="green"
            icon={<IconCart />}
            title="Shopping List"
            description="Plan your meals and shop everything in one place."
            hasNotificationBadge
            onNotify={() => console.log("notify: shopping")}
          />
        </div>
      </section>

    </div>
  );
};

export default ComponentShowcase;