import React, { useState, useMemo } from "react";

// ── Layout shell ──────────────────────────────────────────────────────────────
import { DashboardLayout } from "../components/Layout";
import type { NavId } from "../components/Layout";

// ── Reusable UI components ────────────────────────────────────────────────────
import { RecipeCard } from "../components/RecipeCard";

// ── Domain types ──────────────────────────────────────────────────────────────
import type {
  DummyJSONUser,
  DummyJSONRecipe,
} from "../../../shared/types/dashboard.types";

// ── Page styles ───────────────────────────────────────────────────────────────
import "./FavoritesPage.css";

// =============================================================================
// Inline SVG icon atoms — co-located for zero extra imports
// =============================================================================

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
    <line x1="4" y1="6"  x2="20" y2="6"  />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const IconChevronLeft: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
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

// =============================================================================
// Pagination config
// =============================================================================

const CARDS_PER_PAGE = 8; // 4×2 grid as shown in design (2 rows × 4 cols)

// =============================================================================
// Mock data — mirrors GET /users/1 and GET /recipes?userId=1
// IDs start at 9 to avoid any collision with DashboardPage mock data.
// Swap these constants with real store selectors / API calls when wiring.
// =============================================================================

const MOCK_USER: DummyJSONUser = {
  id: 1,
  firstName: "Sarah",
  lastName: "Johnson",
  maidenName: "Williams",
  age: 29,
  gender: "female",
  email: "sarah.johnson@x.dummyjson.com",
  phone: "+1 555-123-4567",
  username: "sarahjohnson",
  password: "",
  birthDate: "1995-04-12",
  image: "https://dummyjson.com/icon/sarahjohnson/128",
  bloodGroup: "A+",
  height: 167,
  weight: 58,
  eyeColor: "Brown",
  hair: { color: "Black", type: "Straight" },
  ip: "192.168.1.1",
  address: {
    address: "42 Culinary Lane",
    city: "New York",
    state: "New York",
    stateCode: "NY",
    postalCode: "10001",
    coordinates: { lat: 40.712776, lng: -74.005974 },
    country: "United States",
  },
  macAddress: "00:1B:44:11:3A:B7",
  university: "Culinary Institute of America",
  bank: {
    cardExpire: "06/30",
    cardNumber: "4111111111111111",
    cardType: "Visa",
    currency: "USD",
    iban: "GB29NWBK60161331926819",
  },
  company: {
    department: "Engineering",
    name: "FoodTech Co.",
    title: "Software Engineer",
    address: {
      address: "1 Tech Plaza",
      city: "San Francisco",
      state: "California",
      stateCode: "CA",
      postalCode: "94105",
      coordinates: { lat: 37.7749, lng: -122.4194 },
      country: "United States",
    },
  },
  ein: "12-3456789",
  ssn: "123-45-6789",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  crypto: {
    coin: "Bitcoin",
    wallet: "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
    network: "Ethereum (ERC20)",
  },
  role: "user",
};

