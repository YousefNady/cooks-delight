import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { DummyJSONUser } from "../../../../shared/types/dashboard.types";
import "./Header.css";
import defaultAvatarImg from "../../../../assets/profile/default-avatar.png";


// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const IconSearch: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);

const IconBell: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const IconChevronDown: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    width="14"
    height="14"
  >
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Internal hook — fetch a single DummyJSON user by id
// Kept here so the Header stays self-contained when used in "auto-fetch" mode.
// Your team can extract this to a shared hooks/ folder later.
// ---------------------------------------------------------------------------

interface UseFetchUserResult {
  user: DummyJSONUser | null;
  loading: boolean;
  error: string | null;
}

interface FetchUserState {
  user: DummyJSONUser | null;
  resolvedUserId: number | null;
  error: string | null;
}

function useFetchUser(userId: number): UseFetchUserResult {
  const [state, setState] = useState<FetchUserState>({
    user: null,
    resolvedUserId: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    fetch(`https://dummyjson.com/icon/${userId || "default"}/128`)
      .then<DummyJSONUser>((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setState({ user: data, resolvedUserId: userId, error: null });
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setState((prevState) => ({
            ...prevState,
            resolvedUserId: userId,
            error: err.message,
          }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const loading = state.resolvedUserId !== userId;
  const error = loading ? null : state.error;

  return { user: state.user, loading, error };
}

// ---------------------------------------------------------------------------
// Props interface
// ---------------------------------------------------------------------------

/**
 * Two usage modes — mutually exclusive:
 *
 * Mode A — Pass a ready-made user object (from your auth/API service):
 *   <Header user={myUser} ... />
 *
 * Mode B — Let Header fetch the user itself (good for quick prototyping):
 *   <Header fetchUserId={1} ... />
 *
 * If both are supplied, `user` takes precedence.
 */
export interface HeaderProps {
  /**
   * A fully-typed DummyJSONUser object.
   * Provide this when user data is managed by a parent (auth store, React Query, etc.).
   */
  user?: DummyJSONUser;

  /**
   * If no `user` prop is provided, the Header will fetch `/users/:fetchUserId`
   * from DummyJSON directly. Useful for isolated development / Storybook.
   * @default 1
   */
  fetchUserId?: number;

  /** Number shown on the notification bell badge. 0 hides the badge. */
  notificationCount?: number;

  /** Placeholder text for the search input */
  searchPlaceholder?: string;

  /** Called on every keystroke in the search input */
  onSearchChange?: (value: string) => void;

  /** Called when the user presses Enter in the search input */
  onSearchSubmit?: (value: string) => void;

  /** Called when the bell icon is clicked */
  onNotificationsClick?: () => void;

  /** Called when the avatar / profile button is clicked */
  onProfileClick?: () => void;

}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Header: React.FC<HeaderProps> = ({
  user: userProp,
  fetchUserId = 1,
  notificationCount = 0,
  searchPlaceholder = "Search recipes, ingredients…",
  onSearchChange = () => {},
  onSearchSubmit = () => {},
  onNotificationsClick = () => {},
  onProfileClick = () => {},
}) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  // Only run the fetch hook when no user prop is provided
  const { user: fetchedUser, loading } = useFetchUser(
    userProp ? -1 : fetchUserId, // pass -1 as a sentinel so the hook skips the fetch
  );

  // Resolved user — prop wins; fallback to fetched; fallback to null
  const user: DummyJSONUser | null = userProp ?? fetchedUser;

  // Derived display values — graceful fallbacks while loading or on error
  const displayName: string = user?.firstName ?? "Guest";

  // Build avatar URL from the user object.
  // user.image is already set by AuthContext as:
  //   `https://dummyjson.com/icon/${userId}/128`
  // The fallback only fires if user is null (not logged in).
 const avatarUrl: string = user?.image ?? defaultAvatarImg;
const fallbackUrl = defaultAvatarImg;

  const avatarAlt: string = user
    ? `${user.firstName} ${user.lastName}`
    : "User avatar";



  return (
    <header className="header">
      {/* ── Home button — visible only on mobile ── */}
      <button
        className="header__home-btn"
        type="button"
        onClick={() => navigate("/")}
        aria-label="Go to home page"
      >
        🏠
      </button>
      {/* ── Greeting ── */}
      <div className="header__greeting">
        <h1 className="header__greeting-title">
          Welcome back, {displayName}!{" "}
          <span role="img" aria-label="waving hand">
            👋
          </span>
        </h1>
        <p className="header__greeting-subtitle">
          Let's continue your culinary journey.
        </p>
      </div>

      {/* ── Right cluster ── */}
      <div className="header__controls">
        {/* Search */}
        <div className="header__search">
          <button
            className="header__search-icon"
            type="button"
            onClick={() => {
              if (inputValue.trim()) onSearchSubmit(inputValue.trim());
            }}
            aria-label="Submit search"
          >
            <IconSearch />
          </button>
          <input
            className="header__search-input"
            type="search"
            placeholder={searchPlaceholder}
            aria-label="Search recipes and ingredients"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              onSearchChange(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                onSearchSubmit(inputValue.trim());
              }
            }}
          />
        </div>

        {/* Notification bell */}
        <button
          className="header__icon-btn"
          type="button"
          onClick={onNotificationsClick}
          aria-label={
            notificationCount > 0
              ? `Notifications, ${notificationCount} unread`
              : "Notifications"
          }
        >
          <IconBell />
          {notificationCount > 0 && (
            <span className="header__badge" aria-hidden="true">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* User profile */}
        <button
          className={[
            "header__profile",
            loading && !userProp ? "header__profile--loading" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={() => {
            onProfileClick();
            navigate("/profile-dashboard");
          }}
          aria-label="Open user menu"
        >
          <img
            className="header__profile-avatar"
            src={
              avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarAlt || "User")}&background=f97316&color=fff&size=64`
            }
            alt={avatarAlt}
            width={36}
            height={36}
            loading="eager"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = fallbackUrl;
            }}
          />
          <span className="header__profile-chevron">
            <IconChevronDown />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
