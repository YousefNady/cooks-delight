import { useEffect, useState } from "react";
import { getRecipes } from "../features/recipes/services/API";
import type { Recipe } from "../features/recipes/types/Recipe";
import { filterRecipes } from "../features/recipes/utils/filtre";
import FilterButtons from "../features/recipes/components/FilterButtons";
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

      {/* Filter Buttons */}
      <FilterButtons selected={selected} setSelected={setSelected} />

      {/* Recipes */}
      <div className="recipes-grid">
        {filterRecipes(recipes, selected).map((p) => {
          const total = (p.prepTimeMinutes || 0) + (p.cookTimeMinutes || 0);
          const hours = Math.floor(total / 60);
          const minutes = total % 60;

          return (
            <div className="recipe-card" key={p.id}>
              
              <img className="recipe-card__image" src={p.image} />

              <h3 className="recipe-card__title">{p.name}</h3>

              <p className="recipe-card__description">
                A delicious {p.cuisine} recipe with easy step-by-step instructions.
              </p>

              <div className="recipe-card__details">
                <p className="recipe-card__info">
                  {hours > 0 && `${hours}h `}{minutes}m - {p.difficulty} PREP - {p.servings} servings
                </p>

                <button className="recipe-card__button">
                  View Recipe
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </>
  );
}