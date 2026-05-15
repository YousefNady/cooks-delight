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
// Mock data — mirrors GET /recipes?limit=20
// IDs 1–12 are already used in other pages; using 13–20 for the unique set,
// plus recycling 1–8 to fill out a realistic 16-recipe catalogue.
// In production: replace with a paginated API call.
// =============================================================================

const MOCK_USER: DummyJSONUser = {
  id: 1, firstName: "Sarah", lastName: "Johnson", maidenName: "Williams",
  age: 29, gender: "female", email: "sarah.johnson@x.dummyjson.com",
  phone: "+1 555-123-4567", username: "sarahjohnson", password: "",
  birthDate: "1995-04-12", image: "https://dummyjson.com/icon/sarahjohnson/128",
  bloodGroup: "A+", height: 167, weight: 58, eyeColor: "Brown",
  hair: { color: "Black", type: "Straight" }, ip: "192.168.1.1",
  address: {
    address: "42 Culinary Lane", city: "New York", state: "New York",
    stateCode: "NY", postalCode: "10001",
    coordinates: { lat: 40.712776, lng: -74.005974 }, country: "United States",
  },
  macAddress: "00:1B:44:11:3A:B7", university: "Culinary Institute of America",
  bank: { cardExpire: "06/30", cardNumber: "4111111111111111", cardType: "Visa", currency: "USD", iban: "GB29NWBK60161331926819" },
  company: {
    department: "Engineering", name: "FoodTech Co.", title: "Software Engineer",
    address: { address: "1 Tech Plaza", city: "San Francisco", state: "California", stateCode: "CA", postalCode: "94105", coordinates: { lat: 37.7749, lng: -122.4194 }, country: "United States" },
  },
  ein: "12-3456789", ssn: "123-45-6789",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  crypto: { coin: "Bitcoin", wallet: "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a", network: "Ethereum (ERC20)" },
  role: "user",
};

