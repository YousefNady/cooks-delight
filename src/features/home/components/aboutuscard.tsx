import img1 from "../../../assets/home/About us Image.png"
import img2 from "../../../assets/home/Recipe Card (1).png"
import img3 from "../../../assets/home/Recipe Card.png"
import { useNavigate } from "react-router-dom";
import "../style/aboutuscard.css";


export default function AboutUsCard() {
  const navigate = useNavigate();

  return (
    <section className="about-us-section">
    <div className="about-us-card">
        <div className="about-us-card__container">

       
      <div className="about-us-card__left">
        <div className="about-us-card_left-top">
          
        <div className="about-us-card__text">
        <p className="about-us-card__tag">RECIPES</p>
      <h2 className="about-us-card__title">Our Culinary Chronicle</h2>
      <p className="about-us-card__description">
        Our journey is crafted with dedication, creativity, and an unrelenting commitment to delivering delightful culinary experiences. Join us in savoring the essence of every dish and the stories that unfold.
      </p>
<button
  className="button button--primary"
  onClick={() => navigate("/about")}>
  Read More
</button>
      </div>
      <div className="about-us-card__image1">
        <img src={img3} alt="About Us" />
      </div>
    </div>

    <div className="about-us__img2">
      <img src={img2} alt="Recipe Card 2" />
    </div>
       </div>
       <div className="about-us__img3" >
        <img src={img1} alt="Recipe Card" />
       </div>
    </div>
    </div>
    </section>
  );
}