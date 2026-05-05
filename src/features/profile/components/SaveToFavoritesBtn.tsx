// src/features/profile/components/SaveToFavoritesBtn.tsx

/**
 * A self-contained "Save to Favorites" toggle button for use inside
 * RecipeDetails. Reads and writes through FavoritesContext so its state
 * is always in sync with every <RecipeCard> heart button on the page.
 *
 * Auth guard: guests are redirected to /login on click and see a
 * dimmed, lock-badged button with a tooltip.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useAuth } from '../../auth/context/useAuth';
import type { FavoriteRecipe } from '../types/favorites';
import '../styles/SaveToFavoritesBtn.css';

interface SaveToFavoritesBtnProps {
  recipe: FavoriteRecipe;
}

const SaveToFavoritesBtn: React.FC<SaveToFavoritesBtnProps> = ({ recipe }) => {
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite } = useFavoritesContext();
  const { isAuthenticated } = useAuth();

  const favorited = isFavorited(recipe.id);

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleFavorite(recipe);
  };

  // Build modifier classes
  const btnClass = [
    'save-fav-btn',
    favorited        ? 'save-fav-btn--active' : '',
    !isAuthenticated ? 'save-fav-btn--locked' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="save-fav-btn-wrap">
      <button
        type="button"
        className={btnClass}
        onClick={handleClick}
        aria-pressed={isAuthenticated ? favorited : undefined}
        aria-label={
          !isAuthenticated
            ? `Log in to save ${recipe.name} to favorites`
            : favorited
            ? `Remove ${recipe.name} from favorites`
            : `Save ${recipe.name} to favorites`
        }
      >
        {/* Heart SVG */}
        <svg
          className="save-fav-btn__icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={favorited ? 'currentColor' : 'none'}
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>

        <span className="save-fav-btn__label">
          {!isAuthenticated
            ? 'Log in to Save'
            : favorited
            ? 'Saved to Favorites'
            : 'Save to Favorites'}
        </span>

        {/* Lock badge — visible only for guests */}
        {!isAuthenticated && (
          <svg
            className="save-fav-btn__lock"
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 1 1 6.2 0v2z"/>
          </svg>
        )}
      </button>

      {/* Tooltip — CSS-driven, appears on wrapper hover */}
      {!isAuthenticated && (
        <span className="save-fav-btn__tooltip" role="tooltip">
          Log in to save recipes
        </span>
      )}
    </div>
  );
};

export default SaveToFavoritesBtn;