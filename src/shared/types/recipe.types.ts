// The base shape every card needs — keep all your existing fields
export interface RecipeCard {
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
}

export interface RecipesApiResponse {
  recipes: RecipeCard[];
  total: number;
  skip: number;
  limit: number;
}
// Your feature-specific types extend this if they need extra fields
// e.g. TipCard might have a `readTimeMinutes` field instead