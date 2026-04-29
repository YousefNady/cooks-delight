import { Link } from 'react-router-dom';
import type { RecipeCard as RecipeCardType } from '../../types/recipe.types';
import './RecipeCard.css'; // ← same file, just moved to shared/

interface RecipeCardProps {
  recipe: RecipeCardType;
  size?: 'lg' | 'md'; // ← default lg
}

const StarRating = ({ rating }: { rating: number }) => (
  <span className="recipe-card__stars" aria-label={`Rating: ${rating} out of 5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`recipe-card__star${i < Math.round(rating) ? ' recipe-card__star--filled' : ''}`}
      >
        ★
      </span>
    ))}
  </span>
);

const RecipeCard = ({ recipe, size = 'lg' }: RecipeCardProps) => {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <article className={`recipe-card recipe-card--${size}`}> {/* ← was about-recipe-card */}
      <div className="recipe-card__img-wrapper">
        <img src={recipe.image} alt={recipe.name} className="recipe-card__img" loading="lazy" />
      </div>
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{recipe.name}</h3>
        <p className="recipe-card__desc">
          {recipe.cuisine} cuisine · {recipe.difficulty} prep · {recipe.caloriesPerServing} cal/serving
        </p>
        <StarRating rating={recipe.rating} />
        <div className="recipe-card__footer">
          <span className="recipe-card__meta">
            {totalTime} MIN · {recipe.difficulty.toUpperCase()} PREP · {recipe.servings} SERVES
          </span>
          <Link to={`/recipes/${recipe.id}`} className="recipe-card__btn">
            VIEW RECIPE
          </Link>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;