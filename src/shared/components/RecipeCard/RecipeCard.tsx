// src/shared/components/RecipeCard/RecipeCard.tsx

import { useNavigate } from 'react-router-dom';
import { useFavoritesContext } from '../../../features/profile/context/FavoritesContext';
import './RecipeCard.css';

export type RecipeCardType = {
  id: number;
  name: string;
  image: string;
  cuisine?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  difficulty?: string;
  servings?: number;
};

interface RecipeCardProps {
  recipe: RecipeCardType;
  /** Pass true from ProfilePage to hide the heart (avoids redundancy in favorites grid) */
  hideFavoriteBtn?: boolean;
}

export default function RecipeCard({ recipe, hideFavoriteBtn = false }: RecipeCardProps) {
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite } = useFavoritesContext();

  const favorited = isFavorited(recipe.id);

  const total = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the card click / any parent link from firing
    e.stopPropagation();
    toggleFavorite(recipe);
  };

  return (
    <div className="recipe-card">

      {/* ── Image wrapper — needed for absolute-positioned heart ── */}
      <div className="recipe-card__image-wrap">
        <img
          className="recipe-card__image"
          src={recipe.image}
          alt={recipe.name}
        />

        {/* ── Heart button — absolute top-right over image ── */}
        {!hideFavoriteBtn && (
          <button
            className={`recipe-card__heart${favorited ? ' recipe-card__heart--active' : ''}`}
            onClick={handleHeartClick}
            aria-label={favorited ? `Remove ${recipe.name} from favorites` : `Save ${recipe.name} to favorites`}
            aria-pressed={favorited}
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={favorited ? 'currentColor' : 'none'}
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>

      <h3 className="recipe-card__title">{recipe.name}</h3>

      <p className="recipe-card__description">
        A delicious {recipe.cuisine} recipe with easy step-by-step instructions.
      </p>

      <div className="recipe-card__details">
        <p className="recipe-card__info">
          {hours > 0 && `${hours}h `}{minutes}m · {recipe.difficulty} PREP · {recipe.servings} servings
        </p>

        <button
          className="recipe-card__button"
          onClick={() => navigate(`/recipes/${recipe.id}`)}
          type="button"
        >
          View Recipe
        </button>
      </div>

    </div>
  );
}