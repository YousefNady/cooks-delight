// src/features/auth/layouts/AuthLayout.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './AuthLayout.css';

import logo from '../../../assets/logo/Logo.svg';

interface AuthLayoutProps {
  /** The food/kitchen image shown in the left panel */
  imageSrc?: string;
  /** alt text for the left panel (decorative, hidden from screen readers) */
  imageAlt?: string;
  /** Form content rendered in the right panel */
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  imageSrc,
  children,
}) => {
  return (
    <div className="auth-layout">

      {/* ── Navbar ── */}
      <header className="auth-layout__navbar">
        <Link to="/" className="auth-layout__brand">
          <img
            src={logo}
            alt="Cooks Delight logo"
            className="auth-layout__brand-logo"
          />
          <div className="auth-layout__brand-text">
            <span className="auth-layout__brand-cooks">Cooks</span>
            <span className="auth-layout__brand-delight">Delight</span>
          </div>
        </Link>

        {/* Hamburger — mobile only */}
        <button
          className="auth-layout__menu-btn"
          type="button"
          aria-label="Open menu"
          onClick={() => console.log('Menu clicked')}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18L20 18" stroke="#262522" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12L20 12" stroke="#262522" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 6L20 6"   stroke="#262522" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* ── Card ── */}
      <main className="auth-layout__card">

        {/* Left — image panel (optional, hidden on mobile) */}
        {imageSrc && (
          <div
            className="auth-layout__image-panel"
            style={{ backgroundImage: `url(${imageSrc})` }}
            aria-hidden="true"
          />
        )}

        {/* Right — form slot */}
        <div className="auth-layout__form-panel">
          {children}
        </div>

      </main>
    </div>
  );
};

export default AuthLayout;
