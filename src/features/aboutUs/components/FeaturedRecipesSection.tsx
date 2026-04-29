import { useAboutRecipes } from '../hooks/useAboutRecipes';
import SectionGrid from '../../../shared/components/SectionGrid/SectionGrid';
import RecipeCard from '../../../shared/components/RecipeCard/RecipeCard';

const FeaturedRecipesSection = () => {
  const { recipes, loading, error, page, totalPages, nextPage, prevPage } = useAboutRecipes();

  return (
    <SectionGrid
      title="FEATURED RECIPES"
      items={recipes}
      renderItem={(recipe) => <RecipeCard key={recipe.id} recipe={recipe} />}
      pagination={{ page, totalPages, onNext: nextPage, onPrev: prevPage }}
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
    />
  );
};

export default FeaturedRecipesSection;