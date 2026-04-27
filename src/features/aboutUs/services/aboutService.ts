import type { AboutRecipe, AboutRecipesApiResponse } from '../types/about.types';

const BASE_URL = 'https://dummyjson.com/recipes';

export const fetchAboutRecipes = async (): Promise<AboutRecipe[]> => {
  const response = await fetch(`${BASE_URL}?limit=100`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes — HTTP ${response.status}`);
  }

  const data: AboutRecipesApiResponse = await response.json();
  return data.recipes;
};