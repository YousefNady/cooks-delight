// src/features/profile/types/favorites.ts

import type { RecipeCardType } from '../../../shared/components/RecipeCard/RecipeCard';

/** The shape stored in localStorage — identical to RecipeCardType */
export type FavoriteRecipe = RecipeCardType;

export interface UseFavoritesReturn {
  favorites: FavoriteRecipe[];
  isFavorited: (id: number) => boolean;
  toggleFavorite: (recipe: FavoriteRecipe) => void;
  clearFavorites: () => void;
}