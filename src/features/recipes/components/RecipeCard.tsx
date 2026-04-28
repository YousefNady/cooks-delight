import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types/Recipe";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const navigate = useNavigate();

  const total =
    (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  return (
    <div className="recipe-card">

      <img
        className="recipe-card__image"
        src={recipe.image}
        alt={recipe.name}
      />

      <h3 className="recipe-card__title">{recipe.name}</h3>

      <p className="recipe-card__description">
        A delicious {recipe.cuisine} recipe with easy step-by-step instructions.
      </p>

      <div className="recipe-card__details">
        <p className="recipe-card__info">
          {hours > 0 && `${hours}h `}{minutes}m - {recipe.difficulty} PREP - {recipe.servings} servings
        </p>

        <button
          className="recipe-card__button"
          onClick={() => navigate(`/recipes/${recipe.id}`)}
        >
          View Recipe
        </button>
      </div>

    </div>
  );
}