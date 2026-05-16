import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardLayout } from "../components/Layout";
import type { NavId } from "../components/Layout";
import type { Recipe } from "../types";
import { getAllDashboardRecipes } from "../../recipes/services/API";
import { useAuth } from "../../auth/context";
import {
  readRecentlyViewed,
  writeRecentlyViewed,
} from "../utils/recentlyViewedStorage";
import "./Recentlyviewedpage.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type TimeFilter = "all" | "today" | "this-week" | "older";
type MealFilter =
  | "all"
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Snack"
  | "Dessert";
type DifficultyFilter = "all" | "Easy" | "Medium" | "Hard";

interface ViewedRecipe {
  recipe: Recipe;
  viewedAt: string;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const IconSearch: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);




const IconFilter: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const IconClock: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconChevronRight: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconTrash: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 2) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function derivePrimaryTag(recipe: Recipe): string {
  return recipe.mealType?.[0] ?? recipe.cuisine ?? recipe.tags?.[0] ?? "Recipe";
}

function formatTotalTime(prep: number, cook: number): string {
  const total = prep + cook;
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

// ✅ Pure helper — no Date.now() during render
function matchesTimeFilter(viewedAt: string, filter: TimeFilter): boolean {
  if (filter === "all") return true;
  const diffMs = Date.now() - new Date(viewedAt).getTime();
  const diffDays = diffMs / 86_400_000;
  if (filter === "today"     && diffDays >= 1) return false;
  if (filter === "this-week" && diffDays >= 7) return false;
  if (filter === "older"     && diffDays < 7)  return false;
  return true;
}

// ---------------------------------------------------------------------------
// RecentlyViewedRow
// ---------------------------------------------------------------------------

interface RecentlyViewedRowProps {
  item: ViewedRecipe;
  onOpen?: (id: number) => void;
  onRemove?: (id: number) => void;
}

const RecentlyViewedRow: React.FC<RecentlyViewedRowProps> = ({
  item,
  onOpen,
  onRemove,
}) => {
  const { recipe, viewedAt } = item;
  const timeLabel = formatRelativeTime(viewedAt);
  const primaryTag = derivePrimaryTag(recipe);
  const totalTime = formatTotalTime(
    recipe.prepTimeMinutes,
    recipe.cookTimeMinutes,
  );
  const fallbackSrc =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=70";

  return (
    <article
      className="rv-row"
      role="listitem"
      aria-label={`${recipe.name}, viewed ${timeLabel}`}
    >
      <div className="rv-row__thumb-wrap">
        <img
          className="rv-row__thumb"
          src={recipe.image || fallbackSrc}
          alt={recipe.name}
          width={80}
          height={80}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = fallbackSrc;
          }}
        />
      </div>

      <button
        className="rv-row__body"
        type="button"
        onClick={() => onOpen?.(recipe.id)}
        aria-label={`Open ${recipe.name}`}
      >
        <p className="rv-row__title">{recipe.name}</p>
        <div className="rv-row__meta">
          <span className="rv-row__meta-time">
            <span className="rv-row__meta-clock" aria-hidden="true">
              <IconClock />
            </span>
            {totalTime}
          </span>
          <span className="rv-row__meta-sep" aria-hidden="true">
            -
          </span>
          <span className="rv-row__meta-tag">{primaryTag}</span>
        </div>
      </button>

      <div className="rv-row__timestamp" aria-label={`Viewed ${timeLabel}`}>
        <span className="rv-row__timestamp-label">Viewed {timeLabel}</span>
      </div>

      <button
        className="rv-row__remove-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.(recipe.id);
        }}
        aria-label={`Remove ${recipe.name} from recently viewed`}
      >
        <IconTrash />
      </button>

      <button
        className="rv-row__chevron-btn"
        type="button"
        onClick={() => onOpen?.(recipe.id)}
        aria-label={`Open ${recipe.name}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <IconChevronRight />
      </button>
    </article>
  );
};

// ---------------------------------------------------------------------------
// RecentlyViewedPage
// ---------------------------------------------------------------------------

const RecentlyViewedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [activeNavId, setActiveNavId] = useState<NavId>("recently-viewed");
  const [viewedItems, setViewedItems] = useState<ViewedRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // ✅ starts as true — no sync setState needed
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [mealFilter, setMealFilter] = useState<MealFilter>("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");

  useEffect(() => {
    let cancelled = false;
    // ✅ No setLoading(true) or setError(null) here — avoids the lint error

    getAllDashboardRecipes()
      .then((recipes) => {
        if (cancelled) return;

        const storedEntries = readRecentlyViewed(); // ✅ from utility file
        const recipesById = new Map(recipes.map((r) => [r.id, r]));

        if (storedEntries.length > 0) {
          setViewedItems(
            storedEntries
              .map(({ id, viewedAt }) => {
                const recipe = recipesById.get(id);
                return recipe ? { recipe, viewedAt } : null;
              })
              .filter((item): item is ViewedRecipe => item !== null),
          );
        } else {
          setViewedItems([]);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load recipes right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ No Date.now() here anymore
  const filteredItems = useMemo<ViewedRecipe[]>(() => {
    const q = searchQuery.trim().toLowerCase();

    return viewedItems.filter(({ recipe, viewedAt }) => {
      if (q) {
        const matchesSearch =
          recipe.name.toLowerCase().includes(q) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          recipe.cuisine.toLowerCase().includes(q) ||
          recipe.mealType.some((meal) => meal.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      if (!matchesTimeFilter(viewedAt, timeFilter)) return false; // ✅ pure helper

      if (mealFilter !== "all") {
        const matchesMeal =
          recipe.mealType.some((m) => m === mealFilter) ||
          recipe.tags.includes(mealFilter);
        if (!matchesMeal) return false;
      }

      if (difficultyFilter !== "all") {
        if (recipe.difficulty !== difficultyFilter) return false;
      }

      return true;
    });
  }, [searchQuery, viewedItems, timeFilter, mealFilter, difficultyFilter]); 
  
  const handleNavChange = (id: NavId): void => {
    setActiveNavId(id);
    const routes: Partial<Record<NavId, string>> = {
      dashboard: "/dashboard",
      favorites: "/favorites",
      explore: "/explore",
      "recently-viewed": "/recently-viewed",
      profile: "/profile-dashboard",
      settings: "/settings",
    };
    if (id === "favorites" && !isAuthenticated) navigate("/login");
    else if (routes[id]) navigate(routes[id]!);
  };

  const handleOpenRecipe = (id: number): void => {
    navigate(`/recipes/${id}`);
  };

  const handleRemoveItem = (id: number): void => {
    setViewedItems((prev) => {
      const next = prev.filter((item) => item.recipe.id !== id);
      writeRecentlyViewed(
        next.map((item) => ({ id: item.recipe.id, viewedAt: item.viewedAt })),
      );
      return next;
    });
  };

  const handleClearAll = (): void => {
    writeRecentlyViewed([]);
    setViewedItems([]);
  };

  return (
    <DashboardLayout
      activeNavId={activeNavId}
      onNavChange={handleNavChange}
      onLogout={logout}
      onUpgrade={() => console.log("[RecentlyViewedPage] upgrade")}
      fetchUserId={Number(user?.userId) || 1}
      notificationCount={2}
      onSearchSubmit={(q) =>
        console.log("[RecentlyViewedPage] global search:", q)
      }
      onNotificationsClick={() =>
        console.log("[RecentlyViewedPage] notifications")
      }
      onProfileClick={() => navigate("/profile-dashboard")}
    >
      <div className="rv-page">
        {/* ── Page Header ── */}
        <header className="rv-page__header">
          <div className="rv-page__header-titles">
            <h1 className="rv-page__title">
              Recently Viewed
              <span className="rv-page__title-emoji" aria-hidden="true">
                🕐
              </span>
            </h1>
            <p className="rv-page__subtitle">
              Recipes you've looked at recently
            </p>
          </div>
          {viewedItems.length > 0 && (
            <button
              className="rv-page__clear-all-btn"
              type="button"
              onClick={handleClearAll}
              aria-label="Clear all recently viewed recipes"
            >
              <span className="rv-page__clear-all-btn-icon" aria-hidden="true">
                <IconTrash />
              </span>
              Clear All
            </button>
          )}
        </header>

        {/* ── Toolbar ── */}
        <div className="rv-page__toolbar" role="search">
          <div className="rv-page__search-wrap">
            <span className="rv-page__search-icon" aria-hidden="true">
              <IconSearch />
            </span>
            <input
              className="rv-page__search-input"
              type="search"
              placeholder="Search recently viewed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setSearchQuery("")}
              aria-label="Search recently viewed recipes"
            />
          </div>
          {/* ── Toolbar ── */}
          <div className="rv-page__toolbar" role="search">
            <div className="rv-page__search-wrap">
              <span className="rv-page__search-icon" aria-hidden="true">
                <IconSearch />
              </span>
              <input
                className="rv-page__search-input"
                type="search"
                placeholder="Search recently viewed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setSearchQuery("")}
                aria-label="Search recently viewed recipes"
              />
            </div>
            <button
              className={[
                "rv-page__filter-btn",
                isFilterOpen ? "rv-page__filter-btn--active" : "",
                // show active state if any filter is applied
                timeFilter !== "all" ||
                mealFilter !== "all" ||
                difficultyFilter !== "all"
                  ? "rv-page__filter-btn--applied"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              type="button"
              onClick={() => setIsFilterOpen((v) => !v)}
              aria-pressed={isFilterOpen}
              aria-label="Toggle recipe filters"
            >
              <span className="rv-page__filter-btn-icon" aria-hidden="true">
                <IconFilter />
              </span>
              Filter
              {/* show dot if any filter is active */}
              {(timeFilter !== "all" ||
                mealFilter !== "all" ||
                difficultyFilter !== "all") && (
                <span className="rv-page__filter-dot" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* ── Filter Panel ── */}
          {isFilterOpen && (
            <div
              className="rv-page__filter-panel"
              role="group"
              aria-label="Filter options"
            >
              {/* Time */}
              <div className="rv-page__filter-group">
                <p className="rv-page__filter-group-label">When</p>
                <div className="rv-page__filter-chips">
                  {(["all", "today", "this-week", "older"] as TimeFilter[]).map(
                    (v) => (
                      <button
                        key={v}
                        className={[
                          "rv-page__filter-chip",
                          timeFilter === v
                            ? "rv-page__filter-chip--active"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        type="button"
                        onClick={() => setTimeFilter(v)}
                        aria-pressed={timeFilter === v}
                      >
                        {v === "all"
                          ? "Any time"
                          : v === "today"
                            ? "Today"
                            : v === "this-week"
                              ? "This week"
                              : "Older"}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Meal type */}
              <div className="rv-page__filter-group">
                <p className="rv-page__filter-group-label">Meal Type</p>
                <div className="rv-page__filter-chips">
                  {(
                    [
                      "all",
                      "Breakfast",
                      "Lunch",
                      "Dinner",
                      "Snack",
                      "Dessert",
                    ] as MealFilter[]
                  ).map((v) => (
                    <button
                      key={v}
                      className={[
                        "rv-page__filter-chip",
                        mealFilter === v ? "rv-page__filter-chip--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      type="button"
                      onClick={() => setMealFilter(v)}
                      aria-pressed={mealFilter === v}
                    >
                      {v === "all" ? "Any" : v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="rv-page__filter-group">
                <p className="rv-page__filter-group-label">Difficulty</p>
                <div className="rv-page__filter-chips">
                  {(
                    ["all", "Easy", "Medium", "Hard"] as DifficultyFilter[]
                  ).map((v) => (
                    <button
                      key={v}
                      className={[
                        "rv-page__filter-chip",
                        difficultyFilter === v
                          ? "rv-page__filter-chip--active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      type="button"
                      onClick={() => setDifficultyFilter(v)}
                      aria-pressed={difficultyFilter === v}
                    >
                      {v === "all" ? "Any" : v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {(timeFilter !== "all" ||
                mealFilter !== "all" ||
                difficultyFilter !== "all") && (
                <button
                  className="rv-page__filter-reset"
                  type="button"
                  onClick={() => {
                    setTimeFilter("all");
                    setMealFilter("all");
                    setDifficultyFilter("all");
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="rv-page__empty" role="status" aria-live="polite">
            <p className="rv-page__empty-title">Loading...</p>
          </div>
        ) : error ? (
          <div className="rv-page__empty" role="alert" aria-live="polite">
            <p className="rv-page__empty-title">{error}</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <section
            className="rv-page__list-card"
            aria-label="Recently viewed recipes"
          >
            <div
              className="rv-page__list"
              role="list"
              aria-live="polite"
              aria-relevant="removals"
            >
              {filteredItems.map((item, index) => (
                <React.Fragment key={item.recipe.id}>
                  <RecentlyViewedRow
                    item={item}
                    onOpen={handleOpenRecipe}
                    onRemove={handleRemoveItem}
                  />
                  {index < filteredItems.length - 1 && (
                    <div className="rv-page__divider" aria-hidden="true" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
        ) : (
          <div className="rv-page__empty" role="status" aria-live="polite">
            <span className="rv-page__empty-icon" aria-hidden="true">
              🍽️
            </span>
            <p className="rv-page__empty-title">
              {searchQuery ? "No recipes found" : "Nothing here yet"}
            </p>
            <p className="rv-page__empty-body">
              {searchQuery
                ? "Try a different search term or clear the filter."
                : "Recipes you view will appear here so you can easily find them again."}
            </p>
            {searchQuery && (
              <button
                className="rv-page__empty-clear-btn"
                type="button"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecentlyViewedPage;
