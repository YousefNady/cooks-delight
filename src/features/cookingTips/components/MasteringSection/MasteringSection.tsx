import { useMasteringRecipes } from '../../hooks/useMasteringRecipes';
import SectionGrid from '../../../../shared/components/SectionGrid/SectionGrid';
import RecipeCard from '../../../../shared/components/RecipeCard/RecipeCard'; 

const MasteringSection = () => {
  const { recipes, loading, error, page, totalPages, nextPage, prevPage } =
    useMasteringRecipes();

  return (
    <SectionGrid
      title="MASTERING THE BASICS"
      items={recipes}
      columns={3}
      variant="plain"
      renderItem={(recipe) => (
        <RecipeCard recipe={recipe} /> // ← changed
      )}
      pagination={{ page, totalPages, onNext: nextPage, onPrev: prevPage }}
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
    />
  );
};

export default MasteringSection;
