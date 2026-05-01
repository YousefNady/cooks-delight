export interface Recipe {
  id: number;
  name: string;
  image: string;

  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard" | string;

  cuisine: string;
  mealType: string[];

  ingredients: string[];
  instructions: string[];
  reviewCount: number;
  caloriesPerServing?: number;
  tags?: string[];
  rating: number;
}

export interface RecipesApiResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}
