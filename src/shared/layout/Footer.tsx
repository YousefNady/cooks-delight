import { Link } from 'react-router-dom';
import { FaTiktok, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import logo from '../../assets/logo/Logo-white.svg';
import './styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        
        <div className="footer__top">
          {/* Logo Section */}
          <div className="footer__logo">
            <img src={logo} alt="Logo" />
            <div className="footer__logo-text">
              <span className="footer__logo-cooks">Cooks</span>
              <span className="footer__logo-delight">Delight</span>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="footer__links">
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/recipes">RECIPES</Link></li>
            <li><Link to="/tips">COOKING TIPS</Link></li>
            <li><Link to="/about">ABOUT US</Link></li>
            <li><Link to="/contact">CONTACT</Link></li>
          </ul>

          {/* Social Icons */}
          <div className="footer__social-icons">
            <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer"><FaTiktok /></a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer"><FaYoutube /></a>
          </div>
        </div>

        <hr className="footer__divider" />

        <div className="footer__bottom">
          <p>
  COPYRIGHT: © {new Date().getFullYear()} COOKS DELIGHT.
</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;