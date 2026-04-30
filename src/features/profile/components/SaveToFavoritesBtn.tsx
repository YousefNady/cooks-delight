// src/features/profile/components/SaveToFavoritesBtn.tsx

/**
 * A self-contained "Save to Favorites" toggle button for use inside
 * RecipeDetails. Reads and writes through FavoritesContext so its state
 * is always in sync with every <RecipeCard> heart button on the page.
 */

import React from 'react';
import { useFavoritesContext } from '../context/FavoritesContext';
import type { FavoriteRecipe } from '../types/favorites';
import './SaveToFavoritesBtn.css';

interface SaveToFavoritesBtnProps {
  recipe: FavoriteRecipe;
}

const SaveToFavoritesBtn: React.FC<SaveToFavoritesBtnProps> = ({ recipe }) => {
  const { isFavorited, toggleFavorite } = useFavoritesContext();
  const favorited = isFavorited(recipe.id);

  return (
    <button
      type="button"
      className={`save-fav-btn${favorited ? ' save-fav-btn--active' : ''}`}
      onClick={() => toggleFavorite(recipe)}
      aria-pressed={favorited}
      aria-label={
        favorited ? `Remove ${recipe.name} from favorites` : `Save ${recipe.name} to favorites`
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
        {favorited ? 'Saved to Favorites' : 'Save to Favorites'}
      </span>
    </button>
  );
};

export default SaveToFavoritesBtn;