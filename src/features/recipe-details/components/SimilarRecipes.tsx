import { useMemo, useState } from "react";
import RecipeCard from "../../../shared/components/RecipeCard/RecipeCard";
import type { Recipe } from "../../recipes/types/Recipe";
import "../styles/recipe-details.css";

type Props = {
  recipes: Recipe[];
  currentRecipe: Recipe;
};

const ITEMS_PER_PAGE = 2;

const SimilarRecipesSection = ({ recipes, currentRecipe }: Props) => {
  const [page, setPage] = useState(0);

  const getMealType = (item: Recipe) =>
    Array.isArray(item.mealType) ? item.mealType[0] : item.mealType;

  const similar = useMemo(() => {
    return recipes.filter(
      (r) =>
        r.id !== currentRecipe.id &&
        getMealType(r) === getMealType(currentRecipe)
    );
  }, [recipes, currentRecipe]);

  const start = page * ITEMS_PER_PAGE;
  const paginated = similar.slice(start, start + ITEMS_PER_PAGE);

  const next = () => {
    if ((page + 1) * ITEMS_PER_PAGE < similar.length) {
      setPage((p) => p + 1);
    }
  };

  const prev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  return (
    <section className="similar-recipes">
      <div className="similar-recipes__inner">
        <div className="similar-recipes__header">
          <h2 className="similar-recipes__heading">
            SIMILAR RECIPES
          </h2>

          <div className="similar-recipes__nav">

            {/* LEFT ARROW */}
            <button
              className="similar-recipes__arrow"
              onClick={prev}
              disabled={page === 0}
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* RIGHT ARROW */}
            <button
              className="similar-recipes__arrow"
              onClick={next}
              disabled={(page + 1) * ITEMS_PER_PAGE >= similar.length}
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

          </div>
        </div>

        <div className="similar-recipes__grid">
          {paginated.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default SimilarRecipesSection;