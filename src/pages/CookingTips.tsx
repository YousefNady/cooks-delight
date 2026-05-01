import '../features/cookingTips/page/CookingTipsPage.css';
import IntroSection from '../features/cookingTips/components/IntroSection/IntroSection';
import NewestRecipesSection from '../features/cookingTips/components/NewestRecipesSection/NewestRecipesSection';
import MasteringSection from '../features/cookingTips/components/MasteringSection/MasteringSection';
import NourishingSection from '../features/cookingTips/components/NourishingSection/NourishingSection';
import TipsSection from '../features/cookingTips/components/TipsSection/TipsSection';

// Shared CTA — already implemented, reused here
// import CTASection from '../../../shared/components/Sections/CTASection';

const CookingTipsPage = () => {
  return (
    <main className="cooking-tips-page">
      <IntroSection />
      <NewestRecipesSection />
      <MasteringSection />
      <NourishingSection />
      <TipsSection />
      {/* <CTASection /> */}
    </main>
  );
};

export default CookingTipsPage;
