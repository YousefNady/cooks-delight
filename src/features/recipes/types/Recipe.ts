export type Recipe = {
  id: number;
  name: string;
  image: string;

  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;

  cuisine: string;
  mealType: string[];

  ingredients: string[];
  instructions: string[];
reviewCount: number;
  caloriesPerServing?: number;
  tags?: string[];
  rating: number;
};