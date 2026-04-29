import axios from 'axios';
import type { RecipeCard, RecipesApiResponse  } from '../../../shared/types/recipe.types';

const BASE_URL = 'https://dummyjson.com/recipes';

export const fetchAboutRecipes = async (): Promise<RecipeCard[]> => {
  try {
    // Axios automatically parses the JSON response and supports generic types
    const response = await axios.get<RecipesApiResponse>(`${BASE_URL}?limit=100`);
    
    // The parsed data is readily available in response.data
    return response.data.recipes;
  } catch (error) {
    // Log or handle the error gracefully before re-throwing
    console.error("Failed to fetch about recipes:", error);
    throw error;
  }
};