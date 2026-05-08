// src/shared/layout/Navbar.tsx

import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/Logo.svg';
import './styles/navbar.css';
import { FiSearch, FiMenu, FiLogOut, FiUser, FiHeart, FiChevronDown, FiMic } from 'react-icons/fi';
import { useCallback, useEffect, useRef, useState } from 'react';
import MobileMenu from './Mobilemenu';
import { useAuth } from '../../features/auth/context/useAuth';
import { useRecipeSearch } from '../../shared/hooks/useRecipeSearch';
import { useSpeechRecognition } from '../../shared/hooks/useSpeechRecognition';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen]   = useState(false);
  const [isDropdownOpen,   setIsDropdownOpen]     = useState(false);
  const dropdownRef                               = useRef<HTMLDivElement>(null);
  const navigate                                  = useNavigate();

  const { searchTerm, handleSearchChange, handleSearchSubmit, setSearchTerm } =
    useRecipeSearch();

  const { user, isAuthenticated, logout } = useAuth();

  const handleVoiceResult = useCallback(
    (transcript: string) => setSearchTerm(transcript),
    [setSearchTerm],
  );

  // ── Voice search wired to the navbar's search input ──────────────────────
  const { isListening, voiceError, toggleListening, stop } =
    useSpeechRecognition({
      onResult: handleVoiceResult,
    });

  // Clean up recognition if navbar unmounts
  useEffect(() => () => stop(), [stop]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
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

          {/* ── Voice-enabled search bar ── */}
          <form
            className={`navbar__search-bar${isListening ? ' navbar__search-bar--listening' : ''}`}
            onSubmit={(e) => handleSearchSubmit(e)}
            role="search"
          >
            <FiSearch className="navbar__search-bar-icon" aria-hidden="true" />

            <input
              className="navbar__search-bar-input"
              type="text"
              placeholder="Search recipes, ingredients..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search recipes"
            />

            {/* Mic button */}
            <button
              className={`navbar__search-mic${isListening ? ' navbar__search-mic--listening' : ''}`}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggleListening(searchTerm)}
              aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
              aria-pressed={isListening}
              title={voiceError || undefined}
            >
              <FiMic aria-hidden="true" />
            </button>
          </form>

          {/* ── Auth actions ── */}
          <div className="navbar__actions">
            {isAuthenticated ? (
              /* ── Authenticated: avatar + dropdown ── */
              <div className="navbar__profile" ref={dropdownRef}>
                <button
                  type="button"
                  className="navbar__profile-trigger"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  aria-label="Open profile menu"
                >
                  <img
                    src={user!.image}
                    alt={`${user!.username}'s avatar`}
                    className="navbar__avatar"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.style.display = 'none';
                      const fallback = img.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Initials fallback — hidden by default */}
                  <div
                    className="navbar__avatar-fallback"
                    style={{ display: 'none' }}
                    aria-hidden="true"
                  >
                    {user!.username.slice(0, 2).toUpperCase()}
                  </div>

                  <FiChevronDown
                    className={`navbar__profile-chevron${isDropdownOpen ? ' navbar__profile-chevron--open' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="navbar__dropdown" role="menu">
                    <Link
                      to="/profile"
                      className="navbar__dropdown-item"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiUser aria-hidden="true" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/profile"
                      className="navbar__dropdown-item"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiHeart aria-hidden="true" />
                      <span>Favorites</span>
                    </Link>

                    <button
                      type="button"
                      className="navbar__dropdown-item navbar__dropdown-item--danger"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <FiLogOut aria-hidden="true" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Unauthenticated: Login button ── */
              <Link to="/login" className="navbar__login-btn">
                <FiUser aria-hidden="true" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* ── Hamburger (mobile only) ── */}
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

// ─── Static nav config ────────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: '/',        label: 'Home',     end: true  },
  { to: '/recipes', label: 'Recipes',  end: false },
  { to: '/tips',    label: 'Cooking tips', end: false },
  { to: '/about',   label: 'About us',       end: false },
  { to: '/contact', label: 'Contact',     end: false },
] as const;

export default Navbar;
