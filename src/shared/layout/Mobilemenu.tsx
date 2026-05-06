// src/shared/layout/MobileMenu.tsx

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'; // TikTok removed
import { FiSearch, FiX } from 'react-icons/fi';
import logo from '../../assets/logo/Logo.svg';
import './styles/MobileMenu.css';
import { useRecipeSearch } from '../../shared/hooks/useRecipeSearch';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    searchTerm,
    handleSearchChange,
    handleSearchSubmit,
  } = useRecipeSearch();

  const handleClose = () => {
    setIsSearchOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation" onClick={() => setIsSearchOpen(false)}>

      {/* Header row: logo + close button */}
      <div className="mobile-menu__header" onClick={(e) => e.stopPropagation()}>
        <Link to="/" className="mobile-menu__brand" onClick={handleClose}>
          <img src={logo} alt="Cooks Delight" className="mobile-menu__brand-logo" />
          <div className="mobile-menu__brand-text">
            <span className="mobile-menu__brand-cooks">Cooks</span>
            <span className="mobile-menu__brand-delight">Delight</span>
          </div>
        </Link>

        <button
          className="mobile-menu__close-btn"
          onClick={handleClose}
          aria-label="Close menu"
          type="button"
        >
          <FiX />
        </button>
      </div>

      {/* Nav links */}
      <nav className="mobile-menu__nav">
        <ul className="mobile-menu__links">
          {[
            { to: '/',        label: 'HOME'         },
            { to: '/recipes', label: 'RECIPES'      },
            { to: '/tips',    label: 'COOKING TIPS' },
            { to: '/about',   label: 'ABOUT US'     },
            { to: '/contact', label: 'CONTACT'      },
          ].map(({ to, label }) => (
            <li key={to} className="mobile-menu__link-item">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `mobile-menu__link${isActive ? ' mobile-menu__link--active' : ''}`
                }
                onClick={handleClose}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Search + CTA — single merged pill container */}
      <div className="mobile-menu__actions" onClick={(e) => e.stopPropagation()}>
        <form
          className={`search-wrapper mobile-menu__search-wrapper${isSearchOpen ? ' mobile-menu__search-wrapper--open' : ''}`}
          onSubmit={(event) => {
            handleSearchSubmit(event);
            handleClose();
          }}
        >
          <button
            className="mobile-menu__search-btn"
            type="button"
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            aria-expanded={isSearchOpen}
            onClick={() => setIsSearchOpen((current) => !current)}
          >
            <FiSearch />
          </button>
          {isSearchOpen && (
            <input
              className="mobile-menu__search-input"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus
            />
          )}
        </form>
        {!isSearchOpen && (
          <Link to="/register" className="mobile-menu__cta" onClick={handleClose}>
            SIGN UP NOW!
          </Link>
        )}
      </div>

      {/* Social icons — Facebook, Instagram, YouTube only */}
      <div className="mobile-menu__social" onClick={(e) => e.stopPropagation()}>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
      </div>

    </div>
  );
};

export default MobileMenu;
