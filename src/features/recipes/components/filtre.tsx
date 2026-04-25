import type { Recipe } from "../types/Recipe";

export function filterRecipes(recipes: Recipe[], selected: string) {
  if (selected === "All") return recipes;

  return recipes.filter((recipe) =>
    recipe.mealType?.includes(selected)
  );
}