// src/shared/layout/Navbar.tsx

import { NavLink, Link } from 'react-router-dom';
import logo from '../../assets/logo/Logo.svg';
import '../../styles/navbar.css';
import { FiSearch, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import MobileMenu from './Mobilemenu';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar__content">

          {/* Logo Section — unchanged */}
          <Link to="/" className="navbar__logo">
            <img src={logo} alt="Cooks Delight" />
            <div className="navbar__logo-text">
              <span className="navbar__logo-cooks">Cooks</span>
              <span className="navbar__logo-delight">Delight</span>
            </div>
          </Link>

          {/* Navigation Links — unchanged, hidden via CSS on mobile */}
          <ul className="navbar__links">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                }
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/recipes"
                className={({ isActive }) =>
                  isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                }
              >
                RECIPES
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tips"
                className={({ isActive }) =>
                  isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                }
              >
                COOKING TIPS
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                }
              >
                ABOUT US
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                }
              >
                CONTACT
              </NavLink>
            </li>
          </ul>

          {/* Search Section — unchanged, hidden via CSS on mobile */}
          <div className="navbar__search">
            {!isSearchOpen ? (
              <div
                className="navbar__search-btn"
                onClick={() => setIsSearchOpen(true)}
              >
                <FiSearch />
              </div>
            ) : (
              <div className="navbar__search-box">
                <FiSearch
                  className="navbar__search-icon"
                  onClick={() => setIsSearchOpen(false)}
                  style={{ cursor: 'pointer' }}
                />
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

          {/* ── NEW: Hamburger button — visible only on mobile via CSS ── */}
          <button
            className="navbar__hamburger"
            type="button"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu />
          </button>

        </div>
      </nav>

      {/* ── NEW: Mobile menu overlay ── */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
