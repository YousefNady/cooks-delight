import React from "react";
import "./Sidebar.css";

// ---------------------------------------------------------------------------
// Icon sub-components (inline SVGs — no external icon-lib dependency)
// ---------------------------------------------------------------------------

const IconHome: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const IconHeart: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconUser: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const IconSettings: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a6.97 6.97 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.37 1.04.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 0 0-.12-.61l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

const IconStar: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const IconCrown: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);

const IconCart: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 5.9 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.43 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const IconLogout: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

const IconChef: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 13h2l2 6 4-12 3 8 2-4h5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Navigation config — typed literals for type-safe activeNavId
// ---------------------------------------------------------------------------

export type NavId =
  | "dashboard"
  | "favorites"
  | "profile"
  | "settings"
  | "reviews"
  | "premium-plans"
  | "shopping-list";

interface NavItem {
  id: NavId;
  label: string;
  icon: React.ReactElement;
}

const PRIMARY_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard",  icon: <IconHome /> },
  { id: "favorites", label: "Favorites",  icon: <IconHeart /> },
  { id: "profile",   label: "My Profile", icon: <IconUser /> },
  { id: "settings",  label: "Settings",   icon: <IconSettings /> },
];

const COMING_SOON_NAV: NavItem[] = [
  { id: "reviews",       label: "Reviews",       icon: <IconStar /> },
  { id: "premium-plans", label: "Premium Plans",  icon: <IconCrown /> },
  { id: "shopping-list", label: "Shopping List",  icon: <IconCart /> },
];

// ---------------------------------------------------------------------------
// Props interface
// ---------------------------------------------------------------------------

export interface SidebarProps {
  /** The id of the currently active navigation item */
  activeNavId?: NavId;
  /** Fired when the user clicks a primary nav item */
  onNavChange?: (id: NavId) => void;
  /** Fired when the user clicks the Logout button */
  onLogout?: () => void;
  /** Fired when the user clicks "Upgrade Plans" */
  onUpgrade?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Sidebar: React.FC<SidebarProps> = ({
  activeNavId = "dashboard",
  onNavChange = () => {},
  onLogout = () => {},
  onUpgrade = () => {},
}) => {
  return (
    <aside className="sidebar">

      {/* ── Logo ── */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#F97316" />
            <path
              d="M12 26c0-4.4 3.6-8 8-8s8 3.6 8 8"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="15" r="3.5" fill="#fff" />
            <path
              d="M20 10v2M15.5 11.5l1.2 1.2M24.5 11.5l-1.2 1.2"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="sidebar__logo-text">
          Cooks<br />Delight
        </span>
      </div>

      {/* ── Primary navigation ── */}
      <nav className="sidebar__nav" aria-label="Main navigation">
        <ul className="sidebar__nav-list" role="list">
          {PRIMARY_NAV.map(({ id, label, icon }) => (
            <li key={id}>
              <button
                className={[
                  "sidebar__nav-item",
                  activeNavId === id ? "sidebar__nav-item--active" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => onNavChange(id)}
                aria-current={activeNavId === id ? "page" : undefined}
                type="button"
              >
                <span className="sidebar__nav-item-icon">{icon}</span>
                <span className="sidebar__nav-item-label">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Coming Soon section ── */}
      <p className="sidebar__section-label" aria-hidden="true">Coming Soon</p>

      <nav className="sidebar__nav sidebar__nav--secondary" aria-label="Coming soon features">
        <ul className="sidebar__nav-list" role="list">
          {COMING_SOON_NAV.map(({ id, label, icon }) => (
            <li key={id}>
              {/* div is intentional: these items are not interactive */}
              <div
                className="sidebar__nav-item sidebar__nav-item--disabled"
                aria-disabled="true"
                role="listitem"
              >
                <span className="sidebar__nav-item-icon">{icon}</span>
                <span className="sidebar__nav-item-label">{label}</span>
                <span className="sidebar__nav-item-badge">Soon</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Premium upgrade card ── */}
      <div className="sidebar__premium-card">
        <div className="sidebar__premium-card-icon" aria-hidden="true">
          <IconChef />
        </div>
        <p className="sidebar__premium-card-title">Unlock more with Premium</p>
        <p className="sidebar__premium-card-body">
          Access exclusive recipes, advanced features and more.
        </p>
        <button
          className="sidebar__premium-card-btn"
          onClick={onUpgrade}
          type="button"
          aria-label="Upgrade to Premium"
        >
          <IconCrown />
          Upgrade Plans
        </button>
      </div>

      {/* ── Logout ── */}
      <button
        className="sidebar__logout"
        onClick={onLogout}
        type="button"
        aria-label="Log out of Cooks Delight"
      >
        <span className="sidebar__logout-icon" aria-hidden="true">
          <IconLogout />
        </span>
        Logout
      </button>

    </aside>
  );
};

export default Sidebar;