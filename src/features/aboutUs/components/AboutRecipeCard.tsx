import { Link } from 'react-router-dom';
import type { AboutRecipe } from '../types/about.types';
import './AboutRecipeCard.css';

interface AboutRecipeCardProps {
  recipe: AboutRecipe;
}

const StarRating = ({ rating }: { rating: number }) => (
  <span className="about-recipe-card__stars" aria-label={`Rating: ${rating} out of 5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`about-recipe-card__star${i < Math.round(rating) ? ' about-recipe-card__star--filled' : ''}`}
      >
        ★
      </span>
    ))}
  </span>
);

const AboutRecipeCard = ({ recipe }: AboutRecipeCardProps) => {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <article className="about-recipe-card">

      <div className="about-recipe-card__img-wrapper">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="about-recipe-card__img"
          loading="lazy"
        />
      </div>

      <div className="about-recipe-card__body">
        <h3 className="about-recipe-card__title">{recipe.name}</h3>
        <p className="about-recipe-card__desc">
          {recipe.cuisine} cuisine · {recipe.difficulty} prep ·{' '}
          {recipe.caloriesPerServing} cal/serving
        </p>
        <StarRating rating={recipe.rating} />
        <div className="about-recipe-card__footer">
          <span className="about-recipe-card__meta">
            {totalTime} MIN · {recipe.difficulty.toUpperCase()} PREP · {recipe.servings} SERVES
          </span>
          <Link to={`/recipes/${recipe.id}`} className="about-recipe-card__btn">
            VIEW RECIPE
          </Link>
        </div>
      </div>

    </article>
  );
};

export default AboutRecipeCard;