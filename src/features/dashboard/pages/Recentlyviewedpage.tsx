import React, { useState, useMemo } from "react";

// ── Layout shell ──────────────────────────────────────────────────────────────
import { DashboardLayout } from "../components/Layout";
import type { NavId } from "../components/Layout";

// ── Domain types ──────────────────────────────────────────────────────────────
import type {
  DummyJSONUser,
  DummyJSONRecipe,
} from "../../../shared/types/dashboard.types";

// ── Page styles ───────────────────────────────────────────────────────────────
import "./RecentlyViewedPage.css";

// =============================================================================
// Inline SVG icons — zero external-library dependency
// =============================================================================

const IconSearch: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);

const IconFilter: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4"  y1="6"  x2="20" y2="6"  />
    <line x1="8"  y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const IconClock: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconChevronRight: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconTrash: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

// =============================================================================
// Local type — augments DummyJSONRecipe with view-history metadata.
// In production this would come from a GET /history or GET /recently-viewed
// endpoint that returns recipes + timestamps.
// =============================================================================

interface ViewedRecipe {
  recipe: DummyJSONRecipe;
  /**
   * ISO-8601 string — when the user last viewed this recipe.
   * Drives the "Viewed X ago" label.
   */
  viewedAt: string;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Converts an ISO-8601 date string into a human-readable relative label
 * matching the design: "2 hours ago", "5 hours ago", "Yesterday", "2 days ago".
 */
function formatRelativeTime(isoString: string): string {
  const now  = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMins  = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays  = Math.floor(diffMs / 86_400_000);

  if (diffMins  <  1)  return "Just now";
  if (diffMins  < 60)  return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours <  2)  return "1 hour ago";
  if (diffHours < 24)  return `${diffHours} hours ago`;
  if (diffDays  === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

/** Returns the first mealType or cuisine tag as the pill shown in the design. */
function derivePrimaryTag(recipe: DummyJSONRecipe): string {
  return recipe.mealType?.[0] ?? recipe.cuisine ?? recipe.tags?.[0] ?? "Recipe";
}

/** Total cook time string matching RecipeCard's format. */
function formatTotalTime(prep: number, cook: number): string {
  const total = prep + cook;
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

// =============================================================================
// RecentlyViewedRow — the single list-row shown in the design:
//   [thumbnail] [title + meta pills] [time-ago]  [chevron]
//
// Built inline here — not a shared component — because this exact layout is
// used only on this page. Export it to components/ if another page needs it.
// =============================================================================

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
  const timeLabel   = formatRelativeTime(viewedAt);
  const primaryTag  = derivePrimaryTag(recipe);
  const totalTime   = formatTotalTime(recipe.prepTimeMinutes, recipe.cookTimeMinutes);
  const fallbackSrc = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=70`;

  return (
    <article
      className="rv-row"
      role="listitem"
      aria-label={`${recipe.name}, viewed ${timeLabel}`}
    >
      {/* ── Thumbnail ── */}
      <div className="rv-row__thumb-wrap">
        <img
          className="rv-row__thumb"
          src={recipe.image || fallbackSrc}
          alt={recipe.name}
          width={80}
          height={80}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackSrc;
          }}
        />
      </div>

      {/* ── Main content: title + meta ── */}
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
          <span className="rv-row__meta-sep" aria-hidden="true">•</span>
          <span className="rv-row__meta-tag">{primaryTag}</span>
        </div>
      </button>

      {/* ── Viewed-at timestamp ── */}
      <div className="rv-row__timestamp" aria-label={`Viewed ${timeLabel}`}>
        <span className="rv-row__timestamp-label">Viewed {timeLabel}</span>
      </div>

      {/* ── Remove button ── */}
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

      {/* ── Navigate chevron ── */}
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

// =============================================================================
// Mock data
// IDs 13–17 are fresh — no collision with DashboardPage (1–8) or
// FavoritesPage (1–4, 9–12).
// viewedAt values are relative to a static reference so they render
// consistently regardless of when the file is loaded.
// In production replace with: GET /users/1/history?limit=20
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
    address: "42 Culinary Lane", city: "New York", state: "New York",
    stateCode: "NY", postalCode: "10001",
    coordinates: { lat: 40.712776, lng: -74.005974 },
    country: "United States",
  },
  macAddress: "00:1B:44:11:3A:B7",
  university: "Culinary Institute of America",
  bank: {
    cardExpire: "06/30", cardNumber: "4111111111111111",
    cardType: "Visa", currency: "USD", iban: "GB29NWBK60161331926819",
  },
  company: {
    department: "Engineering", name: "FoodTech Co.", title: "Software Engineer",
    address: {
      address: "1 Tech Plaza", city: "San Francisco", state: "California",
      stateCode: "CA", postalCode: "94105",
      coordinates: { lat: 37.7749, lng: -122.4194 },
      country: "United States",
    },
  },
  ein: "12-3456789", ssn: "123-45-6789",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  crypto: { coin: "Bitcoin", wallet: "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a", network: "Ethereum (ERC20)" },
  role: "user",
};

/** Helper: returns an ISO string N hours before now, for stable relative labels. */
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}
function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86_400_000).toISOString();
}

const MOCK_VIEWED_RECIPES: ViewedRecipe[] = [
  {
    viewedAt: hoursAgo(2),
    recipe: {
      id: 9,
      name: "Grilled Chicken Salad",
      ingredients: ["2 chicken breasts", "Mixed salad leaves", "Cherry tomatoes", "Cucumber", "Lemon vinaigrette"],
      instructions: ["Season and grill chicken 6 min each side.", "Slice and arrange over greens.", "Drizzle with vinaigrette."],
      prepTimeMinutes: 10, cookTimeMinutes: 12, servings: 2,
      difficulty: "Easy", cuisine: "American", caloriesPerServing: 310,
      tags: ["Salads", "Healthy", "Protein"],
      userId: 1,
      image: "https://cdn.dummyjson.com/recipe-images/9.webp",
      rating: 4.6, reviewCount: 143,
      mealType: ["Lunch"],
    },
  },
  {
    viewedAt: hoursAgo(5),
    recipe: {
      id: 7,
      name: "Quinoa Buddha Bowl",
      ingredients: ["200g quinoa", "400g chickpeas", "100g kale", "1 sweet potato", "3 tbsp tahini", "1 lemon"],
      instructions: ["Roast sweet potato and chickpeas.", "Cook quinoa.", "Assemble and drizzle with tahini dressing."],
      prepTimeMinutes: 15, cookTimeMinutes: 10, servings: 2,
      difficulty: "Easy", cuisine: "Mediterranean", caloriesPerServing: 420,
      tags: ["Bowl", "Healthy", "Vegan"],
      userId: 1,
      image: "https://cdn.dummyjson.com/recipe-images/7.webp",
      rating: 4.8, reviewCount: 112,
      mealType: ["Bowl"],
    },
  },
  {
    viewedAt: daysAgo(1),
    recipe: {
      id: 10,
      name: "Beef Stir Fry",
      ingredients: ["400g beef sirloin", "1 bell pepper", "1 broccoli head", "3 tbsp soy sauce", "1 tbsp sesame oil"],
      instructions: ["Slice beef thin.", "Stir-fry vegetables on high heat.", "Add beef and sauce, toss 3 min."],
      prepTimeMinutes: 15, cookTimeMinutes: 15, servings: 4,
      difficulty: "Medium", cuisine: "Chinese", caloriesPerServing: 380,
      tags: ["Beef", "Asian"],
      userId: 1,
      image: "https://cdn.dummyjson.com/recipe-images/10.webp",
      rating: 4.7, reviewCount: 208,
      mealType: ["Dinner"],
    },
  },
  {
    viewedAt: daysAgo(2),
    recipe: {
      id: 1,
      name: "Creamy Garlic Pasta",
      ingredients: ["400g pasta", "6 garlic cloves", "200ml heavy cream", "100g parmesan", "2 tbsp butter"],
      instructions: ["Boil pasta.", "Sauté garlic.", "Add cream and toss with pasta."],
      prepTimeMinutes: 10, cookTimeMinutes: 20, servings: 4,
      difficulty: "Easy", cuisine: "Italian", caloriesPerServing: 480,
      tags: ["Pasta", "Italian"],
      userId: 1,
      image: "https://cdn.dummyjson.com/recipe-images/1.webp",
      rating: 4.7, reviewCount: 312,
      mealType: ["Dinner"],
    },
  },
  {
    viewedAt: daysAgo(2),
    recipe: {
      id: 3,
      name: "Chocolate Lava Cake",
      ingredients: ["200g dark chocolate", "100g butter", "3 eggs", "60g sugar", "30g flour"],
      instructions: ["Melt chocolate and butter.", "Whisk eggs and sugar.", "Bake 12 min at 200°C."],
      prepTimeMinutes: 15, cookTimeMinutes: 30, servings: 4,
      difficulty: "Hard", cuisine: "French", caloriesPerServing: 550,
      tags: ["Desserts", "Chocolate"],
      userId: 1,
      image: "https://cdn.dummyjson.com/recipe-images/3.webp",
      rating: 4.9, reviewCount: 421,
      mealType: ["Dessert"],
    },
  },
];

// =============================================================================
// RecentlyViewedPage
// =============================================================================

const RecentlyViewedPage: React.FC = () => {
  // ── Navigation ─────────────────────────────────────────────────────────────
  const [activeNavId, setActiveNavId] = useState<NavId>("favorites");
  // NOTE: "recently-viewed" is not in the current NavId union — your team will
  // add it to Sidebar.tsx when the route is wired. Using "favorites" as a
  // safe placeholder keeps TypeScript happy today.

  // ── View history state ─────────────────────────────────────────────────────
  const [viewedItems, setViewedItems] = useState<ViewedRecipe[]>(MOCK_VIEWED_RECIPES);

  // ── Search / filter state ───────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]     = useState<string>("");
  const [isFilterOpen, setIsFilterOpen]   = useState<boolean>(false);

  // ── Derived: client-side search filter ────────────────────────────────────
  const filteredItems = useMemo<ViewedRecipe[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return viewedItems;
    return viewedItems.filter(
      ({ recipe: r }) =>
        r.name.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.mealType.some((m) => m.toLowerCase().includes(q)),
    );
  }, [searchQuery, viewedItems]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleNavChange = (id: NavId): void => {
    setActiveNavId(id);
    // TODO: router.push(`/${id}`)
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Escape") setSearchQuery("");
  };

  const handleOpenRecipe = (id: number): void => {
    console.log("[RecentlyViewedPage] open recipe:", id);
    // TODO: router.push(`/recipes/${id}`)
  };

  const handleRemoveItem = (id: number): void => {
    setViewedItems((prev) => prev.filter((item) => item.recipe.id !== id));
    // TODO: DELETE /users/1/history/:recipeId
  };

  const handleClearAll = (): void => {
    setViewedItems([]);
    // TODO: DELETE /users/1/history
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout
      activeNavId={activeNavId}
      onNavChange={handleNavChange}
      onLogout={() => console.log("[RecentlyViewedPage] logout")}
      onUpgrade={() => console.log("[RecentlyViewedPage] upgrade")}
      user={MOCK_USER}
      notificationCount={2}
      onSearchSubmit={(q) => console.log("[RecentlyViewedPage] global search:", q)}
      onNotificationsClick={() => console.log("[RecentlyViewedPage] notifications")}
      onProfileClick={() => console.log("[RecentlyViewedPage] profile menu")}
    >
      <div className="rv-page">

        {/* ================================================================
            PAGE HEADER
            Title + subtitle on the left; "Clear All 🗑" on the right.
            The "Clear All" button only appears when there are items.
            ================================================================ */}
        <header className="rv-page__header">
          <div className="rv-page__header-titles">
            <h1 className="rv-page__title">
              Recently Viewed
              <span className="rv-page__title-emoji" aria-hidden="true"> 🕒</span>
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

        {/* ================================================================
            TOOLBAR — mirrors FavoritesPage toolbar 1-to-1 for consistency
            ================================================================ */}
        <div className="rv-page__toolbar" role="search">
          <div className="rv-page__search-wrap">
            <span className="rv-page__search-icon" aria-hidden="true">
              <IconSearch />
            </span>
            <input
              className="rv-page__search-input"
              type="search"
              placeholder="Search recently viewed…"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search recently viewed recipes"
            />
          </div>

          <button
            className={[
              "rv-page__filter-btn",
              isFilterOpen ? "rv-page__filter-btn--active" : "",
            ].filter(Boolean).join(" ")}
            type="button"
            onClick={() => setIsFilterOpen((v) => !v)}
            aria-pressed={isFilterOpen}
            aria-label="Toggle recipe filters"
          >
            <span className="rv-page__filter-btn-icon" aria-hidden="true">
              <IconFilter />
            </span>
            Filter
          </button>
        </div>

        {/* ================================================================
            RECENTLY VIEWED LIST
            Each row: thumbnail · title + meta · time-ago · remove · chevron
            Wrapped in a <section> with a white card surface matching the design.
            ================================================================ */}
        {filteredItems.length > 0 ? (
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
                  {/* Divider between rows — not after the last item */}
                  {index < filteredItems.length - 1 && (
                    <div className="rv-page__divider" aria-hidden="true" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
        ) : (
          /* ── Empty state ── */
          <div className="rv-page__empty" role="status" aria-live="polite">
            <span className="rv-page__empty-icon" aria-hidden="true">🕒</span>
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