// 16-recipe catalogue covering every category chip so filters produce results
const MOCK_ALL_RECIPES: DummyJSONRecipe[] = [
  // ── IDs 1–8 recycled from DashboardPage ──
  { id: 1,  name: "Creamy Garlic Pasta",     ingredients: ["Pasta","Garlic","Cream","Parmesan"],          instructions: ["Boil pasta","Sauté garlic","Add cream","Toss"],         prepTimeMinutes: 10, cookTimeMinutes: 20, servings: 4, difficulty: "Easy",   cuisine: "Italian",       caloriesPerServing: 480, tags: ["Pasta","Italian"],           userId: 2, image: "https://cdn.dummyjson.com/recipe-images/1.webp",  rating: 4.6, reviewCount: 128, mealType: ["Dinner"]    },
  { id: 2,  name: "Honey Glazed Salmon",     ingredients: ["Salmon","Honey","Soy sauce","Ginger"],        instructions: ["Mix glaze","Brush salmon","Sear","Bake"],                prepTimeMinutes: 5,  cookTimeMinutes: 20, servings: 2, difficulty: "Medium", cuisine: "Asian",          caloriesPerServing: 320, tags: ["Seafood","Healthy"],          userId: 2, image: "https://cdn.dummyjson.com/recipe-images/2.webp",  rating: 4.8, reviewCount: 96,  mealType: ["Dinner"]    },
  { id: 3,  name: "Chocolate Lava Cake",     ingredients: ["Dark chocolate","Butter","Eggs","Flour"],     instructions: ["Melt chocolate","Whisk eggs","Fold","Bake"],             prepTimeMinutes: 15, cookTimeMinutes: 30, servings: 4, difficulty: "Hard",   cuisine: "French",        caloriesPerServing: 550, tags: ["Desserts","Chocolate"],       userId: 3, image: "https://cdn.dummyjson.com/recipe-images/3.webp",  rating: 4.9, reviewCount: 211, mealType: ["Dessert"]   },
  { id: 4,  name: "Avocado Quinoa Salad",    ingredients: ["Quinoa","Avocado","Tomatoes","Lime"],         instructions: ["Cook quinoa","Dice avocado","Dress","Toss"],              prepTimeMinutes: 15, cookTimeMinutes: 0,  servings: 2, difficulty: "Easy",   cuisine: "Mexican",       caloriesPerServing: 290, tags: ["Salads","Vegan"],             userId: 4, image: "https://cdn.dummyjson.com/recipe-images/4.webp",  rating: 4.5, reviewCount: 74,  mealType: ["Lunch"]     },
  { id: 5,  name: "Roasted Tomato Soup",     ingredients: ["Tomatoes","Onion","Stock","Cream"],           instructions: ["Roast tomatoes","Blend","Add cream","Season"],           prepTimeMinutes: 10, cookTimeMinutes: 10, servings: 4, difficulty: "Easy",   cuisine: "Italian",       caloriesPerServing: 180, tags: ["Soup","Vegetarian"],          userId: 5, image: "https://cdn.dummyjson.com/recipe-images/5.webp",  rating: 4.6, reviewCount: 128, mealType: ["Soup"]      },
  { id: 6,  name: "Margherita Pizza",        ingredients: ["Dough","Passata","Mozzarella","Basil"],       instructions: ["Stretch dough","Add sauce","Top","Bake"],                prepTimeMinutes: 20, cookTimeMinutes: 15, servings: 4, difficulty: "Medium", cuisine: "Italian",       caloriesPerServing: 300, tags: ["Pizza","Vegetarian"],          userId: 6, image: "https://cdn.dummyjson.com/recipe-images/6.webp",  rating: 4.7, reviewCount: 96,  mealType: ["Dinner"]    },
  { id: 7,  name: "Quinoa Buddha Bowl",      ingredients: ["Quinoa","Chickpeas","Kale","Tahini"],         instructions: ["Roast chickpeas","Cook quinoa","Assemble","Drizzle"],    prepTimeMinutes: 15, cookTimeMinutes: 10, servings: 2, difficulty: "Easy",   cuisine: "Mediterranean", caloriesPerServing: 420, tags: ["Bowl","Vegan"],               userId: 7, image: "https://cdn.dummyjson.com/recipe-images/7.webp",  rating: 4.8, reviewCount: 112, mealType: ["Bowl"]      },
  { id: 8,  name: "Berry Pancakes",          ingredients: ["Flour","Milk","Eggs","Berries","Maple syrup"],instructions: ["Mix batter","Cook pancakes","Stack","Top with berries"], prepTimeMinutes: 10, cookTimeMinutes: 10, servings: 4, difficulty: "Easy",   cuisine: "American",      caloriesPerServing: 310, tags: ["Breakfast","Pancakes"],       userId: 8, image: "https://cdn.dummyjson.com/recipe-images/8.webp",  rating: 4.5, reviewCount: 80,  mealType: ["Breakfast"] },
  // ── IDs 13–20 — new recipes unique to ExplorePage ──
  { id: 13, name: "Classic Eggs Benedict",   ingredients: ["English muffins","Eggs","Ham","Hollandaise"], instructions: ["Poach eggs","Toast muffins","Layer","Sauce"],             prepTimeMinutes: 15, cookTimeMinutes: 15, servings: 2, difficulty: "Hard",   cuisine: "American",      caloriesPerServing: 490, tags: ["Breakfast","Eggs"],           userId: 2, image: "https://cdn.dummyjson.com/recipe-images/13.webp", rating: 4.7, reviewCount: 183, mealType: ["Breakfast"] },
  { id: 14, name: "Thai Green Curry",        ingredients: ["Coconut milk","Green curry paste","Chicken","Bamboo shoots"], instructions: ["Fry paste","Add coconut milk","Simmer","Serve with rice"], prepTimeMinutes: 10, cookTimeMinutes: 25, servings: 4, difficulty: "Medium", cuisine: "Thai",          caloriesPerServing: 410, tags: ["Curry","Asian"],              userId: 3, image: "https://cdn.dummyjson.com/recipe-images/14.webp", rating: 4.8, reviewCount: 224, mealType: ["Dinner"]    },
  { id: 15, name: "Caesar Salad",            ingredients: ["Romaine","Parmesan","Croutons","Caesar dressing"], instructions: ["Wash romaine","Make dressing","Toss","Top with croutons"], prepTimeMinutes: 15, cookTimeMinutes: 0, servings: 2, difficulty: "Easy",   cuisine: "American",      caloriesPerServing: 240, tags: ["Salads","Vegetarian"],        userId: 4, image: "https://cdn.dummyjson.com/recipe-images/15.webp", rating: 4.4, reviewCount: 97,  mealType: ["Lunch"]     },
  { id: 16, name: "Beef Tacos",              ingredients: ["Beef mince","Taco shells","Salsa","Cheese","Sour cream"], instructions: ["Brown beef","Season","Fill shells","Top"],    prepTimeMinutes: 10, cookTimeMinutes: 15, servings: 4, difficulty: "Easy",   cuisine: "Mexican",       caloriesPerServing: 360, tags: ["Tacos","Beef"],               userId: 5, image: "https://cdn.dummyjson.com/recipe-images/16.webp", rating: 4.6, reviewCount: 142, mealType: ["Dinner"]    },
  { id: 17, name: "Tiramisu",                ingredients: ["Mascarpone","Ladyfingers","Espresso","Cocoa","Eggs"], instructions: ["Brew espresso","Dip ladyfingers","Layer","Chill overnight"], prepTimeMinutes: 30, cookTimeMinutes: 0, servings: 8, difficulty: "Medium", cuisine: "Italian",       caloriesPerServing: 380, tags: ["Desserts","Italian","NoB ake"], userId: 6, image: "https://cdn.dummyjson.com/recipe-images/17.webp", rating: 4.9, reviewCount: 307, mealType: ["Dessert"]   },
  { id: 18, name: "Miso Ramen",              ingredients: ["Ramen noodles","Miso paste","Pork broth","Soft-boiled egg","Nori"], instructions: ["Prepare broth","Cook noodles","Assemble bowl","Garnish"], prepTimeMinutes: 20, cookTimeMinutes: 40, servings: 2, difficulty: "Hard",   cuisine: "Japanese",      caloriesPerServing: 520, tags: ["Soup","Asian","Noodles"],     userId: 7, image: "https://cdn.dummyjson.com/recipe-images/18.webp", rating: 4.9, reviewCount: 389, mealType: ["Soup"]      },
  { id: 19, name: "Greek Salad",             ingredients: ["Cucumber","Tomatoes","Olives","Feta","Red onion"], instructions: ["Chop veg","Crumble feta","Dress with olive oil","Season"], prepTimeMinutes: 10, cookTimeMinutes: 0, servings: 2, difficulty: "Easy",   cuisine: "Greek",         caloriesPerServing: 210, tags: ["Salads","Vegetarian","Mediterranean"], userId: 8, image: "https://cdn.dummyjson.com/recipe-images/19.webp", rating: 4.5, reviewCount: 118, mealType: ["Lunch"]     },
  { id: 20, name: "Mushroom Risotto",        ingredients: ["Arborio rice","Porcini mushrooms","White wine","Parmesan","Stock"], instructions: ["Toast rice","Add wine","Ladle stock gradually","Stir in parmesan"], prepTimeMinutes: 10, cookTimeMinutes: 35, servings: 4, difficulty: "Medium", cuisine: "Italian",       caloriesPerServing: 450, tags: ["Risotto","Vegetarian","Italian"], userId: 2, image: "https://cdn.dummyjson.com/recipe-images/20.webp", rating: 4.7, reviewCount: 165, mealType: ["Dinner"]    },
];

