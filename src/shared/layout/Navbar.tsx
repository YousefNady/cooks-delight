import { NavLink, Link } from 'react-router-dom';
import logo from '../../assets/logo/logo.svg';  
import '../../styles/navbar.css';
import { FiSearch } from 'react-icons/fi'; 
import { useState } from 'react';

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
  return (
    <nav className="navbar">
      <div className="navbar__content">
        
        {/* Logo Section */}
        <Link to="/" className="navbar__logo">
          <img src={logo} alt="Cooks Delight" />
          <div className="navbar__logo-text">
            <span className="navbar__logo-cooks">Cooks</span>
            <span className="navbar__logo-delight">Delight</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className="navbar__links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink to="/recipes" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
              RECIPES
            </NavLink>
          </li>
          <li>
            <NavLink to="/tips" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
              COOKING TIPS
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
              ABOUT US
            </NavLink>
          </li>
        </ul>

        {/* Search Section */}
        <div className="navbar__search">
          {!isSearchOpen ? (
            <div className="navbar__search-btn" onClick={() => setIsSearchOpen(true)}>
              <FiSearch />
            </div>
          ) : (
            <div className="navbar__search-box">
              <FiSearch className="navbar__search-icon" onClick={() => setIsSearchOpen(false)} style={{cursor: 'pointer'}} />
              <input 
                className="navbar__search-input"
                type="text" 
                placeholder="Search..." 
                autoFocus 
                onBlur={() => setIsSearchOpen(false)} 
              /> 
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;