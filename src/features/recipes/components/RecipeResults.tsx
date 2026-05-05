import RecipeCard from "../../../shared/components/RecipeCard/RecipeCard";
import { useRecipes } from "../hooks/useRecipes";
import { useShowMoreRecipes } from "../hooks/useShowMoreRecipes";
import "../../../shared/components/RecipeCard/RecipeCard.css";
import "../styles/buttomsShow.css";

interface RecipeResultsProps {
  query: string;
}

const INITIAL_VISIBLE_ALL_RECIPES = 9;
const INITIAL_VISIBLE_SEARCH_RESULTS = 12;

export default function RecipeResults({ query }: RecipeResultsProps) {
  const { recipes, total, loading, error } = useRecipes(query);
  const initialVisibleCount = query
    ? INITIAL_VISIBLE_SEARCH_RESULTS
    : INITIAL_VISIBLE_ALL_RECIPES;

  const {
    visibleItems: displayedRecipes,
    isExpanded,
    canToggle,
    toggleVisibleItems,
  } = useShowMoreRecipes({
    items: recipes,
    initialCount: initialVisibleCount,
    resetKey: query,
  });

  const title = query
    ? `DISPLAYING RESULTS FOR: ${query.toUpperCase()}`
    : "ALL RECIPES";

  if (loading) {
    return <p className="recipes-status">Loading recipes...</p>;
  }

  if (error) {
    return <p className="recipes-status recipes-status--error">{error}</p>;
  }

  return (
    <section className="recipes-results" aria-labelledby="recipes-results-heading">
      <div className="recipes-intro">
        <h1 className="recipes-heading" id="recipes-results-heading">
          {title}
        </h1>
        <p className="recipes-count">
          {total} {total === 1 ? "recipe" : "recipes"} found
        </p>
      </div>

      {displayedRecipes.length > 0 ? (
        <div className="recipes-grid">
          {displayedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="recipes-status">No recipes found.</p>
      )}

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
    </section>
  );
}