const MOCK_TOTAL_COUNT = MOCK_ALL_RECIPES.length; // 16 — represents a full catalogue slice

// =============================================================================
// Sort comparator — pure function, easy to unit-test
// =============================================================================

function sortRecipes(recipes: DummyJSONRecipe[], key: SortKey): DummyJSONRecipe[] {
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
  // ── Navigation ─────────────────────────────────────────────────────────────
  const [activeNavId, setActiveNavId] = useState<NavId>("dashboard");

  // ── Filter state ───────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [searchQuery,    setSearchQuery]     = useState<string>("");
  const [sortKey,        setSortKey]         = useState<SortKey>("rating");
  const [isSortOpen,     setIsSortOpen]      = useState<boolean>(false);

  // ── Favourites state ───────────────────────────────────────────────────────
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(
    new Set([1, 2, 3, 7]),
  );

  // ── Pagination ─────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState<number>(1);

  // ── Derived: filter → sort → paginate ─────────────────────────────────────
  const filteredAndSorted = useMemo<DummyJSONRecipe[]>(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1 — category filter
    let result = MOCK_ALL_RECIPES.filter((r) => {
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
  }, [activeCategory, searchQuery, sortKey]);

  // Paginated slice
  const totalFiltered = filteredAndSorted.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / CARDS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const pageRecipes   = filteredAndSorted.slice(
    (safePage - 1) * CARDS_PER_PAGE,
    safePage * CARDS_PER_PAGE,
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

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

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? "Sort by";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout
      activeNavId={activeNavId}
      onNavChange={handleNavChange}
      onLogout={() => console.log("[ExplorePage] logout")}
      onUpgrade={() => console.log("[ExplorePage] upgrade")}
      user={MOCK_USER}
      notificationCount={2}
      onSearchSubmit={(q) => console.log("[ExplorePage] global search:", q)}
      onNotificationsClick={() => console.log("[ExplorePage] notifications")}
      onProfileClick={() => console.log("[ExplorePage] profile menu")}
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
              <span className="exp-page__title-emoji" aria-hidden="true"> 🍳</span>
            </h1>
            <p className="exp-page__subtitle">
              {totalFiltered === MOCK_TOTAL_COUNT
                ? `${MOCK_TOTAL_COUNT} recipes to discover`
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
        {pageRecipes.length > 0 ? (
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
                  isFavorite={favoriteIds.has(recipe.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onMenuOpen={(id) =>
                    console.log("[ExplorePage] menu for recipe", id)
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="exp-page__empty" role="status" aria-live="polite">
            <span className="exp-page__empty-icon" aria-hidden="true">🔍</span>
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