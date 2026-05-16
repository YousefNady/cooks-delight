import React from "react";
import type { DummyJSONUser } from "../../../../shared/types/dashboard.types";
import Sidebar, { type SidebarProps, type NavId } from "./Sidebar";
import Header, { type HeaderProps } from "./Header";
import "./DashboardLayout.css";
import { useAuth } from "../../../auth/context";
import { useNavigate } from "react-router-dom";

export interface DashboardLayoutProps {
  // ── Sidebar ──────────────────────────────────────────────────────────────
  activeNavId?: NavId;
  onNavChange?: SidebarProps["onNavChange"];
  onLogout?: SidebarProps["onLogout"];
  onUpgrade?: SidebarProps["onUpgrade"];

  // ── Header ───────────────────────────────────────────────────────────────
  // ✅ removed `user?: DummyJSONUser` — layout always reads from auth context now
  fetchUserId?: HeaderProps["fetchUserId"];
  notificationCount?: HeaderProps["notificationCount"];
  searchPlaceholder?: HeaderProps["searchPlaceholder"];
  onSearchChange?: HeaderProps["onSearchChange"];
  onSearchSubmit?: HeaderProps["onSearchSubmit"];
  onNotificationsClick?: HeaderProps["onNotificationsClick"];
  onProfileClick?: HeaderProps["onProfileClick"];

  // ── Layout ────────────────────────────────────────────────────────────────
  children: React.ReactNode;
}

// Add this component above DashboardLayout
const BOTTOM_NAV_ITEMS = [
  { id: "dashboard"       as NavId, label: "Home",    icon: "🏠" },
  { id: "favorites"       as NavId, label: "Saved",   icon: "❤️" },
  { id: "explore"         as NavId, label: "Explore",  icon: "🍳" },
  { id: "recently-viewed" as NavId, label: "Recent",   icon: "🕐" },
  { id: "profile"         as NavId, label: "Profile",  icon: "👤" },
];

const BottomNav: React.FC<{
  activeNavId?: NavId;
  onNavChange?: (id: NavId) => void;
}> = ({ activeNavId, onNavChange }) => (
  <nav className="bottom-nav" aria-label="Mobile navigation">
    {BOTTOM_NAV_ITEMS.map(({ id, label, icon }) => (
      <button
        key={id}
        className={[
          "bottom-nav__item",
          activeNavId === id ? "bottom-nav__item--active" : "",
        ].filter(Boolean).join(" ")}
        type="button"
        onClick={() => onNavChange?.(id)}
        aria-label={label}
        aria-current={activeNavId === id ? "page" : undefined}
      >
        <span className="bottom-nav__icon" aria-hidden="true">{icon}</span>
        <span className="bottom-nav__label">{label}</span>
      </button>
    ))}
  </nav>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  // Sidebar
  activeNavId,
  onNavChange,
  onLogout,
  onUpgrade,

  // Header
  // ✅ `user` removed from destructuring — no longer a prop
  fetchUserId,
  notificationCount,
  searchPlaceholder,
  onSearchChange,
  onSearchSubmit,
  onNotificationsClick,
  onProfileClick,

  // Layout
  children,
}) => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

    const handleSearchSubmit = (q: string) => {
      if (!q.trim()) return;
      navigate(`/recipes?q=${encodeURIComponent(q.trim())}`);
      onSearchSubmit?.(q);
    };


  // ✅ Cast to DummyJSONUser — Header only reads id, firstName, email, image
  const headerUser = authUser
    ? ({
        id: Number(authUser.userId),
        firstName: authUser.username,
        lastName: "",
        email: authUser.email,
        image: authUser.image,
      } as DummyJSONUser)
    : undefined;

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeNavId={activeNavId}
        onNavChange={onNavChange}
        onLogout={onLogout}
        onUpgrade={onUpgrade}
      />
      <div className="dashboard-layout__body">
        <Header
          user={headerUser}
          fetchUserId={fetchUserId}
          notificationCount={notificationCount}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={onSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onNotificationsClick={onNotificationsClick}
          onProfileClick={onProfileClick}
        />

        <main
          className="dashboard-layout__main"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
      <BottomNav activeNavId={activeNavId} onNavChange={onNavChange} />{" "}
      {/* 👈*/}
    </div>
  );
};

export default DashboardLayout;
