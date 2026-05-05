import api from "../../../shared/lib/apiClient";
import type { Recipe, RecipesApiResponse } from "../types/Recipe";

const VALID_MEAL_TYPES = ["breakfast", "breakfest", "lunch", "dinner", "dessert", "snack","side dish", "appetizer", "beverage "];

const EMPTY_RECIPES_RESPONSE: RecipesApiResponse = {
  recipes: [],
  total: 0,
  skip: 0,
  limit: 0,
};

export async function getRecipes(query = ""): Promise<RecipesApiResponse> {
  const normalizedQuery = query.trim().toLowerCase();
  
  const isMealType = VALID_MEAL_TYPES.includes(normalizedQuery);
  
  const mealTypeQuery = normalizedQuery === "breakfest" ? "breakfast" : normalizedQuery;

  const endpoint = isMealType
    ? `/recipes/meal-type/${mealTypeQuery}`
    : normalizedQuery
      ? "/recipes/search"
      : "/recipes";

  try {
    const res = await api.get<RecipesApiResponse>(endpoint, {
      params: (!isMealType && normalizedQuery) 
        ? { q: normalizedQuery } 
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