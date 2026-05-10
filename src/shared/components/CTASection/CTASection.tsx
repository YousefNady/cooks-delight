// src/shared/components/sections/CTASection.tsx

import { Link } from 'react-router-dom';
import './CTASection.css';
import { useAuth } from '../../../features/auth/context/useAuth';


const CTASection = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-section__content">

        {/* Decorative radial glows — CSS-only, aria-hidden */}
        <span className="cta-section__glow cta-section__glow--left"  aria-hidden="true" />
        <span className="cta-section__glow cta-section__glow--right" aria-hidden="true" />

        <p className="cta-section__eyebrow">SIGN UP</p>

        <h2 className="cta-section__heading" id="cta-heading">
          JOIN THE FUN<br />CREATE ACCOUNT NOW!
        </h2>

        <p className="cta-section__subtext">
          Create an account to save your favorite recipes, share your own
          dishes, and enjoy a personalized cooking experience.
        </p>

        <Link to="/register" className="cta-section__btn">
          SIGN UP
        </Link>

      </div>
    </section>
  );
};

export default CTASection;
