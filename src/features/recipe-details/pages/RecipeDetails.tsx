import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipeById, getRecipes } from "../../recipes/services/API";
import type { Recipe } from "../../recipes/types/Recipe";
import "../styles/recipe-details.css";

import filledStar from "../../../assets/recipe-details/Vector2.svg";
import unfilledStar from "../../../assets/recipe-details/Vector.svg";
import timeIcon from "../../../assets/recipe-details/timer.svg";
import servingsIcon from "../../../assets/recipe-details/servings.svg";
import difficultyIcon from "../../../assets/recipe-details/temp-icon.svg";
import SimilarRecipesSection from "../components/SimilarRecipes";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!id) return;
    getRecipeById(id).then((data) => setRecipe(data ?? null));
    getRecipes().then((data) => setAllRecipes(data.recipes));
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  const totalMinutes = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const tags = recipe?.tags ?? [];

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <img
        key={i}
        src={i < Math.round(rating) ? filledStar : unfilledStar}
        alt={i < Math.round(rating) ? "filled star" : "empty star"}
      />
    ));

  return (
    <>
      {/* ── Main recipe card ── */}
      <div className="recipe-container">

        {/* Header */}
        <div className="recipe-details__header">
          <p className="recipe-details__tag">Recipe</p>

          <h1 className="recipe-name">{recipe.name}</h1>

          <p className="recipe-intro">
            Welcome to Cooks Delight, where culinary dreams come alive! Today,
            we embark on a journey of flavors with a dish that promises to
            elevate your dining experience – our {recipe.name}.
          </p>

          {/* Meta row */}
          <div className="recipe-details__meta">
            <p>
              <img src={timeIcon} alt="Time" className="recipe-details__meta-icon" />
              {hours > 0 ? `${hours} HOUR${hours > 1 ? "S" : ""} - ` : ""}
              {minutes} MINUTES
            </p>
            <span className="separator">•</span>
            <p>
              <img src={difficultyIcon} alt="Difficulty" className="recipe-details__meta-icon" />
              {recipe.difficulty} DIFFICULTY
            </p>
            <span className="separator">•</span>
            <p>
              <img src={servingsIcon} alt="Servings" className="recipe-details__meta-icon" />
              {recipe.servings} SERVES
            </p>
          </div>
        </div>

        {/* Hero image */}
        <img src={recipe.image} alt={recipe.name} className="recipe-img" />

        {/* Rating + tags row */}
        <div className="recipe-details__info">
          <div className="rating-stars">{renderStars(recipe.rating)}</div>

          <span className="separator">•</span>
          <span className="review-count">{recipe.reviewCount} Reviews</span>
          <span className="separator2">•</span>

          <div className="tags">
            {tags.map((tag, index) => (
              <div key={index} className="tag-item">
                <span className="tag">{tag}</span>
                {index !== tags.length - 1 && (
                  <span className="separator2">•</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions heading */}
        <h2 className="recipe-details-heading">Instructions</h2>

        {/* Two-column body */}
        <div className="recipe-details">

          {/* Left: steps + share */}
          <div className="recipe-details__instructions">
            <ol className="steps-list">
              {recipe.instructions.map((step, index) => (
                <li key={index}>
                  <span className="step-title">Step {index + 1})</span>{" "}
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="share-section">
              <p className="share-text">Share</p>
              <div className="story__social">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="story__social-link"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="story__social-link"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="story__social-link"
              >
                <FaYoutube />
              </a>
            </div>
            </div>
          </div>

          {/* Right: sidebar */}
          <div className="recipe-details__side">
            {/* Ingredients */}
            <div className="recipe-details__ingredients">
              <h3 className="ingredients-title">Ingredients</h3>
              <ul className="ingredients-sublist">
                {recipe.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Nutrition */}
            <div className="recipe-details__nutrition">
              <h3 className="nutrition-title">Nutritional Value</h3>
              <p className="nutrition-text">Per serving:</p>
              <p>
                <span className="calories-text">Calories:</span>{" "}
                ~{recipe.caloriesPerServing}
              </p>
            </div>

            <p className="nutrition-text2">
              Note: Nutritional values are approximate and may vary based on
              specific ingredients and portion sizes.
            </p>
          </div>
        </div>
      </div>

      {/* ── Similar recipes (shared component – untouched) ── */}
      <div className="similar-recipes-container">
        <SimilarRecipesSection recipes={allRecipes} currentRecipe={recipe} />
      </div>
    </>
  );
}
