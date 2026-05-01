import { useEffect, useState } from 'react';
import { fetchAllRecipes } from '../services/recipesService';
import { usePagination } from '../../../shared/hooks/usePagination';
import type { RecipeCard } from '../../../shared/types/recipe.types';

const PAGE_SIZE = 6;

export const useTipsRecipes = () => {
  const [allRecipes, setAllRecipes] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentPage, totalPages, paginate, nextPage, prevPage } =
    usePagination<RecipeCard>({ totalItems: allRecipes.length, pageSize: PAGE_SIZE });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllRecipes();
        // Sort by rating descending — highest rated = best "tips" showcase
        const sorted = [...data].sort((a, b) => b.rating - a.rating);
        setAllRecipes(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipes.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return {
    recipes: paginate(allRecipes),
    loading,
    error,
    page: currentPage,
    totalPages,
    nextPage,
    prevPage,
  };
};
