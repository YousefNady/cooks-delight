import React from "react";
import type { DummyJSONUser } from "../../../../shared/types/dashboard.types";
import Sidebar, { type SidebarProps, type NavId } from "./Sidebar";
import Header, { type HeaderProps } from "./Header";
import "./DashboardLayout.css";

// ---------------------------------------------------------------------------
// Props interface
// ---------------------------------------------------------------------------

/**
 * DashboardLayout composes Sidebar + Header + scrollable main content.
 *
 * Sidebar props and Header props are forwarded verbatim so this wrapper
 * stays thin and purely structural. Your page components should wire the
 * handlers (onNavChange, onSearchSubmit, etc.) from their own state or
 * routing layer.
 */
export interface DashboardLayoutProps {
  // ── Sidebar ────────────────────────────────────────────────────────────────
  activeNavId?: NavId;
  onNavChange?: SidebarProps["onNavChange"];
  onLogout?: SidebarProps["onLogout"];
  onUpgrade?: SidebarProps["onUpgrade"];

  // ── Header ─────────────────────────────────────────────────────────────────
  /**
   * Pass a resolved DummyJSONUser here (from your auth store / React Query).
   * If omitted, Header falls back to fetching `/users/:fetchUserId` itself.
   */
  user?: DummyJSONUser;
  /**
   * Used only when `user` is not provided.
   * @default 1
   */
  fetchUserId?: HeaderProps["fetchUserId"];
  notificationCount?: HeaderProps["notificationCount"];
  searchPlaceholder?: HeaderProps["searchPlaceholder"];
  onSearchChange?: HeaderProps["onSearchChange"];
  onSearchSubmit?: HeaderProps["onSearchSubmit"];
  onNotificationsClick?: HeaderProps["onNotificationsClick"];
  onProfileClick?: HeaderProps["onProfileClick"];

  // ── Layout ─────────────────────────────────────────────────────────────────
  /** Page content rendered in the scrollable main area */
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  // Sidebar
  activeNavId,
  onNavChange,
  onLogout,
  onUpgrade,

  // Header
  user,
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
  return (
    <div className="dashboard-layout">

      {/* ── Left: fixed sidebar ── */}
      <Sidebar
        activeNavId={activeNavId}
        onNavChange={onNavChange}
        onLogout={onLogout}
        onUpgrade={onUpgrade}
      />

      {/* ── Right: sticky header + scrollable content ── */}
      <div className="dashboard-layout__body">
        <Header
          user={user}
          fetchUserId={fetchUserId}
          notificationCount={notificationCount}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          onNotificationsClick={onNotificationsClick}
          onProfileClick={onProfileClick}
        />

        {/*
          id="main-content" → target for a skip-navigation link (<a href="#main-content">)
          tabIndex={-1}     → programmatically focusable (e.g. after route change)
        */}
        <main
          className="dashboard-layout__main"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;