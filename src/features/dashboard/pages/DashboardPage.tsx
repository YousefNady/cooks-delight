import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Layout shell ─────────────────────────────────────────────────────────────
import { DashboardLayout } from "../components/Layout";
import type { NavId } from "../components/Layout";

// ── Reusable UI components ────────────────────────────────────────────────────
import { StatsCard }       from "../components/StatsCard";
import { RecipeCard }      from "../components/RecipeCard";
import { PromotionalCard } from "../components/PromotionalCard";

// ── Domain types ─────────────────────────────────────────────────────────────
import type { DummyJSONUser } from "../../../shared/types/dashboard.types";
import type { Recipe, User } from "../types";
import { getDashboardRecipes } from "../../recipes/services/API";
import { useAuth } from "../../auth/context";
import { useFavoritesContext } from "../../profile";

// ── Page-level styles ─────────────────────────────────────────────────────────
import "./DashboardPage.css";

const RECENTLY_VIEWED_KEY = "cd_recently_viewed";

function readRecentlyViewedCount(): number {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

// =============================================================================
// Inline SVG icon atoms
// NOTE: Move to src/components/icons/index.tsx once the icon set grows beyond
// a handful. Keeping them co-located here avoids a premature abstraction.
// =============================================================================

const IconHeart: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconEye: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const IconBookOpen: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconCrown: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);

const IconStarOutline: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconCart: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconPencil: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconChevronRight: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconChefHat: React.FC = () => (
  <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
    {/* Toque brim */}
    <rect x="8" y="28" width="24" height="4" rx="1.5"
      stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    <rect x="10" y="32" width="20" height="3" rx="1"
      stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* Hat dome */}
    <path d="M14 28c0-3.5 0-8 6-10a6 6 0 0 1 12 0c6 2 6 6.5 6 10"
      stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* Small tuft */}
    <path d="M20 14v-3M17 15.5l-2-2M23 15.5l2-2"
      stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// =============================================================================
