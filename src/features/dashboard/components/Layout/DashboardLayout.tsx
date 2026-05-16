import React from "react";
import type { DummyJSONUser } from "../../../../shared/types/dashboard.types";
import Sidebar, { type SidebarProps, type NavId } from "./Sidebar";
import Header, { type HeaderProps } from "./Header";
import "./DashboardLayout.css";
import { useAuth } from "../../../auth/context";

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
          onSearchSubmit={onSearchSubmit}
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
    </div>
  );
};

export default DashboardLayout;
