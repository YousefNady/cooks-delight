import { Link } from 'react-router-dom';
import type { RecipeCard } from '../types/recipe.types';
import './OverlayCard.css';

interface OverlayCardProps {
  // Accepts RecipeCard directly — image comes from API, no local assets
  recipe: RecipeCard;
}

const OverlayCard = ({ recipe }: OverlayCardProps) => {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  // Use first tag as the overlay badge label
  const tag = recipe.tags?.[0] ?? recipe.cuisine;

  return (
    <article className="overlay-card">
      <div className="overlay-card__img-wrapper">
        <img
          src={recipe.image}       // ← API image URL directly
          alt={recipe.name}
          className="overlay-card__img"
          loading="lazy"
        />
        <div className="overlay-card__gradient" />
      </div>
      <div className="overlay-card__content">
        <span className="overlay-card__tag">{tag}</span>
        <h3 className="overlay-card__title">{recipe.name}</h3>
        <p className="overlay-card__desc">
          {recipe.cuisine} cuisine · {recipe.caloriesPerServing} cal/serving
        </p>
        <div className="overlay-card__footer">
          <span className="overlay-card__meta">
            {totalTime} MIN · {recipe.difficulty.toUpperCase()} · {recipe.servings} SERVES
          </span>
          <Link to={`/recipes/${recipe.id}`} className="overlay-card__btn">
            READ MORE
          </Link>
        </div>
      </div>
    </article>
  );
};

export default OverlayCard;
