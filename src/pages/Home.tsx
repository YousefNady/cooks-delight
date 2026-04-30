import Recipes from "./Recipes";
import "../features/home/style/home.css";
import icon1 from "../assets/home/icon (3).svg";
import icon2 from "../assets/home/icon (4).svg";
import icon3 from "../assets/home/icon (5).svg";
import icon4 from "../assets/home/icon (6).svg";
import icon5 from "../assets/home/icon (7).svg";
import FeaturedRecipesSection from "../features/aboutUs/components/FeaturedRecipesSection";
import { useNavigate } from "react-router-dom";
import AboutUsCard from "../features/home/components/aboutuscard";

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
              className="button button--primary"
              onClick={() => navigate("/register")}
            >
              SIGN UP NOW
            </button>

            <button
              className="button button--secondary"
              onClick={() => navigate("/recipes")}
            >
              EXPLORE RECIPES
            </button>
          </div>

        </div>

      </section>

      {/* ===== PALETTE SECTION ===== */}
      <section className="home-palette">

        <div className="home-palette__content">

          <span className="home-palette__tag">EXPLORE</span>

          <h2 className="home-palette__title">
            OUR DIVERSE <br /> PALETTE
          </h2>

          <p className="home-palette__description">
            If you are a breakfast enthusiast, a connoisseur of savory delights,
            or on the lookout for irresistible desserts, our curated selection
            has something to satisfy every palate.
          </p>

          <button className="button button--outline">
            SEE MORE
          </button>

        </div>

        <div className="home-palette__categories">

          <div className="home-palette__item">
            <img src={icon1} alt="" />
            <span>BREAKFAST</span>
          </div>

          <div className="home-palette__item">
            <img src={icon2} alt="" />
            <span>LUNCH</span>
          </div>

          <div className="home-palette__item">
            <img src={icon3} alt="" />
            <span>DINNER</span>
          </div>

          <div className="home-palette__item">
            <img src={icon4} alt="" />
            <span>DESSERT</span>
          </div>

          <div className="home-palette__item">
            <img src={icon5} alt="" />
            <span>SNACK</span>
          </div>

        </div>

      </section>

      <FeaturedRecipesSection />
      <Recipes />
      <AboutUsCard />
    </div>
  );
}