// =============================================================================
// DashboardPage
// =============================================================================

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { favorites, isFavorited, toggleFavorite } = useFavoritesContext();

  // ── Navigation ────────────────────────────────────────────────────────────
  const [activeNavId, setActiveNavId] = useState<NavId>("dashboard");

  // ── Favourite IDs ─────────────────────────────────────────────────────────
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState<boolean>(true);
  const [recipesError, setRecipesError] = useState<string | null>(null);
  const [dashboardUser, setDashboardUser] = useState<DummyJSONUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    setRecipesLoading(true);
    setRecipesError(null);

    getDashboardRecipes(8)
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

  useEffect(() => {
    const controller = new AbortController();
    const userId = Number(authUser?.userId) || 1;

    fetch(`https://dummyjson.com/users/${userId}`, {
      signal: controller.signal,
    })
      .then<DummyJSONUser>((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setDashboardUser)
      .catch((error: Error) => {
        if (error.name !== "AbortError") setDashboardUser(null);
      });

    return () => controller.abort();
  }, [authUser?.userId]);

  const favoriteRecipes = useMemo<Recipe[]>(() => {
    const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));

    return favorites.map((favorite) => {
      const matchedRecipe = recipesById.get(favorite.id);
      if (matchedRecipe) return matchedRecipe;

      return {
        id: favorite.id,
        name: favorite.name,
        image: favorite.image,
        ingredients: [],
        instructions: [],
        prepTimeMinutes: favorite.prepTimeMinutes ?? 0,
        cookTimeMinutes: favorite.cookTimeMinutes ?? 0,
        servings: favorite.servings ?? 0,
        difficulty: favorite.difficulty ?? "Easy",
        cuisine: favorite.cuisine ?? "Recipe",
        caloriesPerServing: 0,
        tags: [],
        userId: Number(authUser?.userId) || 0,
        rating: 0,
        reviewCount: 0,
        mealType: [favorite.cuisine ?? "Recipe"],
      };
    });
  }, [authUser?.userId, favorites, recipes]);

  const exploreRecipes = useMemo(
    () => recipes.filter((recipe) => !isFavorited(recipe.id)).slice(0, 4),
    [recipes, isFavorited, favorites],
  );

  const profileUser: User = {
    id: dashboardUser?.id ?? Number(authUser?.userId) ?? 0,
    firstName: dashboardUser?.firstName ?? authUser?.username ?? "Guest",
    lastName: dashboardUser?.lastName ?? "",
    email: dashboardUser?.email ?? authUser?.email ?? "Sign in to save favorites",
    image:
      dashboardUser?.image ??
      authUser?.image ??
      "https://ui-avatars.com/api/?name=Guest&background=f97316&color=fff&size=128",
  };

  const dashboardStats = {
    savedRecipes: favorites.length,
    recentlyViewed: readRecentlyViewedCount(),
    recipesExplored: recipes.length,
  };

  // ── Handlers ─────────────────────────────────────────────────────────────

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
      "recently-viewed": "/recently-viewed",
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

  const handleNotify = (feature: string) => (): void => {
    // TODO: POST /notifications/subscribe  { feature }
    console.log(`[DashboardPage] notify: ${feature}`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout
      // ── Sidebar props ──────────────────────────────────────────────────────
      activeNavId={activeNavId}
      onNavChange={handleNavChange}
      onLogout={logout}
      onUpgrade={() => console.log("[DashboardPage] upgrade")}
      // ── Header props — Mode A: pre-resolved user object ───────────────────
      user={dashboardUser ?? undefined}
      notificationCount={2}
      onSearchSubmit={(q) => console.log("[DashboardPage] search:", q)}
      onSearchChange={(q) => console.log("[DashboardPage] search change:", q)}
      onNotificationsClick={() => console.log("[DashboardPage] notifications")}
      onProfileClick={() => navigate("/profile-dashboard")}
    >

      {/* ================================================================
          PAGE ROOT
          The page is split into two visual columns that run top-to-bottom:
            Left / Main  → Stats row, Favorites, Explore  (fluid width)
            Right / Aside → Profile card, 3× Promo cards  (fixed ~292 px)

          Implementation: a single CSS Grid with named template areas keeps
          both columns in perfect vertical sync without nested grids.
          ================================================================ */}
      <div className="dp">

        {/* ── STATS ROW — left column ── */}
        <div className="dp__stats-row">
          <StatsCard
            icon={<IconHeart />}
            variant="orange"
            value={dashboardStats.savedRecipes}
            label="Saved Recipes"
            helperText="Your favorite recipes"
          />
          <StatsCard
            icon={<IconEye />}
            variant="green"
            value={dashboardStats.recentlyViewed}
            label="Recently Viewed"
            helperText="Recipes you explored"
          />
          <StatsCard
            icon={<IconBookOpen />}
            variant="purple"
            value={dashboardStats.recipesExplored}
            label="Recipes Explored"
            helperText="Keep exploring!"
          />
        </div>

        {/* ── PROFILE CARD — right column, spans vertically as sticky sidebar ── */}
        <aside
          className="dp__profile-card"
          aria-label={`Signed in as ${profileUser.firstName} ${profileUser.lastName}`}
        >
          <img
            className="dp__profile-avatar"
            src={profileUser.image}
            alt={`${profileUser.firstName} ${profileUser.lastName}`}
            width={72}
            height={72}
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.src = `https://ui-avatars.com/api/?name=${profileUser.firstName}+${profileUser.lastName}&background=f97316&color=fff&size=128`;
            }}
          />
          <div className="dp__profile-meta">
            <p className="dp__profile-name">
              {profileUser.firstName} {profileUser.lastName}
            </p>
            <p className="dp__profile-email">{profileUser.email}</p>
          </div>
          <button
            className="dp__profile-edit-btn"
            type="button"
            onClick={() => console.log("[DashboardPage] edit profile")}
            aria-label="Edit your profile"
          >
            <span className="dp__profile-edit-btn-icon" aria-hidden="true">
              <IconPencil />
            </span>
            Edit Profile
          </button>
        </aside>

        {/* ── FAVORITES SECTION — left column ── */}
        <section
          className="dp__section dp__favorites"
          aria-labelledby="dp-favorites-title"
        >
          <header className="dp__section-header">
            <h2 className="dp__section-title" id="dp-favorites-title">
              Your Favorite Recipes
            </h2>
            <button
              className="dp__view-all-btn"
              type="button"
              onClick={() => isAuthenticated ? navigate("/favorites") : navigate("/login")}
              aria-label="View all favorite recipes"
            >
              View all
              <span className="dp__view-all-btn-icon" aria-hidden="true">
                <IconChevronRight />
              </span>
            </button>
          </header>

          <div className="dp__card-grid" role="list" aria-label="Favorite recipes">
            {recipesLoading && <p role="status">Loading recipes...</p>}
            {recipesError && <p role="alert">{recipesError}</p>}
            {!recipesLoading && !recipesError && favoriteRecipes.length === 0 && (
              <p role="status">No favorite recipes yet.</p>
            )}
            {!recipesLoading && !recipesError && favoriteRecipes.map((recipe) => (
              <div key={recipe.id} role="listitem">
                <RecipeCard
                  recipe={recipe}
                  mode="favorite"
                  isFavorite={isFavorited(recipe.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onMenuOpen={(id) =>
                    console.log("[DashboardPage] menu opened for recipe", id)
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── PROMO COLUMN — right column, below profile card ── */}
        <aside
          className="dp__promo-column"
          aria-label="Upcoming features"
        >
          <PromotionalCard
            variant="orange"
            icon={<IconCrown />}
            title="Try Premium"
            description="Get early access to exclusive recipes and powerful features."
            hasNotificationBadge
            onNotify={handleNotify("premium")}
          />
          <PromotionalCard
            variant="blue"
            icon={<IconStarOutline />}
            title="Leave Reviews"
            description="Share your thoughts and help others discover great recipes."
            hasNotificationBadge
            onNotify={handleNotify("reviews")}
          />
          <PromotionalCard
            variant="green"
            icon={<IconCart />}
            title="Shopping List"
            description="Plan your meals and shop everything in one place."
            hasNotificationBadge
            onNotify={handleNotify("shopping")}
          />
        </aside>

        {/* ── EXPLORE SECTION — left column ── */}
        <section
          className="dp__section dp__explore"
          aria-labelledby="dp-explore-title"
        >
          <header className="dp__section-header">
            <h2 className="dp__section-title" id="dp-explore-title">
              Continue Exploring
            </h2>
            <button
              className="dp__view-all-btn"
              type="button"
              onClick={() => navigate("/explore")}
              aria-label="View all recipes"
            >
              View all recipes
              <span className="dp__view-all-btn-icon" aria-hidden="true">
                <IconChevronRight />
              </span>
            </button>
          </header>

          <div className="dp__card-grid" role="list" aria-label="Recipes to explore">
            {recipesLoading && <p role="status">Loading recipes...</p>}
            {recipesError && <p role="alert">{recipesError}</p>}
            {!recipesLoading && !recipesError && exploreRecipes.length === 0 && (
              <p role="status">No recipes to explore yet.</p>
            )}
            {!recipesLoading && !recipesError && exploreRecipes.map((recipe) => (
              <div key={recipe.id} role="listitem">
                <RecipeCard
                  recipe={recipe}
                  mode="explore"
                  isFavorite={isFavorited(recipe.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── QUOTE BANNER — full-width, spans both columns ── */}
        <footer
          className="dp__quote-banner"
          aria-label="Culinary inspiration"
        >
          {/* Left: chef icon + blockquote */}
          <div className="dp__quote-body">
            <span className="dp__quote-chef-icon" aria-hidden="true">
              <IconChefHat />
            </span>
            <blockquote className="dp__quote-block">
              <p className="dp__quote-text">
                "Cooking is an art, but all art requires knowing something about
                the techniques and ingredients."
              </p>
              <cite className="dp__quote-author">— Nathan Myhrvold</cite>
            </blockquote>
          </div>

          {/* Right: decorative food photograph — fades into banner on left edge */}
          <div className="dp__quote-photo" aria-hidden="true">
            <img
              className="dp__quote-photo-img"
              src="https://images.unsplash.com/photo-1506368083636-6defb67639a7?auto=format&fit=crop&w=640&q=75"
              alt=""
              loading="lazy"
            />
          </div>
        </footer>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
