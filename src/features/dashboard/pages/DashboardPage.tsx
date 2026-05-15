import React, { useState } from "react";

// ── Layout shell ─────────────────────────────────────────────────────────────
import { DashboardLayout } from "../components/Layout";
import type { NavId } from "../components/Layout";

// ── Reusable UI components ────────────────────────────────────────────────────
import { StatsCard }       from "../components/StatsCard";
import { RecipeCard }      from "../components/RecipeCard";
import { PromotionalCard } from "../components/PromotionalCard";

// ── Domain types ─────────────────────────────────────────────────────────────
import type {
  DummyJSONUser,
  DummyJSONRecipe,
} from "../../../shared/types/dashboard.types";

// ── Page-level styles ─────────────────────────────────────────────────────────
import "./DashboardPage.css";

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
// Mock data — field names mirror DummyJSON API 1-to-1.
// Replace each constant with a real store selector / API call when wiring.
// =============================================================================

interface DashboardStats {
  savedRecipes: number;
  recentlyViewed: number;
  recipesExplored: number;
}

// ── User — mirrors GET /users/1 ───────────────────────────────────────────────
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
  password: "", // ← NEVER store real credentials in component state
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

// ── Stats — derive from your aggregation endpoint in production ───────────────
const MOCK_STATS: DashboardStats = {
  savedRecipes: 24,
  recentlyViewed: 12,
  recipesExplored: 36,
};

