import { useAboutRecipes } from '../hooks/useAboutRecipes';
import AboutRecipeCard from './AboutRecipeCard';
import './FeaturedRecipesSection.css';

const FeaturedRecipesSection = () => {
  const { recipes, loading, error, page, totalPages, nextPage, prevPage } = useAboutRecipes();

  return (
    <section className="featured-recipes">
      <div className="featured-recipes__inner">

        <div className="featured-recipes__header">
          <h2 className="featured-recipes__heading">FEATURED RECIPES</h2>
          <div className="featured-recipes__nav">
            <button
              className="featured-recipes__arrow"
              onClick={prevPage}
              disabled={page === 1}
              aria-label="Previous recipes"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              className="featured-recipes__arrow"
              onClick={nextPage}
              disabled={page === totalPages}
              aria-label="Next recipes"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {loading && (
          <div className="featured-recipes__loading">
            <div className="featured-recipes__spinner" />
            <p>Loading recipes...</p>
          </div>
        )}

        {error && (
          <div className="featured-recipes__error">
            <p>⚠️ {error}</p>
            <button
              className="featured-recipes__retry"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="featured-recipes__grid">
            {recipes.map((recipe) => (
              <AboutRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedRecipesSection;