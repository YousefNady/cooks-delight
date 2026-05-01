import { useTipsRecipes } from '../../hooks/useTipsRecipes';
import SectionGrid from '../../../../shared/components/SectionGrid/SectionGrid';
import RecipeCard from '../../../../shared/components/RecipeCard/RecipeCard';

const TipsSection = () => {
  const { recipes, loading, error, page, totalPages, nextPage, prevPage } =
    useTipsRecipes();

  return (
    <SectionGrid
      title="TIPS & TRICKS"
      items={recipes}
      columns={3}
      variant="boxed"
      // التعديل هنا: حذفنا columns لأن المكون لا يمررها في renderItem
      renderItem={(recipe) => (
        <RecipeCard recipe={recipe} />
      )}
      pagination={{ 
        page, 
        totalPages, 
        onNext: nextPage, 
        onPrev: prevPage 
      }}
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
    />
  );
};

export default TipsSection;