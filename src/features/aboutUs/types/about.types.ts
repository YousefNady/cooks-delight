export interface AboutRecipe {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  mealType: string;
}

export interface AboutRecipesApiResponse {
  recipes: AboutRecipe[];
  total: number;
  skip: number;
  limit: number;
}