import { useNourishingRecipes } from '../../hooks/useNourishingRecipes';
import SectionGrid from '../../../../shared/components/SectionGrid/SectionGrid';
import OverlayCard from '../../../../shared/OverlayCard/OverlayCard';

const NourishingSection = () => {
  const { recipes, loading, error, page, totalPages, nextPage, prevPage } =
    useNourishingRecipes();

  return (
    <SectionGrid
      title="NOURISHING EVERY PALATE"
      items={recipes}
      columns={3}
      variant="boxed"
      renderItem={(recipe) => <OverlayCard recipe={recipe} />}
      pagination={{ page, totalPages, onNext: nextPage, onPrev: prevPage }}
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
    />
  );
};

export default NourishingSection;
