import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// -- Layout shell --------------------------------------------------------------
import { DashboardLayout } from "../components/Layout";
import type { NavId } from "../components/Layout";

// -- Reusable UI components ----------------------------------------------------
import { RecipeCard } from "../components/RecipeCard";

// -- Domain types --------------------------------------------------------------
import type { Recipe } from "../types";
import { getAllDashboardRecipes } from "../../recipes/services/API";
import { useAuth } from "../../auth/context";
import { useFavoritesContext } from "../../profile";

// -- Page styles ---------------------------------------------------------------
import "./ExplorePage.css";

// =============================================================================
// Inline SVG icons
// =============================================================================

const IconSearch: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);

const IconChevronDown: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconChevronLeft: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// =============================================================================
// Category chip configuration
// "All" is the default; the rest map to DummyJSONRecipe.mealType[0] values.
// =============================================================================

type CategoryId =
  | "all"
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Dessert"
  | "Soup"
  | "Bowl"
  | "Italian"
  | "Asian"
  | "Vegetarian";

interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
}

const CATEGORIES: Category[] = [
  { id: "all",        label: "All",        emoji: "🍽️"  },
  { id: "Breakfast",  label: "Breakfast",  emoji: "🥞"  },
  { id: "Lunch",      label: "Lunch",      emoji: "🥗"  },
  { id: "Dinner",     label: "Dinner",     emoji: "🍽️"  },
  { id: "Dessert",    label: "Dessert",    emoji: "🍰"  },
  { id: "Soup",       label: "Soup",       emoji: "🍲"  },
  { id: "Bowl",       label: "Bowl",       emoji: "🥙"  },
  { id: "Italian",    label: "Italian",    emoji: "🍝"  },
  { id: "Asian",      label: "Asian",      emoji: "🍜"  },
  { id: "Vegetarian", label: "Vegetarian", emoji: "🥦"  },
];

// =============================================================================
// Sort options
// =============================================================================

type SortKey = "rating" | "prepTime" | "calories" | "newest";

interface SortOption {
  value: SortKey;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { value: "rating",   label: "Top Rated"   },
  { value: "prepTime", label: "Prep Time"   },
  { value: "calories", label: "Calories"    },
  { value: "newest",   label: "Newest"      },
];

// =============================================================================
// Pagination
// =============================================================================

const CARDS_PER_PAGE = 12; // 4×3 grid (3 full rows)

// =============================================================================
// Sort comparator — pure function, easy to unit-test
// =============================================================================

function sortRecipes(recipes: Recipe[], key: SortKey): Recipe[] {
  const copy = [...recipes];
  switch (key) {
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "prepTime":
      return copy.sort(
        (a, b) =>
          a.prepTimeMinutes + a.cookTimeMinutes -
          (b.prepTimeMinutes + b.cookTimeMinutes),
      );
    case "calories":
      return copy.sort((a, b) => a.caloriesPerServing - b.caloriesPerServing);
    case "newest":
      // Without a `createdAt` field from DummyJSON, newest = highest id (insertion order)
      return copy.sort((a, b) => b.id - a.id);
    default:
      return copy;
  }
}

// =============================================================================
// ExplorePage
// =============================================================================

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { isFavorited, toggleFavorite } = useFavoritesContext();

  // -- Navigation -------------------------------------------------------------
  const [activeNavId, setActiveNavId] = useState<NavId>("explore");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
