// src/features/profile/hooks/useFavorites.ts

import { useState, useCallback, useEffect } from 'react';
import type { FavoriteRecipe, UseFavoritesReturn } from '../types/favorites';

/**
 * localStorage key — deliberately namespaced to avoid colliding with
 * the auth keys: 'token', 'username', 'userId', 'email'
 */
const STORAGE_KEY = 'cd_favorites';

/** Safely parse JSON from localStorage; returns fallback on any error */
const readStorage = (): FavoriteRecipe[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Persist the current array to localStorage */
const writeStorage = (items: FavoriteRecipe[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota exceeded or private-browsing restriction — fail silently
    console.warn('[useFavorites] Could not write to localStorage.');
  }
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useFavorites = (): UseFavoritesReturn => {
  // Initialise from localStorage on first render only
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>(readStorage);

  // Keep localStorage in sync whenever the array changes
  useEffect(() => {
    writeStorage(favorites);
  }, [favorites]);

  /** O(1) lookup by recipe id */
  const isFavorited = useCallback(
    (id: number): boolean => favorites.some((r) => r.id === id),
    [favorites]
  );

  /**
   * Toggle: if the recipe is already in the list, remove it;
   * otherwise prepend it so the newest favorite appears first.
   */
  const toggleFavorite = useCallback((recipe: FavoriteRecipe): void => {
    setFavorites((prev) => {
      const exists = prev.some((r) => r.id === recipe.id);
      return exists
        ? prev.filter((r) => r.id !== recipe.id)   // remove
        : [recipe, ...prev];                         // prepend
    });
  }, []);

  const clearFavorites = useCallback((): void => {
    setFavorites([]);
  }, []);

  return { favorites, isFavorited, toggleFavorite, clearFavorites };
};