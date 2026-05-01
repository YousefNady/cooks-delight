// src/features/profile/context/FavoritesContext.tsx

/**
 * Why a context?
 * ─────────────────────────────────────────────────────────────
 * Both <RecipeCard> (used in many places) and <RecipeDetails> need the
 * SAME favorites array. If each called useFavorites() independently they
 * would each hold their own copy of the state and writes in one component
 * would not re-render the other — even though localStorage is always
 * consistent. A single context instance solves this with zero prop drilling.
 */

import React, { createContext, useContext } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import type { UseFavoritesReturn } from '../types/favorites';

const FavoritesContext = createContext<UseFavoritesReturn | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const favoritesValue = useFavorites();

  return (
    <FavoritesContext.Provider value={favoritesValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

// ─── Consumer hook ────────────────────────────────────────────────────────────

export const useFavoritesContext = (): UseFavoritesReturn => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error(
      'useFavoritesContext must be used inside <FavoritesProvider>. ' +
      'Wrap your app root (or router) with <FavoritesProvider>.'
    );
  }
  return ctx;
};