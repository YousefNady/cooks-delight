import '../styles/CookingTipsPage.css';
import IntroSection from '../components/IntroSection/IntroSection';
import NewestRecipesSection from '../components/NewestRecipesSection/NewestRecipesSection';
import MasteringSection from '../components/MasteringSection/MasteringSection';
import NourishingSection from '../components/NourishingSection/NourishingSection';
import TipsSection from '../components/TipsSection/TipsSection';

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