// ── Favorite Recipes — mirrors GET /recipes?userId=1&limit=4 ─────────────────
const MOCK_FAVORITE_RECIPES: DummyJSONRecipe[] = [
  {
    id: 1,
    name: "Creamy Garlic Pasta",
    ingredients: [
      "400g pasta", "6 garlic cloves", "200ml heavy cream",
      "100g parmesan", "2 tbsp butter", "Salt", "Black pepper", "Fresh parsley",
    ],
    instructions: [
      "Boil pasta in salted water until al dente.",
      "Sauté minced garlic in butter over medium heat for 2 minutes.",
      "Add cream and reduce for 3 minutes.",
      "Toss with pasta, top with parmesan and parsley.",
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    caloriesPerServing: 480,
    tags: ["Pasta", "Italian", "Comfort Food"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/1.webp",
    rating: 4.6,
    reviewCount: 128,
    mealType: ["Dinner"],
  },
  {
    id: 2,
    name: "Honey Glazed Salmon",
    ingredients: [
      "2 salmon fillets", "3 tbsp honey", "2 tbsp soy sauce",
      "1 tsp fresh ginger", "2 garlic cloves", "1 tbsp olive oil",
      "Sesame seeds", "Spring onions",
    ],
    instructions: [
      "Whisk together honey, soy sauce, ginger and garlic.",
      "Brush glaze generously over salmon fillets.",
      "Sear salmon 3 min each side in an oven-safe pan.",
      "Transfer to 200 °C oven and bake 8 minutes.",
    ],
    prepTimeMinutes: 5,
    cookTimeMinutes: 20,
    servings: 2,
    difficulty: "Medium",
    cuisine: "Asian",
    caloriesPerServing: 320,
    tags: ["Seafood", "Healthy", "Asian"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/2.webp",
    rating: 4.8,
    reviewCount: 96,
    mealType: ["Dinner"],
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    ingredients: [
      "200g dark chocolate", "100g butter", "3 eggs", "3 egg yolks",
      "60g caster sugar", "30g plain flour", "Cocoa powder for dusting",
    ],
    instructions: [
      "Melt chocolate and butter over a bain-marie.",
      "Whisk eggs, yolks and sugar until pale and thick.",
      "Fold chocolate into eggs, sift in flour.",
      "Pour into buttered ramekins and bake at 200 °C for 12 minutes.",
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 4,
    difficulty: "Hard",
    cuisine: "French",
    caloriesPerServing: 550,
    tags: ["Desserts", "Chocolate", "French"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/3.webp",
    rating: 4.9,
    reviewCount: 211,
    mealType: ["Dessert"],
  },
  {
    id: 4,
    name: "Avocado Quinoa Salad",
    ingredients: [
      "200g quinoa", "2 ripe avocados", "200g cherry tomatoes",
      "1 cucumber", "Juice of 2 limes", "3 tbsp olive oil",
      "Fresh coriander", "Salt & pepper",
    ],
    instructions: [
      "Cook quinoa per packet instructions and let cool.",
      "Dice avocados and halve cherry tomatoes.",
      "Whisk lime juice and olive oil for dressing.",
      "Toss everything together and season to taste.",
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 0,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Mexican",
    caloriesPerServing: 290,
    tags: ["Salads", "Healthy", "Vegan"],
    userId: 1,
    image: "https://cdn.dummyjson.com/recipe-images/4.webp",
    rating: 4.5,
    reviewCount: 74,
    mealType: ["Lunch"],
  },
];

// ── Explore Recipes — mirrors GET /recipes?limit=4&skip=4 ────────────────────
const MOCK_EXPLORE_RECIPES: DummyJSONRecipe[] = [
  {
    id: 5,
    name: "Roasted Tomato Soup",
    ingredients: [
      "800g vine tomatoes", "1 onion", "4 garlic cloves",
      "500ml vegetable stock", "100ml double cream",
      "2 tbsp olive oil", "Fresh basil", "Salt & pepper",
    ],
    instructions: [
      "Halve tomatoes; roast with onion and garlic at 200 °C for 35 min.",
      "Blend with stock until smooth, then stir in cream.",
      "Season and serve with crusty bread.",
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    caloriesPerServing: 180,
    tags: ["Soup", "Vegetarian"],
    userId: 2,
    image: "https://cdn.dummyjson.com/recipe-images/5.webp",
    rating: 4.6,
    reviewCount: 128,
    mealType: ["Soup"],
  },
  {
    id: 6,
    name: "Margherita Pizza",
    ingredients: [
      "Pizza dough", "200ml tomato passata", "200g fresh mozzarella",
      "Fresh basil", "2 tbsp olive oil", "Sea salt", "Dried oregano",
    ],
    instructions: [
      "Preheat oven to max with a pizza stone inside.",
      "Stretch dough and spread passata, leaving a 2 cm border.",
      "Top with mozzarella and bake 10–12 minutes.",
      "Finish with fresh basil and olive oil.",
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Italian",
    caloriesPerServing: 300,
    tags: ["Pizza", "Italian", "Vegetarian"],
    userId: 3,
    image: "https://cdn.dummyjson.com/recipe-images/6.webp",
    rating: 4.7,
    reviewCount: 96,
    mealType: ["Dinner"],
  },
  {
    id: 7,
    name: "Quinoa Buddha Bowl",
    ingredients: [
      "200g quinoa", "400g tinned chickpeas", "100g kale",
      "1 sweet potato", "3 tbsp tahini", "1 lemon",
      "2 tbsp olive oil", "Smoked paprika",
    ],
    instructions: [
      "Roast sweet potato and chickpeas at 200 °C for 25 min.",
      "Cook quinoa; massage kale with lemon juice and salt.",
      "Whisk tahini and lemon juice into a dressing.",
      "Assemble and drizzle with tahini dressing.",
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Mediterranean",
    caloriesPerServing: 420,
    tags: ["Bowl", "Healthy", "Vegan"],
    userId: 4,
    image: "https://cdn.dummyjson.com/recipe-images/7.webp",
    rating: 4.8,
    reviewCount: 112,
    mealType: ["Bowl"],
  },
  {
    id: 8,
    name: "Berry Pancakes",
    ingredients: [
      "200g plain flour", "2 tsp baking powder", "2 tbsp sugar",
      "250ml milk", "2 eggs", "30g melted butter",
      "150g mixed berries", "Maple syrup to serve",
    ],
    instructions: [
      "Whisk dry ingredients in a large bowl.",
      "Beat eggs with milk and butter; fold into dry mix.",
      "Cook ladlefuls on a medium non-stick pan, 2–3 min each side.",
      "Serve stacked with berries and maple syrup.",
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 4,
    difficulty: "Easy",
    cuisine: "American",
    caloriesPerServing: 310,
    tags: ["Breakfast", "Pancakes"],
    userId: 5,
    image: "https://cdn.dummyjson.com/recipe-images/8.webp",
    rating: 4.5,
    reviewCount: 80,
    mealType: ["Breakfast"],
  },
];

// =============================================================================
// DashboardPage
// =============================================================================

const DashboardPage: React.FC = () => {
  // ── Navigation ────────────────────────────────────────────────────────────
  const [activeNavId, setActiveNavId] = useState<NavId>("dashboard");

  // ── Favourite IDs ─────────────────────────────────────────────────────────
  // In production: replace with a selector from your user-preferences store.
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(
    new Set([1, 2, 3, 4]),
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

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
    // TODO: router.push(`/${id}`) — wire once React Router / Next.js is added
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
      onLogout={() => console.log("[DashboardPage] logout")}
      onUpgrade={() => console.log("[DashboardPage] upgrade")}
      // ── Header props — Mode A: pre-resolved user object ───────────────────
      user={MOCK_USER}
      notificationCount={2}
      onSearchSubmit={(q) => console.log("[DashboardPage] search:", q)}
      onSearchChange={(q) => console.log("[DashboardPage] search change:", q)}
      onNotificationsClick={() => console.log("[DashboardPage] notifications")}
      onProfileClick={() => console.log("[DashboardPage] profile menu")}
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
            value={MOCK_STATS.savedRecipes}
            label="Saved Recipes"
            helperText="Your favorite recipes"
          />
          <StatsCard
            icon={<IconEye />}
            variant="green"
            value={MOCK_STATS.recentlyViewed}
            label="Recently Viewed"
            helperText="Recipes you explored"
          />
          <StatsCard
            icon={<IconBookOpen />}
            variant="purple"
            value={MOCK_STATS.recipesExplored}
            label="Recipes Explored"
            helperText="Keep exploring!"
          />
        </div>

        {/* ── PROFILE CARD — right column, spans vertically as sticky sidebar ── */}
        <aside
          className="dp__profile-card"
          aria-label={`Signed in as ${MOCK_USER.firstName} ${MOCK_USER.lastName}`}
        >
          <img
            className="dp__profile-avatar"
            src={MOCK_USER.image}
            alt={`${MOCK_USER.firstName} ${MOCK_USER.lastName}`}
            width={72}
            height={72}
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.src = `https://ui-avatars.com/api/?name=${MOCK_USER.firstName}+${MOCK_USER.lastName}&background=f97316&color=fff&size=128`;
            }}
          />
          <div className="dp__profile-meta">
            <p className="dp__profile-name">
              {MOCK_USER.firstName} {MOCK_USER.lastName}
            </p>
            <p className="dp__profile-email">{MOCK_USER.email}</p>
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
              onClick={() => console.log("[DashboardPage] → /favorites")}
              aria-label="View all favorite recipes"
            >
              View all
              <span className="dp__view-all-btn-icon" aria-hidden="true">
                <IconChevronRight />
              </span>
            </button>
          </header>

          <div className="dp__card-grid" role="list" aria-label="Favorite recipes">
            {MOCK_FAVORITE_RECIPES.map((recipe) => (
              <div key={recipe.id} role="listitem">
                <RecipeCard
                  recipe={recipe}
                  mode="favorite"
                  isFavorite={favoriteIds.has(recipe.id)}
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
              onClick={() => console.log("[DashboardPage] → /explore")}
              aria-label="View all recipes"
            >
              View all recipes
              <span className="dp__view-all-btn-icon" aria-hidden="true">
                <IconChevronRight />
              </span>
            </button>
          </header>

          <div className="dp__card-grid" role="list" aria-label="Recipes to explore">
            {MOCK_EXPLORE_RECIPES.map((recipe) => (
              <div key={recipe.id} role="listitem">
                <RecipeCard
                  recipe={recipe}
                  mode="explore"
                  isFavorite={favoriteIds.has(recipe.id)}
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