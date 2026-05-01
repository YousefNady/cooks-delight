import { useNavigate } from "react-router-dom";
import iconBreakfast from "../../../assets/home/Icon (3).svg";
import iconLunch from "../../../assets/home/Icon (4).svg";
import iconDinner from "../../../assets/home/Icon (5).svg";
import iconDessert from "../../../assets/home/Icon (6).svg";
import iconSnack from "../../../assets/home/Icon (7).svg";

const categories = [
  { name: "Breakfast", icon: iconBreakfast },
  { name: "Lunch", icon: iconLunch },
  { name: "Dinner", icon: iconDinner },
  { name: "Dessert", icon: iconDessert },
  { name: "Snack", icon: iconSnack },
];

export default function DiversePalette() {
  const navigate = useNavigate();

  const goToCategory = (category: string) => {
    navigate(`/recipes?q=${encodeURIComponent(category)}`);
  };

  return (
    <section className="home-palette" aria-labelledby="home-palette-heading">
      <div className="home-palette__content">
        <span className="home-palette__tag">EXPLORE</span>

        <h2 className="home-palette__title" id="home-palette-heading">
          OUR DIVERSE <br /> PALETTE
        </h2>

        <p className="home-palette__description">
          If you are a breakfast enthusiast, a connoisseur of savory delights,
          or on the lookout for irresistible desserts, our curated selection
          has something to satisfy every palate.
        </p>

        <button
          className="button button--outline"
          onClick={() => navigate("/recipes")}
          type="button"
        >
          SEE MORE
        </button>
      </div>

      <div className="home-palette__categories">
        {categories.map((category) => (
          <button
            className="home-palette__item"
            key={category.name}
            onClick={() => goToCategory(category.name)}
            type="button"
          >
            <img src={category.icon} alt="" aria-hidden="true" />
            <span>{category.name.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
