import { useNewestRecipes } from '../../hooks/useNewestRecipes';
import SectionGrid from '../../../../shared/components/SectionGrid/SectionGrid';
import RecipeCard from '../../../../shared/components/RecipeCard/RecipeCard';
const NewestRecipesSection = () => {
  const { recipes, loading, error, page, totalPages, nextPage, prevPage } = useNewestRecipes();

  return (
    
    <SectionGrid
      title="NEWEST RECIPES"
      items={recipes}
      columns={2}
      variant="boxed"
      renderItem={(recipe) => <RecipeCard recipe={recipe}  />}
      pagination={{ page, totalPages, onNext: nextPage, onPrev: prevPage }}
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
    />
  );
};

export default NewestRecipesSection;
