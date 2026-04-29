import { useEffect, useState } from 'react';
import { fetchAboutRecipes } from '../services/aboutService';
import { usePagination } from '../../../shared/hooks/usePagination';
import type { RecipeCard } from '../../../shared/types/recipe.types';

const PAGE_SIZE = 2;

export const useAboutRecipes = () => {
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
        const data = await fetchAboutRecipes();
        setAllRecipes([...data].sort((a, b) => b.rating - a.rating));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return {
    recipes: paginate(allRecipes), // ← pagination applied here
    loading,
    error,
    page: currentPage,
    totalPages,
    nextPage,
    prevPage,
  };
};