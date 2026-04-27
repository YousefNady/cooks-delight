import axios from 'axios';
import type { AboutRecipe, AboutRecipesApiResponse } from '../types/about.types';

const BASE_URL = 'https://dummyjson.com/recipes';

export const fetchAboutRecipes = async (): Promise<AboutRecipe[]> => {
  try {
    // Axios automatically parses the JSON response and supports generic types
    const response = await axios.get<AboutRecipesApiResponse>(`${BASE_URL}?limit=100`);
    
    // The parsed data is readily available in response.data
    return response.data.recipes;
  } catch (error) {
    // Log or handle the error gracefully before re-throwing
    console.error("Failed to fetch about recipes:", error);
    throw error;
  }
};