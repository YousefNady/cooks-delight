// src/shared/layout/MobileMenu.tsx

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiLogOut, FiX } from 'react-icons/fi';
import logo from '../../assets/logo/Logo.svg';
import './styles/MobileMenu.css';
import { useAuth } from '../../features/auth/context/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleClose = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="mobile-menu__header" onClick={(event) => event.stopPropagation()}>
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

      <nav className="mobile-menu__nav">
        <ul className="mobile-menu__links">
          {[
            { to: '/', label: 'HOME' },
            { to: '/recipes', label: 'RECIPES' },
            { to: '/tips', label: 'COOKING TIPS' },
            { to: '/about', label: 'ABOUT US' },
            { to: '/contact', label: 'CONTACT' },
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

      <div className="mobile-menu__actions" onClick={(event) => event.stopPropagation()}>
        {isAuthenticated && user ? (
          <div className="mobile-menu__user">
            <Link to="/profile" className="mobile-menu__avatar-link" onClick={handleClose}>
              <img src={user.image} alt={user.username} className="mobile-menu__avatar" />
              <span className="mobile-menu__username">{user.username}</span>
            </Link>
            <button
              className="mobile-menu__logout-btn"
              onClick={handleLogout}
              type="button"
              aria-label="Log out"
            >
              <FiLogOut aria-hidden="true" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <Link to="/register" className="mobile-menu__cta" onClick={handleClose}>
            SIGN UP NOW!
          </Link>
        )}
      </div>

      <div className="mobile-menu__social" onClick={(event) => event.stopPropagation()}>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
      </div>
    </div>
  );
};

export default MobileMenu;
