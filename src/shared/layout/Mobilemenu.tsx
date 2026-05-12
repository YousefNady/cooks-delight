// src/shared/layout/MobileMenu.tsx

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import {
  FiLogOut,
  FiX,
  FiHome,
  FiBook,
  FiCoffee,
  FiInfo,
  FiMail,
  FiUser,
  // FiHeart,
  FiSettings,
  FiChevronRight,
} from 'react-icons/fi';
import logo from '../../assets/logo/Logo.svg';
import './styles/MobileMenu.css';
import { useAuth } from '../../features/auth/context/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { to: '/',        label: 'Home',         icon: <FiHome aria-hidden="true" /> },
  { to: '/recipes', label: 'Recipes',       icon: <FiBook aria-hidden="true" /> },
  { to: '/tips',    label: 'Cooking Tips',  icon: <FiCoffee aria-hidden="true" /> },
  { to: '/about',   label: 'About Us',      icon: <FiInfo aria-hidden="true" /> },
  { to: '/contact', label: 'Contact',       icon: <FiMail aria-hidden="true" /> },
];

const ACCOUNT_ITEMS = [
  { to: '/profile',   label: 'My Profile', icon: <FiUser aria-hidden="true" /> },
  // { to: '/profile#favorites-section', label: 'Favorites',  icon: <FiHeart aria-hidden="true" /> },
  { to: '/settings',  label: 'Settings',   icon: <FiSettings aria-hidden="true" /> },
];

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleClose = () => onClose();

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* ── Header ── */}
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
          <FiX aria-hidden="true" />
        </button>
      </div>

      {/* ── User profile card (logged-in only) ── */}
      {isAuthenticated && user && (
        <div className="mobile-menu__profile-card" onClick={(e) => e.stopPropagation()}>
          <Link to="/profile" className="mobile-menu__profile-link" onClick={handleClose}>
            <img
              src={user.image}
              alt={user.username}
              className="mobile-menu__profile-avatar"
            />
            <div className="mobile-menu__profile-info">
              <span className="mobile-menu__profile-name">{user.username}</span>
              <span className="mobile-menu__profile-email">{user.email}</span>
            </div>
            <FiChevronRight className="mobile-menu__profile-arrow" aria-hidden="true" />
          </Link>
        </div>
      )}

      {/* ── Primary navigation ── */}
      <nav className="mobile-menu__nav" aria-label="Primary navigation">
        <ul className="mobile-menu__links">
          {NAV_ITEMS.map(({ to, label, icon }, i) => (
            <li
              key={to}
              className="mobile-menu__link-item"
              style={{ animationDelay: `${0.07 + i * 0.06}s` }}
            >
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `mobile-menu__link${isActive ? ' mobile-menu__link--active' : ''}`
                }
                onClick={handleClose}
              >
                <span className="mobile-menu__link-icon">{icon}</span>
                <span className="mobile-menu__link-label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Account section (logged-in only) ── */}
      {isAuthenticated && user && (
        <div className="mobile-menu__account" onClick={(e) => e.stopPropagation()}>
          <p className="mobile-menu__section-label">Account</p>
          <ul className="mobile-menu__links">
            {ACCOUNT_ITEMS.map(({ to, label, icon }, i) => (
              <li
                key={to}
                className="mobile-menu__link-item"
                style={{ animationDelay: `${0.37 + i * 0.06}s` }}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `mobile-menu__link${isActive ? ' mobile-menu__link--active' : ''}`
                  }
                  onClick={handleClose}
                >
                  <span className="mobile-menu__link-icon">{icon}</span>
                  <span className="mobile-menu__link-label">{label}</span>
                </NavLink>
              </li>
            ))}

            {/* Logout */}
            <li
              className="mobile-menu__link-item"
              style={{ animationDelay: `${0.37 + ACCOUNT_ITEMS.length * 0.06}s` }}
            >
              <button
                className="mobile-menu__link mobile-menu__link--logout"
                onClick={handleLogout}
                type="button"
              >
                <span className="mobile-menu__link-icon">
                  <FiLogOut aria-hidden="true" />
                </span>
                <span className="mobile-menu__link-label">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* ── Bottom CTA (logged-out only) ── */}
      {!isAuthenticated && (
        <div className="mobile-menu__actions" onClick={(e) => e.stopPropagation()}>
          <Link to="/register" className="mobile-menu__cta mobile-menu__cta--primary" onClick={handleClose}>
            <FiUser aria-hidden="true" />
            <span>Sign Up Now</span>
          </Link>
          <Link to="/login" className="mobile-menu__cta mobile-menu__cta--secondary" onClick={handleClose}>
            <span>Login</span>
          </Link>
        </div>
      )}

      {/* ── Social links ── */}
      <div className="mobile-menu__social" onClick={(e) => e.stopPropagation()}>
        <a href="https://facebook.com"  target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://youtube.com"   target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
      </div>
    </div>
  );
};

export default MobileMenu;