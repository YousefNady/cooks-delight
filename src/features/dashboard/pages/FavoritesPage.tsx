import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardLayout } from "../components/Layout";
import type { NavId } from "../components/Layout";
import { RecipeCard } from "../components/RecipeCard";
import type { Recipe } from "../types";
import { getAllDashboardRecipes } from "../../recipes/services/API";
import { useAuth } from "../../auth/context";
import { useFavoritesContext } from "../../profile";
import "./FavoritesPage.css";

const CARDS_PER_PAGE = 8;

const IconSearch: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);

const IconFilter: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const IconChevronLeft: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites, isFavorited, toggleFavorite } = useFavoritesContext();

  const [activeNavId, setActiveNavId] = useState<NavId>("favorites");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getAllDashboardRecipes()
      .then((data) => {
        if (!cancelled) setRecipes(data);
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
  }, [isAuthenticated, navigate]);

  const filteredRecipes = useMemo<Recipe[]>(() => {
    const favoriteIdSet = new Set(favorites.map((recipe) => recipe.id));
    const savedRecipes = recipes.filter((recipe) => favoriteIdSet.has(recipe.id));
    const q = searchQuery.trim().toLowerCase();

    if (!q) return savedRecipes;

    return savedRecipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(q) ||
        recipe.cuisine.toLowerCase().includes(q) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        recipe.mealType.some((meal) => meal.toLowerCase().includes(q)),
    );
  }, [favorites, recipes, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / CARDS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageRecipes = filteredRecipes.slice((safePage - 1) * CARDS_PER_PAGE, safePage * CARDS_PER_PAGE);
  const resultLabel = searchQuery.trim()
    ? `${filteredRecipes.length} result${filteredRecipes.length !== 1 ? "s" : ""}`
    : `${favorites.length} recipes`;

  const handleNavChange = (id: NavId): void => {
    setActiveNavId(id);
    const routes: Partial<Record<NavId, string>> = {
      dashboard: "/dashboard",
      favorites: "/favorites",
      explore: "/explore",
      profile: "/profile-dashboard",
      settings: "/settings",
    };
    if (id === "favorites" && !isAuthenticated) navigate("/login");
    else if (routes[id]) navigate(routes[id]);
  };

  const handleFavoriteToggle = (id: number): void => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const recipe = recipes.find((item) => item.id === id);
    if (recipe) toggleFavorite(recipe);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Escape") {
      setSearchQuery("");
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number): void => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <DashboardLayout
      activeNavId={activeNavId}
      onNavChange={handleNavChange}
      onLogout={logout}
      onUpgrade={() => console.log("[FavoritesPage] upgrade")}
      fetchUserId={Number(user?.userId) || 1}
      notificationCount={2}
      onSearchSubmit={(q) => console.log("[FavoritesPage] global search:", q)}
      onNotificationsClick={() => console.log("[FavoritesPage] notifications")}
      onProfileClick={() => navigate("/profile-dashboard")}
    >
      <div className="fav-page">
        <header className="fav-page__header">
          <div className="fav-page__header-titles">
            <h1 className="fav-page__title">
              My Favorite Recipes
              <span className="fav-page__title-heart" aria-hidden="true"> </span>
            </h1>
            <p className="fav-page__subtitle">{resultLabel}</p>
          </div>
        </header>

        <div className="fav-page__toolbar" role="search">
          <div className="fav-page__search-wrap">
            <span className="fav-page__search-icon" aria-hidden="true"><IconSearch /></span>
            <input className="fav-page__search-input" type="search" placeholder="Search your favorites..." value={searchQuery} onChange={handleSearchChange} onKeyDown={handleSearchKeyDown} aria-label="Search favorite recipes" />
          </div>
          <button className={["fav-page__filter-btn", isFilterOpen ? "fav-page__filter-btn--active" : ""].filter(Boolean).join(" ")} type="button" onClick={() => setIsFilterOpen((v) => !v)} aria-pressed={isFilterOpen} aria-label="Toggle recipe filters">
            <span className="fav-page__filter-btn-icon" aria-hidden="true"><IconFilter /></span>
            Filter
          </button>
        </div>

        {loading ? (
          <div className="fav-page__empty" role="status" aria-live="polite"><p className="fav-page__empty-title">Loading...</p></div>
        ) : error ? (
          <div className="fav-page__empty" role="alert" aria-live="polite"><p className="fav-page__empty-title">{error}</p></div>
        ) : pageRecipes.length > 0 ? (
          <div className="fav-page__grid" role="list" aria-label="Favorite recipes">
            {pageRecipes.map((recipe) => (
              <div key={recipe.id} role="listitem">
                <RecipeCard recipe={recipe} mode="favorite" isFavorite={isFavorited(recipe.id)} onFavoriteToggle={handleFavoriteToggle} onMenuOpen={(id) => console.log("[FavoritesPage] menu for recipe", id)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="fav-page__empty" role="status" aria-live="polite">
            <span className="fav-page__empty-icon" aria-hidden="true"></span>
            <p className="fav-page__empty-title">No recipes found</p>
            <p className="fav-page__empty-body">Try a different search term or clear the filter.</p>
            <button className="fav-page__empty-clear-btn" type="button" onClick={() => setSearchQuery("")}>Clear search</button>
          </div>
        )}

        {filteredRecipes.length > 0 && !searchQuery && (
          <footer className="fav-page__pagination" aria-label="Pagination">
            <p className="fav-page__pagination-label">Showing <span className="fav-page__pagination-label-range">{(safePage - 1) * CARDS_PER_PAGE + 1}-{Math.min(safePage * CARDS_PER_PAGE, filteredRecipes.length)}</span> of {filteredRecipes.length} recipes</p>
            <nav className="fav-page__page-controls" aria-label="Page navigation">
              <button className="fav-page__page-btn fav-page__page-btn--arrow" type="button" onClick={() => handlePageChange(safePage - 1)} disabled={safePage === 1} aria-label="Go to previous page"><IconChevronLeft /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} className={["fav-page__page-btn", page === safePage ? "fav-page__page-btn--active" : ""].filter(Boolean).join(" ")} type="button" onClick={() => handlePageChange(page)} aria-label={`Go to page ${page}`} aria-current={page === safePage ? "page" : undefined}>{page}</button>
              ))}
              <button className="fav-page__page-btn fav-page__page-btn--arrow" type="button" onClick={() => handlePageChange(safePage + 1)} disabled={safePage === totalPages} aria-label="Go to next page"><IconChevronRight /></button>
            </nav>
          </footer>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;


