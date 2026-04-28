import { useEffect, useState } from "react";
import { getRecipes } from "../features/recipes/services/API";
import type { Recipe } from "../features/recipes/types/Recipe";
import { filterRecipes } from "../features/recipes/utils/filtre";
import FilterButtons from "../features/recipes/components/FilterButtons";
import RecipeCard from "../features/recipes/components/RecipeCard";
import "../features/recipes/styles/Card-recipe.css";

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    getRecipes().then((data) => {
      if (data?.recipes) {
        setRecipes(data.recipes);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* Intro */}
      <div className="recipes-intro">
        <p className="recipes-title">Recipes</p>

        <h1 className="recipes-heading">
          Recipes Embark on a journey
        </h1>

        <p className="recipes-text">
          With our diverse collection of recipes we have something to satisfy every palate.
        </p>
      </div>

      {/* Filter */}
      <FilterButtons selected={selected} setSelected={setSelected} />

      {/* Recipes */}
      <div className="recipes-grid">
        {filterRecipes(recipes, selected).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </>
  );
}