const [recipesLoading, setRecipesLoading] = useState<boolean>(true);
const [recipesError, setRecipesError] = useState<string | null>(null);

  // -- Filter state -----------------------------------------------------------
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [searchQuery,    setSearchQuery]     = useState<string>("");
  const [sortKey,        setSortKey]         = useState<SortKey>("rating");
  const [isSortOpen,     setIsSortOpen]      = useState<boolean>(false);

  // -- Pagination -------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    let cancelled = false;


    getAllDashboardRecipes()
      .then((data) => {
        if (!cancelled) setRecipes(data);
      })
      .catch(() => {
        if (!cancelled) setRecipesError("Unable to load recipes right now.");
      })
      .finally(() => {
        if (!cancelled) setRecipesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // -- Derived: filter ? sort ? paginate -------------------------------------
  const filteredAndSorted = useMemo<Recipe[]>(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1 — category filter
    let result = recipes.filter((r) => {
      if (activeCategory === "all") return true;
      // Match against mealType, cuisine, or tags
      return (
        r.mealType.some((m) => m === activeCategory) ||
        r.cuisine === activeCategory ||
        r.tags.includes(activeCategory)
      );
    });

    // 2 — text search
    if (q) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.mealType.some((m) => m.toLowerCase().includes(q)),
      );
    }

    // 3 — sort
    return sortRecipes(result, sortKey);
  }, [activeCategory, searchQuery, sortKey, recipes]);

  // Paginated slice
  const totalFiltered = filteredAndSorted.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / CARDS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const pageRecipes   = filteredAndSorted.slice(
    (safePage - 1) * CARDS_PER_PAGE,
    safePage * CARDS_PER_PAGE,
  );

  // -- Handlers ---------------------------------------------------------------

  const handleCategoryChange = (id: CategoryId): void => {
    setActiveCategory(id);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Escape") setSearchQuery("");
  };

  const handleSortSelect = (key: SortKey): void => {
    setSortKey(key);
    setIsSortOpen(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // TODO: replace with paginated API call: GET /recipes?skip=(page-1)*12&limit=12
  };

  const handleFavoriteToggle = (id: number): void => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const recipe = recipes.find((item) => item.id === id);
    if (recipe) toggleFavorite(recipe);
  };

  const handleNavChange = (id: NavId): void => {
    setActiveNavId(id);
    const routes: Partial<Record<NavId, string>> = {
      dashboard: "/dashboard",
      favorites: "/favorites",
      explore: "/explore",
      profile: "/profile-dashboard",
      settings: "/settings",
    };

    if (id === "favorites" && !isAuthenticated) {
      navigate("/login");
      return;
    }

    const route = routes[id];
    if (route) navigate(route);
  };

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? "Sort by";

  // -- Render -----------------------------------------------------------------
  return (
    <DashboardLayout
      activeNavId={activeNavId}
      onNavChange={handleNavChange}
      onLogout={logout}
      onUpgrade={() => console.log("[ExplorePage] upgrade")}
      fetchUserId={Number(user?.userId) || 1}
      notificationCount={2}
      onSearchSubmit={(q) => console.log("[ExplorePage] global search:", q)}
      onNotificationsClick={() => console.log("[ExplorePage] notifications")}
      onProfileClick={() => navigate("/profile-dashboard")}
    >
      {/* Close sort dropdown when clicking outside */}
      <div
        className="exp-page"
        onClick={() => isSortOpen && setIsSortOpen(false)}
      >

        {/* ================================================================
            PAGE HEADER — title + result count
            ================================================================ */}
        <header className="exp-page__header">
          <div className="exp-page__header-titles">
            <h1 className="exp-page__title">
              Explore All Recipes
              <span className="exp-page__title-emoji" aria-hidden="true">🍳</span>
            </h1>
            <p className="exp-page__subtitle">
              {totalFiltered === recipes.length
                ? `${recipes.length} recipes to discover`
                : `${totalFiltered} recipe${totalFiltered !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </header>

        {/* ================================================================
            CATEGORY CHIPS — horizontally scrollable pill row
            ================================================================ */}
        <div className="exp-page__chips-wrap" aria-label="Filter by category">
          <div className="exp-page__chips" role="list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={[
                  "exp-page__chip",
                  activeCategory === cat.id ? "exp-page__chip--active" : "",
                ].filter(Boolean).join(" ")}
                type="button"
                role="listitem"
                onClick={() => handleCategoryChange(cat.id)}
                aria-pressed={activeCategory === cat.id}
                aria-label={`Filter by ${cat.label}`}
              >
                <span className="exp-page__chip-emoji" aria-hidden="true">
                  {cat.emoji}
                </span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================
            TOOLBAR — search (left) + sort dropdown (right)
            Consistent with FavoritesPage and RecentlyViewedPage toolbars.
            ================================================================ */}
        <div className="exp-page__toolbar">
          {/* Search */}
          <div className="exp-page__search-wrap" role="search">
            <span className="exp-page__search-icon" aria-hidden="true">
              <IconSearch />
            </span>
            <input
              className="exp-page__search-input"
              type="search"
              placeholder="Search recipes, ingredients…"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search all recipes"
            />
          </div>

          {/* Sort by dropdown */}
          <div
            className="exp-page__sort-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={[
                "exp-page__sort-btn",
                isSortOpen ? "exp-page__sort-btn--open" : "",
              ].filter(Boolean).join(" ")}
              type="button"
              onClick={() => setIsSortOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
              aria-label={`Sort by: ${activeSortLabel}`}
            >
              <span className="exp-page__sort-btn-label">
                <span className="exp-page__sort-btn-prefix">Sort:</span>
                {activeSortLabel}
              </span>
              <span className={[
                "exp-page__sort-btn-icon",
                isSortOpen ? "exp-page__sort-btn-icon--flipped" : "",
              ].filter(Boolean).join(" ")} aria-hidden="true">
                <IconChevronDown />
              </span>
            </button>

            {isSortOpen && (
              <ul
                className="exp-page__sort-dropdown"
                role="listbox"
                aria-label="Sort options"
              >
                {SORT_OPTIONS.map((opt) => (
                  <li
                    key={opt.value}
                    className={[
                      "exp-page__sort-option",
                      opt.value === sortKey ? "exp-page__sort-option--selected" : "",
                    ].filter(Boolean).join(" ")}
                    role="option"
                    aria-selected={opt.value === sortKey}
                    onClick={() => handleSortSelect(opt.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleSortSelect(opt.value);
                    }}
                    tabIndex={0}
                  >
                    {opt.label}
                    {opt.value === sortKey && (
                      <span className="exp-page__sort-option-check" aria-hidden="true">✓</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ================================================================
            RECIPE GRID — explore mode cards
            ================================================================ */}
        {recipesLoading ? (
          <div className="exp-page__empty" role="status" aria-live="polite">
            <p className="exp-page__empty-title">Loading...</p>
          </div>
        ) : recipesError ? (
          <div className="exp-page__empty" role="alert" aria-live="polite">
            <p className="exp-page__empty-title">{recipesError}</p>
          </div>
        ) : pageRecipes.length > 0 ? (
          <div
            className="exp-page__grid"
            role="list"
            aria-label="Recipe results"
          >
            {pageRecipes.map((recipe) => (
              <div key={recipe.id} role="listitem">
                <RecipeCard
                  recipe={recipe}
                  mode="explore"
                  isFavorite={isFavorited(recipe.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onMenuOpen={(id) =>
                    console.log("[ExplorePage] menu for recipe", id)
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          /* -- Empty state -- */
          <div className="exp-page__empty" role="status" aria-live="polite">
            <span className="exp-page__empty-icon" aria-hidden="true">??</span>
            <p className="exp-page__empty-title">No recipes found</p>
            <p className="exp-page__empty-body">
              Try a different search term or select another category.
            </p>
            <button
              className="exp-page__empty-reset-btn"
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setCurrentPage(1);
              }}
            >
              Reset filters
            </button>
          </div>
        )}

        {/* ================================================================
            PAGINATION — "Showing X–Y of Z" + numbered pages
            Only rendered when total results span more than one page.
            ================================================================ */}
        {totalPages > 1 && pageRecipes.length > 0 && (
          <footer className="exp-page__pagination" aria-label="Pagination">
            <p className="exp-page__pagination-label">
              Showing{" "}
              <span className="exp-page__pagination-label-range">
                {(safePage - 1) * CARDS_PER_PAGE + 1}–
                {Math.min(safePage * CARDS_PER_PAGE, totalFiltered)}
              </span>{" "}
              of {totalFiltered} recipes
            </p>

            <nav className="exp-page__page-controls" aria-label="Page navigation">
              <button
                className="exp-page__page-btn exp-page__page-btn--arrow"
                type="button"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                <IconChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={[
                    "exp-page__page-btn",
                    page === safePage ? "exp-page__page-btn--active" : "",
                  ].filter(Boolean).join(" ")}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === safePage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                className="exp-page__page-btn exp-page__page-btn--arrow"
                type="button"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                aria-label="Next page"
              >
                <IconChevronRight />
              </button>
            </nav>
          </footer>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ExplorePage;




