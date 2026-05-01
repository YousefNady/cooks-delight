import { useEffect, useState } from "react";
import { getRecipes } from "../services/API";
import type { Recipe, RecipesApiResponse } from "../types/Recipe";

interface UseRecipesReturn {
  recipes: Recipe[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function useRecipes(query: string): UseRecipesReturn {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const data: RecipesApiResponse = await getRecipes(query);

        if (!isMounted) return;

        setRecipes(data.recipes);
        setTotal(data.total);
      } catch {
        if (!isMounted) return;

        setRecipes([]);
        setTotal(0);
        setError("We could not load recipes right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadRecipes();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return { recipes, total, loading, error };
}
