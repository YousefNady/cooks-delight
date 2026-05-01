import api from "../components/Get-recipe";
import type { Recipe, RecipesApiResponse } from "../types/Recipe";

const VALID_DUMMYJSON_TAGS = ["lunch", "dinner", "dessert", "snack"];
const EMPTY_RECIPES_RESPONSE: RecipesApiResponse = {
  recipes: [],
  total: 0,
  skip: 0,
  limit: 0,
};

function capitalizeTag(tag: string) {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

export async function getRecipes(query = ""): Promise<RecipesApiResponse> {
  const normalizedQuery = query.trim().toLowerCase();
  const isBreakfast = normalizedQuery === "breakfast";
  const isValidTag = VALID_DUMMYJSON_TAGS.includes(normalizedQuery);
  const endpoint = isValidTag
    ? `/recipes/tag/${encodeURIComponent(capitalizeTag(normalizedQuery))}`
    : normalizedQuery
      ? "/recipes/search"
      : "/recipes";

  try {
    const res = await api.get<RecipesApiResponse>(endpoint, {
      params:
        normalizedQuery && (!isValidTag || isBreakfast)
          ? { q: isBreakfast ? "pancake" : normalizedQuery }
          : undefined,
    });

    return res.data;
  } catch {
    return EMPTY_RECIPES_RESPONSE;
  }
}

export async function getRecipeById(id: string | undefined): Promise<Recipe | undefined> {
  try {
    const res = await api.get<Recipe>(`/recipes/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