// 8 recipes (fills the 4×2 grid in the design).
// These are the user's *saved* favourites — all start as isFavorite: true.
const MOCK_ALL_FAVORITES: DummyJSONRecipe[] = [
  {
    id: 1,
    name: "Creamy Garlic Pasta",
    ingredients: ["400g pasta", "6 garlic cloves", "200ml heavy cream", "100g parmesan", "2 tbsp butter", "Salt", "Black pepper", "Fresh parsley"],
    instructions: ["Boil pasta in salted water until al dente.", "Sauté minced garlic in butter over medium heat.", "Add cream and reduce, then toss with pasta."],
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    caloriesPerServing: 480,
    tags: ["Pasta", "Italian"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/1.webp",
    rating: 4.7,
    reviewCount: 312,
    mealType: ["Dinner"],
  },
  {
    id: 2,
    name: "Honey Glazed Salmon",
    ingredients: ["2 salmon fillets", "3 tbsp honey", "2 tbsp soy sauce", "1 tsp ginger", "1 tbsp olive oil", "Sesame seeds"],
    instructions: ["Whisk glaze ingredients.", "Brush over salmon.", "Sear then bake at 200°C for 8 min."],
    prepTimeMinutes: 5,
    cookTimeMinutes: 20,
    servings: 2,
    difficulty: "Medium",
    cuisine: "Asian",
    caloriesPerServing: 320,
    tags: ["Seafood", "Healthy"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/2.webp",
    rating: 4.8,
    reviewCount: 189,
    mealType: ["Dinner"],
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    ingredients: ["200g dark chocolate", "100g butter", "3 eggs", "60g sugar", "30g flour"],
    instructions: ["Melt chocolate and butter.", "Whisk eggs and sugar.", "Fold and bake 12 min at 200°C."],
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 4,
    difficulty: "Hard",
    cuisine: "French",
    caloriesPerServing: 550,
    tags: ["Desserts", "Chocolate"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/3.webp",
    rating: 4.9,
    reviewCount: 421,
    mealType: ["Dessert"],
  },
  {
    id: 4,
    name: "Avocado Quinoa Salad",
    ingredients: ["200g quinoa", "2 avocados", "200g cherry tomatoes", "Juice of 2 limes", "3 tbsp olive oil", "Fresh coriander"],
    instructions: ["Cook quinoa and cool.", "Dice avocados.", "Dress and toss everything."],
    prepTimeMinutes: 15,
    cookTimeMinutes: 0,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Mexican",
    caloriesPerServing: 290,
    tags: ["Salads", "Vegan"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/4.webp",
    rating: 4.5,
    reviewCount: 97,
    mealType: ["Lunch"],
  },
  {
    id: 9,
    name: "Grilled Chicken Salad",
    ingredients: ["2 chicken breasts", "Mixed salad leaves", "Cherry tomatoes", "Cucumber", "Lemon vinaigrette"],
    instructions: ["Season and grill chicken 6 min each side.", "Slice and arrange over greens.", "Drizzle with vinaigrette."],
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    servings: 2,
    difficulty: "Easy",
    cuisine: "American",
    caloriesPerServing: 310,
    tags: ["Salads", "Healthy", "Protein"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/9.webp",
    rating: 4.6,
    reviewCount: 143,
    mealType: ["Lunch"],
  },
  {
    id: 10,
    name: "Beef Stir Fry",
    ingredients: ["400g beef sirloin", "1 bell pepper", "1 broccoli head", "3 tbsp soy sauce", "1 tbsp sesame oil", "2 garlic cloves", "1 tsp cornstarch"],
    instructions: ["Slice beef thin and marinate.", "Stir-fry vegetables on high heat.", "Add beef and sauce, toss 3 min."],
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Chinese",
    caloriesPerServing: 380,
    tags: ["Beef", "Asian"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/10.webp",
    rating: 4.7,
    reviewCount: 208,
    mealType: ["Dinner"],
  },
  {
    id: 11,
    name: "Tomato Basil Soup",
    ingredients: ["800g plum tomatoes", "1 onion", "4 garlic cloves", "500ml vegetable stock", "100ml cream", "Fresh basil"],
    instructions: ["Roast tomatoes, onion and garlic.", "Blend with stock.", "Stir in cream and basil."],
    prepTimeMinutes: 10,
    cookTimeMinutes: 40,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    caloriesPerServing: 175,
    tags: ["Soup", "Vegetarian"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/11.webp",
    rating: 4.6,
    reviewCount: 167,
    mealType: ["Soup"],
  },
  {
    id: 12,
    name: "Quinoa Buddha Bowl",
    ingredients: ["200g quinoa", "400g chickpeas", "100g kale", "1 sweet potato", "3 tbsp tahini", "1 lemon"],
    instructions: ["Roast sweet potato and chickpeas.", "Cook quinoa.", "Assemble and drizzle with tahini dressing."],
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Mediterranean",
    caloriesPerServing: 420,
    tags: ["Bowl", "Vegan", "Healthy"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/12.webp",
    rating: 4.8,
    reviewCount: 231,
    mealType: ["Bowl"],
  },
];

// Total count the API would return (simulates pagination context)
const MOCK_TOTAL_COUNT = 24;

// =============================================================================
// FavoritesPage
// =============================================================================

const FavoritesPage: React.FC = () => {
  // ── Navigation ─────────────────────────────────────────────────────────────
  const [activeNavId, setActiveNavId] = useState<NavId>("favorites");

  // ── Favourite toggle state ──────────────────────────────────────────────────
  // All recipes in this page start as saved. Toggling removes them from the list.
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(
    () => new Set(MOCK_ALL_FAVORITES.map((r) => r.id))
  );

  // ── Search / filter state ───────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // ── Pagination state ────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(MOCK_TOTAL_COUNT / CARDS_PER_PAGE); // 3

  // ── Derived: client-side search filter on mock data ─────────────────────────
  // In production: drive this with a debounced API call instead.
  const filteredRecipes = useMemo<DummyJSONRecipe[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_ALL_FAVORITES;
    return MOCK_ALL_FAVORITES.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.mealType.some((m) => m.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Visible result count label
  const resultLabel =
    searchQuery.trim()
      ? `${filteredRecipes.length} result${filteredRecipes.length !== 1 ? "s" : ""}`
      : `${MOCK_TOTAL_COUNT} recipes`; // mirrors the "24 recipes" sub-heading in design

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleFavoriteToggle = (id: number): void => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
      return next;
    });
  };

  const handleNavChange = (id: NavId): void => {
    setActiveNavId(id);
    // TODO: router.push(`/${id}`)
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // reset to page 1 on new search
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
    // TODO: trigger API call with skip = (page - 1) * CARDS_PER_PAGE
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout
      // Sidebar
      activeNavId={activeNavId}
      onNavChange={handleNavChange}
      onLogout={() => console.log("[FavoritesPage] logout")}
      onUpgrade={() => console.log("[FavoritesPage] upgrade")}
      // Header — Mode A: pass resolved user
      user={MOCK_USER}
      notificationCount={2}
      onSearchSubmit={(q) => console.log("[FavoritesPage] global search:", q)}
      onNotificationsClick={() => console.log("[FavoritesPage] notifications")}
      onProfileClick={() => console.log("[FavoritesPage] profile menu")}
    >
      <div className="fav-page">

        {/* ================================================================
            PAGE HEADER
            "My Favorite Recipes ❤️" + recipe count sub-heading
            ================================================================ */}
        <header className="fav-page__header">
          <div className="fav-page__header-titles">
            <h1 className="fav-page__title">
              My Favorite Recipes
              <span className="fav-page__title-heart" aria-hidden="true"> ❤️</span>
            </h1>
            <p className="fav-page__subtitle">{resultLabel}</p>
          </div>
        </header>

        {/* ================================================================
            TOOLBAR — inline search + filter button
            Mirrors the thin toolbar row directly below the page header in the design.
            ================================================================ */}
        <div className="fav-page__toolbar" role="search">
          {/* Search input */}
          <div className="fav-page__search-wrap">
            <span className="fav-page__search-icon" aria-hidden="true">
              <IconSearch />
            </span>
            <input
              className="fav-page__search-input"
              type="search"
              placeholder="Search your favorites…"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search favorite recipes"
            />
          </div>

          {/* Filter button */}
          <button
            className={[
              "fav-page__filter-btn",
              isFilterOpen ? "fav-page__filter-btn--active" : "",
            ].filter(Boolean).join(" ")}
            type="button"
            onClick={() => setIsFilterOpen((v) => !v)}
            aria-pressed={isFilterOpen}
            aria-label="Toggle recipe filters"
          >
            <span className="fav-page__filter-btn-icon" aria-hidden="true">
              <IconFilter />
            </span>
            Filter
          </button>
        </div>

        {/* ================================================================
            RECIPE GRID
            4-column grid matching the 4×2 layout in the design.
            Empty-state shown when search returns no results.
            ================================================================ */}
        {filteredRecipes.length > 0 ? (
          <div
            className="fav-page__grid"
            role="list"
            aria-label="Favorite recipes"
          >
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} role="listitem">
                <RecipeCard
                  recipe={recipe}
                  mode="favorite"
                  isFavorite={favoriteIds.has(recipe.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onMenuOpen={(id) =>
                    console.log("[FavoritesPage] menu for recipe", id)
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="fav-page__empty" role="status" aria-live="polite">
            <span className="fav-page__empty-icon" aria-hidden="true">🔍</span>
            <p className="fav-page__empty-title">No recipes found</p>
            <p className="fav-page__empty-body">
              Try a different search term or clear the filter.
            </p>
            <button
              className="fav-page__empty-clear-btn"
              type="button"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </button>
          </div>
        )}

        {/* ================================================================
            PAGINATION
            "Showing 1-8 of 24 recipes" counter + numbered page buttons.
            Matches the bottom row of the Favorites page in the design.
            ================================================================ */}
        {filteredRecipes.length > 0 && !searchQuery && (
          <footer className="fav-page__pagination" aria-label="Pagination">
            {/* Result range label */}
            <p className="fav-page__pagination-label">
              Showing{" "}
              <span className="fav-page__pagination-label-range">
                {(currentPage - 1) * CARDS_PER_PAGE + 1}–
                {Math.min(currentPage * CARDS_PER_PAGE, MOCK_TOTAL_COUNT)}
              </span>{" "}
              of {MOCK_TOTAL_COUNT} recipes
            </p>

            {/* Page controls */}
            <nav className="fav-page__page-controls" aria-label="Page navigation">
              {/* Previous */}
              <button
                className="fav-page__page-btn fav-page__page-btn--arrow"
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
              >
                <IconChevronLeft />
              </button>

              {/* Numbered pages */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={[
                    "fav-page__page-btn",
                    page === currentPage ? "fav-page__page-btn--active" : "",
                  ].filter(Boolean).join(" ")}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                className="fav-page__page-btn fav-page__page-btn--arrow"
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
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

export default FavoritesPage;