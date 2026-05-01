// src/shared/layout/Navbar.tsx

import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/Logo.svg';
import '../../styles/navbar.css';
import { FiSearch, FiMenu, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import MobileMenu from './Mobilemenu';
import { useAuth } from '../../features/auth/context/useAuth';  // custom hook to consume AuthContext
import { useRecipeSearch } from '../../features/search/hooks/useRecipeSearch';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const {
    searchTerm,
    handleSearchChange,
    handleSearchSubmit,
  } = useRecipeSearch();

  /*
   * useAuth() reads from React state — not localStorage — so the Navbar
   * re-renders immediately whenever login() or logout() is called anywhere
   * in the app, with no page refresh required.
   */
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();          // clears context state + localStorage atomically
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__content">

          {/* ── Logo ── */}
          <Link to="/" className="navbar__logo">
            <img src={logo} alt="Cooks Delight" />
            <div className="navbar__logo-text">
              <span className="navbar__logo-cooks">Cooks</span>
              <span className="navbar__logo-delight">Delight</span>
            </div>
          </Link>

          {/* ── Nav links ── */}
          <ul className="navbar__links">
            {NAV_LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ── Search ── */}
          <div className="navbar__search">
            {!isSearchOpen ? (
              <div className="navbar__search-btn" onClick={() => setIsSearchOpen(true)}>
                <FiSearch />
              </div>
            ) : (
              <form
                className="navbar__search-box"
                onSubmit={(event) => {
                  handleSearchSubmit(event);
                  setIsSearchOpen(false);
                }}
              >
                <FiSearch
                  className="navbar__search-icon"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={(event) => {
                    event.currentTarget.closest("form")?.requestSubmit();
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <input
                  className="navbar__search-input"
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </form>
            )}
          </div>

          {/* ── Auth actions ── */}
          <div className="navbar__actions">
            {isAuthenticated ? (
              <>
                {/* Profile avatar — links to /profile */}
                <Link
                  to="/profile"
                  className="navbar__profile-link"
                  aria-label={`Go to ${user?.username}'s profile`}
                >
                  <img
                    src={user!.image}
                    alt={`${user!.username}'s avatar`}
                    className="navbar__avatar"
                    onError={(e) => {
                      /*
                       * If DummyJSON avatar 404s (e.g. unknown userId),
                       * fall back to a plain user-icon div inserted after the img.
                       */
                      const img = e.currentTarget;
                      img.style.display = 'none';
                      const fallback = img.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Initials fallback — hidden by default, shown by onError above */}
                  <div className="navbar__avatar-fallback" style={{ display: 'none' }} aria-hidden="true">
                    {user!.username.slice(0, 2).toUpperCase()}
                  </div>
                </Link>

                {/* Logout button */}
                <button
                  type="button"
                  className="navbar__logout-btn"
                  onClick={handleLogout}
                  aria-label="Log out"
                  title="Log out"
                >
                  <FiLogOut aria-hidden="true" />
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar__login-btn">
                Login
              </Link>
            )}
          </div>

          {/* ── Hamburger (mobile) ── */}
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

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

// ─── Static nav config — edit once, renders everywhere ───────────────────────

const NAV_LINKS = [
  { to: '/',        label: 'HOME',         end: true  },
  { to: '/recipes', label: 'RECIPES',      end: false },
  { to: '/tips',    label: 'COOKING TIPS', end: false },
  { to: '/about',   label: 'ABOUT US',     end: false },
  { to: '/contact', label: 'CONTACT',      end: false },
] as const;

export default Navbar;
