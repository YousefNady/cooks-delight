import { useEffect, useState } from 'react';
import { fetchAboutRecipes } from '../services/aboutService';
import type { AboutRecipe } from '../types/about.types';

const PAGE_SIZE = 2;

interface UseAboutRecipesReturn {
  recipes: AboutRecipe[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
}

export const useAboutRecipes = (): UseAboutRecipesReturn => {
  const [allRecipes, setAllRecipes] = useState<AboutRecipe[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [page, setPage]             = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const recipes = await fetchAboutRecipes();
        // Sort by rating descending — highest rated first
        const sorted = [...recipes].sort((a, b) => b.rating - a.rating);
        setAllRecipes(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(allRecipes.length / PAGE_SIZE));
  const recipes    = allRecipes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const nextPage   = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage   = () => setPage((p) => Math.max(p - 1, 1));

  return { recipes, loading, error, page, totalPages, nextPage, prevPage };
};