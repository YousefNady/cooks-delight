import { useEffect, useState } from 'react';
import { fetchAllRecipes } from '../services/recipesService';
import { usePagination } from '../../../shared/hooks/usePagination';
import type { RecipeCard } from '../../../shared/types/recipe.types';

const PAGE_SIZE = 3;

// Tags that represent "nourishing / dietary" recipes
const NOURISHING_TAGS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'low-carb',
  'healthy',
  'dairy-free',
  'salad',
  'soup',
  'smoothie',
];

const isNourishing = (recipe: RecipeCard): boolean =>
  recipe.tags.some((tag) =>
    NOURISHING_TAGS.some((t) => tag.toLowerCase().includes(t))
  );

export const useNourishingRecipes = () => {
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

        // Filter to nourishing/dietary recipes; fall back to all if not enough
        let filtered = data.filter(isNourishing);
        if (filtered.length < PAGE_SIZE) filtered = data;

        // Sort by rating descending — best nourishing recipes first
        const sorted = [...filtered].sort((a, b) => b.rating - a.rating);
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
