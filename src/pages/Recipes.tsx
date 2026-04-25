import { useEffect, useState } from "react";
import { getProducts } from "../features/recipes/components/API";
import type { Recipe } from "../features/recipes/types/Recipe";
import { filterRecipes } from "../features/recipes/components/filtre";
import "../styles/Card-recipe.css";

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All"); // ✅ مهم

  useEffect(() => {
    getProducts().then((data: any) => {
      if (data?.recipes) {
        setRecipes(data.recipes);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
        <div className="recipe-intro">
      <p className="title">Recipes</p>
      <h1 className="recipe-intro-heading"> Recipes Embark on a journey </h1>
      <p className="recipe-intro-text">
        With our diverse collection of recipes we have something to satisfy every palate.
      </p> </div>
    <div>
      {/* Buttons */}

      <div className="buttons-container">
        <button className={selected === "All" ? "active" : ""} onClick={() => setSelected("All")}>
          All
        </button>
        <button className={selected === "Breakfast" ? "active" : ""} onClick={() => setSelected("Breakfast")}>
          Breakfast
        </button>
        <button className={selected === "Lunch" ? "active" : ""} onClick={() => setSelected("Lunch")}>
          Lunch
        </button>
        <button className={selected === "Dinner" ? "active" : ""} onClick={() => setSelected("Dinner")}>
          Dinner
        </button>
        <button className={selected === "Snack" ? "active" : ""} onClick={() => setSelected("Snack")}>
          Snack
        </button>
        <button className={selected === "Dessert" ? "active" : ""} onClick={() => setSelected("Dessert")}>
          Dessert
        </button>
        <button className={selected === "Side Dish" ? "active" : ""} onClick={() => setSelected("Side Dish")}>
          Side Dish
        </button>
      </div>

      {/* Recipes */}
        <div className="recipes-grid">
      {filterRecipes(recipes, selected).map((p) => {
        const total = (p.prepTimeMinutes || 0) + (p.cookTimeMinutes || 0);
        const hours = Math.floor(total / 60);
        const minutes = total % 60;

        return (
          <div className="recipe-card-container" key={p.id}>
            <div className="recipe-card">
              <img src={p.image} />
              <h3>{p.name}</h3>

              <p className="description">
                A delicious {p.cuisine} recipe with easy step-by-step instructions.
              </p>
            <div className="recipe-details">
              <p className="details">
                {hours > 0 && `${hours}h `}{minutes}m - {p.difficulty} PREP -{" "}
                {p.servings} servings
              </p>
              <button className="view-recipe-button">View Recipe</button>
            </div>
            </div>
            
          </div>
        );

      })}
      </div>
    </div>
      </>
  );

}