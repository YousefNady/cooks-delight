import { useAboutRecipes } from '../../../shared/hooks/useAboutRecipes';
import RecipeCard from '../../../shared/components/RecipeCard/RecipeCard';
import "../../../features/recipe-details/styles/similar-Recipes.css";

const FeaturedRecipesSection = () => {
  const {
    recipes,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage
  } = useAboutRecipes();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <section className="similar-recipes">
      <div className="similar-recipes__inner">

        {/* HEADER */}
        <div className="similar-recipes__header">
          <h2 className="similar-recipes__heading">
            FEATURED RECIPES
          </h2>

          <div className="similar-recipes__nav">

            {/* PREV */}
            <button
              className="similar-recipes__arrow"
              onClick={prevPage}
              disabled={page === 1}
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* NEXT */}
            <button
              className="similar-recipes__arrow"
              onClick={nextPage}
              disabled={page === totalPages - 1}
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

          </div>
        </div>

        {/* GRID */}
        <div className="similar-recipes__grid">

          {recipes.map((recipe) => (
            <div key={recipe.id} className="featured-card-wrapper">

              <RecipeCard recipe={recipe} />

              {/* ⭐ Rating ONLY in Featured */}
              {recipe.rating !== undefined && (
                <div className="featured-rating">
                  ⭐ {recipe.rating.toFixed(1)}
                </div>
              )}

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default FeaturedRecipesSection;