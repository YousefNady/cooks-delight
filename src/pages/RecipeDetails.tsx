import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipeById, getRecipes } from "../features/recipes/services/API";
import type { Recipe } from "../features/recipes/types/Recipe";
import "../features/recipe-details/style/recipe-details.css";

import filledStar from "../assets/recipe-details/Vector2.svg";
import unfilledStar from "../assets/recipe-details/Vector.svg";
import timeIcon from "../assets/recipe-details/timer.svg";
import servingsIcon from "../assets/recipe-details/servings.svg";
import difficultyIcon from "../assets/recipe-details/difficulty.svg";
import icon1 from "../assets/recipe-details/icon1.svg";
import icon2 from "../assets/recipe-details/icon2.svg";
import icon3 from "../assets/recipe-details/icon3.svg";
import SimilarRecipesSection from "../features/recipe-details/components/SimilarRecipes";


export default function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const tags = recipe?.tags ?? [];

const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

useEffect(() => {
  if (!id) return;

  getRecipeById(id).then((data) => setRecipe(data));

  getRecipes().then((data) => {
    setAllRecipes(data.recipes);
  });
}, [id]);

if (!recipe) return <p>Loading...</p>;
  if (!recipe) return <p>Loading...</p>;

  // (prep + cook)
  const totalMinutes =
    (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  //  Stars rendering
  const renderStars = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const diff = rating - i;

      if (diff >= 0) {
        stars.push(
          <img
            key={i}
            src={filledStar}
            className="star full"
            alt="star"
          />
        );
      } else {
        stars.push(
          <img
            key={i}
            src={unfilledStar}
            className="star empty"
            alt="star"
          />
        );
      }
    }

    return stars;
  };

  return (
    <>
    <div className="recipe-container">
  <div className="recipe-details__header">
      <h1 className="recipe-name"> {recipe.name}</h1>

      <p className="recipe-intro">
        Welcome to Cooks Delight, where culinary dreams come alive! Today,
        we embark on a journey of flavors with a dish that promises to
        elevate your dining experience – our {recipe.name}.
      </p >
      <div className="recipe-details__meta">
      <p className="recipe-time"><img src={timeIcon} alt="Time" className="recipe-details__meta-icon" /> <span> {hours > 0 && `${hours} HOURS - `} {minutes} MINUTES </span></p>
      <span className="separator">•</span>
      <p><img src={servingsIcon} alt="Servings" className="recipe-details__meta-icon" /> {recipe.servings} <span> Servings</span></p>
      <span className="separator">•</span>
      <p><img src={difficultyIcon} alt="Difficulty" className="recipe-details__meta-icon" /> {recipe.difficulty} <span> Difficulty</span></p>
   </div>

      {/* Image */}
      <img
        src={recipe.image}
        alt={recipe.name}
        className="recipe-img"
      />

      {/* Rating + tags */}
      <div className="recipe-details__info">

        <div className="rating-stars">
          {renderStars(recipe.rating)}
        </div>

        <span className="separator">•</span>

        <span className="review-count">
          {recipe.reviewCount} Reviews
        </span>

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

     </div>


      {/* Instructions + Ingredients */}
      <h2>Instructions</h2>

      <div className="recipe-details">

        <div className="recipe-details__instructions">
          <ol className="steps-list">
            {recipe.instructions.map((step, index) => (
              <li key={index}>
                <span className="step-title">
                  Step {index + 1}
                </span>{" "}
                <span>{step}</span>
              </li>
            ))}
          </ol>
         < div className="share-section">
         <p className="share-text">Share</p>
          <div className="social-icons">
          <img src={icon1} alt="Icon 1" className="facebook-icon" />
          <img src={icon2} alt="Icon 2" className="insta-icon" />
          <img src={icon3} alt="Icon 3" className="youtube-icon" />
          </div>
          </div>
        </div>
         <div className="recipe-details__side">
        <div className="recipe-details__ingredients">
          <h3 className="ingredients-title">Ingredients</h3>
            <ul className="ingredients-sublist">
            {recipe.ingredients.map((item, index) => (
              <li key={index} className="ingredients-item">
            {item}
              </li>
              ))}
           </ul>
          </div>
          <div className="recipe-details__nutrition">
           <h3 className="nutrition-title">Nutritional Value </h3>
           <h4 className="nutrition-text">Per serving:</h4>
            <p><span className="calories-text"> calories:</span> ~ {recipe.caloriesPerServing} </p>
          
        </div>
        <p className="nutrition-text2">Note: Nutritional values are approximate and may vary based on specific ingredients and portion sizes.</p>
        </div>

      </div>
      </div>

  <div className="similar-recipes-container">
        {/* <SimilarRecipes currentRecipeId={recipe.id} /> */ }
       <SimilarRecipesSection
  recipes={allRecipes}
  currentRecipe={recipe}
/>
        </div>
        
          </>
   );
}