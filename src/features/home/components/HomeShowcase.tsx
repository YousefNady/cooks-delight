import { useMemo, useState } from "react";
import RecipeCard from "../../../shared/components/RecipeCard/RecipeCard";
import FilterButtons from "../../recipes/components/FilterButtons";
import { useRecipes } from "../../recipes/hooks/useRecipes";
import { useShowMoreRecipes } from "../../recipes/hooks/useShowMoreRecipes";
import { filterRecipes } from "../../recipes/utils/filtre";
import "../../../shared/components/RecipeCard/RecipeCard.css";
import "../../recipes/styles/buttomsShow.css";
import "../styles/HomeShowcase.css";

const INITIAL_VISIBLE_RECIPES = 6;

export default function HomeShowcase() {
  const [selected, setSelected] = useState("All");
  const { recipes, loading, error } = useRecipes("");

  const filteredRecipes = useMemo(
    () => filterRecipes(recipes, selected),
    [recipes, selected]
  );

  const {
    visibleItems: displayedRecipes,
    isExpanded,
    canToggle,
    toggleVisibleItems,
  } = useShowMoreRecipes({
    items: filteredRecipes,
    initialCount: INITIAL_VISIBLE_RECIPES,
    resetKey: selected,
  });

  return (
    <section className="home-showcase" aria-labelledby="home-showcase-heading">
      <div className="home-showcase__intro">
        <p className="home-showcase__tag">RECIPES</p>
        <h2 className="home-showcase__heading" id="home-showcase-heading">
          EMBARK ON A JOURNEY
        </h2>
        <p className="home-showcase__text">
          With our diverse collection of recipes we have something to satisfy every palate.
        </p>
      </div>

      <FilterButtons selected={selected} setSelected={setSelected} />

      {loading && <p className="home-showcase__status">Loading recipes...</p>}

      {error && !loading && (
        <p className="home-showcase__status home-showcase__status--error">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="recipes-grid home-showcase__grid">
            {displayedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {canToggle && (
            <div className="load-more-container">
              <button
                className="toggle-expand-btn"
                onClick={toggleVisibleItems}
                type="button"
              >
                {isExpanded ? "Show Less" : "Show More"}
                <span className={`arrow-icon ${isExpanded ? "up" : "down"}`}>
                  {isExpanded ? "▴" : "▾"}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
