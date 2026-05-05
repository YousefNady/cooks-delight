import { useNavigate } from 'react-router-dom';
import { useFavoritesContext } from '../../../features/profile/context/FavoritesContext';
import { useAuth } from '../../../features/auth/context/useAuth';
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
  const { isAuthenticated } = useAuth();

  const favorited = isFavorited(recipe.id);

  const total = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleFavorite(recipe);
  };

  // Build class list for the heart button
  const heartClass = [
    'recipe-card__heart',
    favorited              ? 'recipe-card__heart--active' : '',
    !isAuthenticated       ? 'recipe-card__heart--locked' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="recipe-card">
      
      <div className="recipe-card__image-wrap">
        <img
          className="recipe-card__image"
          src={recipe.image}
          alt={recipe.name}
        />

        {!hideFavoriteBtn && (
          <div className="recipe-card__heart-wrap">
            <button
              className={heartClass}
              onClick={handleHeartClick}
              aria-label={
                !isAuthenticated
                  ? `Log in to save ${recipe.name} to favorites`
                  : favorited
                  ? `Remove ${recipe.name} from favorites`
                  : `Save ${recipe.name} to favorites`
              }
              aria-pressed={isAuthenticated ? favorited : undefined}
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

            {/* Tooltip — only rendered for guests, shown via CSS on heart-wrap hover */}
            {!isAuthenticated && (
              <span className="recipe-card__heart-tooltip" role="tooltip">
                Log in to save recipes
              </span>
            )}
          </div>
        )}
      </div>

      <div className="recipe-card__content">
        
        <h3 className="recipe-card__title">{recipe.name}</h3>

        <p className="recipe-card__description">
          A delicious {recipe.cuisine || "Special"} recipe with easy step-by-step instructions.
        </p>
        
        <div className="recipe-card__footer">
          <p className="recipe-card__info">
            {hours > 0 && `${hours}H `}{minutes}M · {recipe.difficulty || 'Easy'} PREP · {recipe.servings || 0} SERVES
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

    </div>
  );
}