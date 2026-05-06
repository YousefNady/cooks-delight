import "../features/home/style/home.css";
import FeaturedRecipesSection from "../features/aboutUs/components/FeaturedRecipesSection";
import { useNavigate } from "react-router-dom";
import AboutUsCard from "../features/home/components/aboutuscard";
import HomeShowcase from "../features/home/components/HomeShowcase";
import DiversePalette from "../features/home/components/DiversePalette";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* ===== HERO ===== */}
      <section className="home-hero">

        <div className="home-hero__content">

          <h1 className="home-hero__title">
            UNLEASH CULINARY <br /> EXCELLENCE
          </h1>

          <p className="home-hero__description">
            Explore a world of flavors, discover handcrafted recipes,
            and let the aroma of our passion for cooking fill your kitchen.
          </p>

          <div className="home-hero__actions">
            <button
              className="hero-signin-button"
              onClick={() => navigate("/register")}
            >
              SIGN UP NOW
            </button>

            <button
              className="hero-button--secondary"
              onClick={() => navigate("/recipes")}
            >
              EXPLORE RECIPES
            </button>
          </div>

        </div>

      </section>

      <DiversePalette />

      <FeaturedRecipesSection />
      <HomeShowcase />
      <AboutUsCard />
    </div>
  );
}
