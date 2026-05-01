import api from "../components/Get-recipe";
import type { Recipe, RecipesApiResponse } from "../types/Recipe";

export async function getRecipes(query = ""): Promise<RecipesApiResponse> {
  const trimmedQuery = query.trim();
  const endpoint = trimmedQuery ? "/recipes/search" : "/recipes";
  const res = await api.get<RecipesApiResponse>(endpoint, {
    params: trimmedQuery ? { q: trimmedQuery } : undefined,
  });

  return res.data;
}

export async function getRecipeById(id: string | undefined): Promise<Recipe | undefined> {
  try {
    const res = await api.get<Recipe>(`/recipes/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
