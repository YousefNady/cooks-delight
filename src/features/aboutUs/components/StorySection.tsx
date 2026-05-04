import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import '../styles/StorySection.css';
import chefProfileImage from '../../../assets/aboutUs/story/isabella-russo-profile.jpg';

const StorySection = () => {
  return (
    <section className="story">
      <div className="story__inner">

        {/* ── Left: image + follow bar ── */}
        <div className="story__media">
          <div className="story__img-wrapper">
            <img
              src={chefProfileImage}
              alt="Isabella Russo — Chef"
              className="story__img"
              loading="lazy"
            />
          </div>
          <div className="story__follow">
            <span className="story__follow-label">FOLLOW ME</span>
            <div className="story__social">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="story__social-link"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="story__social-link"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="story__social-link"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* ── Right: narrative ── */}
        <div className="story__content">
          <h2 className="story__heading">
            FROM ITALIAN ROOTS TO<br />GLOBAL PALATES
          </h2>
          <p className="story__body">
            Born and raised in the vibrant culinary landscape of Italy, my journey with food
            began in the heart of my family's kitchen. Surrounded by the aroma of fresh herbs,
            the sizzle of pans, and the laughter of loved ones, I developed a deep appreciation
            for the art of cooking. My culinary education took me from the historic streets of
            Rome to the bustling markets of Florence, where I honed my skills and cultivated a
            love for the simplicity and authenticity of Italian cuisine.
          </p>
          <p className="story__body">
            Driven by a relentless curiosity, I embarked on a global culinary exploration,
            seeking inspiration from the rich tapestry of flavors found in kitchens around the
            world. From the spicy markets of Marrakech to the sushi stalls of Tokyo, each
            experience added a unique brushstroke to my culinary canvas.
          </p>
          <p className="story__body">
            Whether you're a seasoned home cook or just starting your culinary adventure,
            I'm delighted to have you here. Let's stir, simmer, and savor the beauty of
            creating something wonderful together.
          </p>
          <p className="story__regards">Warmest regards,</p>
          <p className="story__signature">Isabella Russo</p>
        </div>

      </div>
    </section>
  );
};

export default StorySection;