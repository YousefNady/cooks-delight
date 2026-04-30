import axios from 'axios';
import type { RecipeCard, RecipesApiResponse } from '../../shared/types/recipe.types';

const BASE_URL = 'https://dummyjson.com/recipes';

// Fetches all available recipes once.
// All section hooks derive their slice from this single call.
export const fetchAllRecipes = async (): Promise<RecipeCard[]> => {
  const response = await axios.get<RecipesApiResponse>(`${BASE_URL}?limit=0`);
  return response.data.recipes;
};
