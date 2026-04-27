import { Link } from 'react-router-dom';
import StorySection from '../features/aboutUs/components/StorySection';
import GallerySection from '../features/aboutUs/components/GallerySection';
import FeaturedRecipesSection from '../features/aboutUs/components/FeaturedRecipesSection';
import '../features/aboutUs/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about">

      {/* ── HERO ── */}
      <section className="about__hero">
        <div className="about__hero-inner">
          <div className="about__hero-left">
            <h1 className="about__hero-heading">
              WELCOME TO<br />MY CULINARY<br />HAVEN!
            </h1>
          </div>
          <div className="about__hero-right">
            <p className="about__hero-text">
              Bonjour and welcome to the heart of my kitchen! I'm Isabella Russo,
              the culinary enthusiast behind this haven of flavors, Cooks Delight.
              Join me on a gastronomic journey where each dish carries a story,
              and every recipe is a crafted symphony of taste.
            </p>
            <Link to="/recipes" className="about__hero-btn">
              EXPLORE RECIPES
            </Link>
          </div>
        </div>
      </section>

    {/* ── SECTION WRAPPER ── */}
    <div className="about__content-card">
          {/* ── STORY ── */}
          <StorySection />

          {/* ── GALLERY ── */}
          <GallerySection />
    </div>
    
      {/* ── FEATURED RECIPES ── */}
      <FeaturedRecipesSection />

    </div>
  );
};

export default AboutUs;