import { useEffect, useState } from 'react';
import { fetchAllRecipes } from '../services/recipesService';
import { usePagination } from '../../../shared/hooks/usePagination';
import type { RecipeCard } from '../../../shared/types/recipe.types';

// Shows recipes sorted by difficulty (Easy → Medium → Hard)
// Represents "mastering" progression from basic to advanced
const PAGE_SIZE = 6;

const DIFFICULTY_ORDER: Record<string, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

export const useMasteringRecipes = () => {
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
        // Sort Easy → Medium → Hard to represent skill progression
        const sorted = [...data].sort(
          (a, b) =>
            (DIFFICULTY_ORDER[a.difficulty] ?? 2) - (DIFFICULTY_ORDER[b.difficulty] ?? 2)
        );
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
