// src/features/profile/index.ts

export { default as ProfilePage } from './pages/ProfilePage';
export { FavoritesProvider, useFavoritesContext } from './context/FavoritesContext';
export { useFavorites } from './hooks/useFavorites';
export { default as SaveToFavoritesBtn } from './components/SaveToFavoritesBtn';
export type { FavoriteRecipe, UseFavoritesReturn } from './types/favorites';