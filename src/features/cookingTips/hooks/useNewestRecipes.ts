import { useEffect, useState } from 'react';
import { fetchAllRecipes } from '../services/recipesService';
import { usePagination } from '../../../shared/hooks/usePagination';
import type { RecipeCard } from '../../../shared/types/recipe.types';

const PAGE_SIZE = 2;

export const useNewestRecipes = () => {
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
        // Sort by id descending — highest id = newest
        const sorted = [...data].sort((a, b) => b.id - a.id);
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
