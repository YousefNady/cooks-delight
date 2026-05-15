import React from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../../types";
import "./RecipeCard.css";

// ---------------------------------------------------------------------------
// Icons (inline SVGs — no external library)
// ---------------------------------------------------------------------------

const IconHeart: React.FC<{ filled: boolean }> = ({ filled }) =>
  filled ? (
    <svg viewBox="0 0 24 24" fill="#f97316" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f97316"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

const IconStar: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
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

const IconDots: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * "favorite" → "Your Favorite Recipes" row layout:
 *   - Image fills top, heart badge overlays top-right.
 *   - Title + meta below; NO rating row; NO meal-type chip on image.
 *
 * "explore"  → "Continue Exploring" row layout:
 *   - Meal-type chip overlays top-left of image.
 *   - Rating row (star + score + count) visible at bottom.
 */
export type RecipeCardMode = "favorite" | "explore";

export interface RecipeCardProps {
  /**
   * Fully-typed dashboard recipe object.
   * Sourced from GET /recipes or GET /recipes/:id.
   */
  recipe: Recipe;

  /**
   * Visual/layout variant matching the two recipe rows in the dashboard.
   * @default "favorite"
   */
  mode?: RecipeCardMode;

  /**
   * Whether this recipe is currently in the user's favourites.
   * Controls the heart icon fill state.
   * @default false
   */
  isFavorite?: boolean;

  /**
   * Called when the user taps/clicks the heart icon.
   * Parent is responsible for toggling `isFavorite`.
   */
  onFavoriteToggle?: (recipeId: number) => void;

  /**
   * Called when the "⋮" overflow menu button is pressed.
   */
  onMenuOpen?: (recipeId: number) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Format total cook time from DummyJSON fields.
 * The API gives `prepTimeMinutes` + `cookTimeMinutes` separately.
 */
function formatTotalTime(prep: number, cook: number): string {
  const total = prep + cook;
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

/**
 * Returns the first ingredient group as a loose "category" tag.
 * DummyJSON recipes don't have a single `category` field, so we derive one
 * from `mealType[0]` (e.g. "Dinner") as it mirrors what the design shows.
 * Consumers can override by computing this upstream before passing the recipe.
 */
function deriveCategory(recipe: Recipe): string {
  return recipe.mealType?.[0] ?? recipe.cuisine ?? "Recipe";
}

/**
 * Stable image fallback — uses the recipe id to pick a consistent
 * Unsplash food photo if the CDN image fails or is unavailable.
 */
const FOOD_UNSPLASH_IDS = [
  "photo-1546069901-ba9599a7e63c",
  "photo-1504674900247-0877df9cc836",
  "photo-1512621776951-a57141f2eefd",
  "photo-1499028344343-cd173ffc68a9",
  "photo-1432139509613-5c4255815697",
  "photo-1476224203421-9ac39bcb3327",
  "photo-1467003909585-2f8a72700288",
  "photo-1414235077428-338989a2e8c0",
];

function getFallbackImage(id: number): string {
  const slug = FOOD_UNSPLASH_IDS[id % FOOD_UNSPLASH_IDS.length];
  return `https://images.unsplash.com/${slug}?auto=format&fit=crop&w=600&q=80`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  mode = "favorite",
  isFavorite = false,
  onFavoriteToggle,
  onMenuOpen,
}) => {
  const navigate = useNavigate();
  const {
    id,
    name,
    image,
    prepTimeMinutes,
    cookTimeMinutes,
    rating,
    reviewCount,
    difficulty,
  } = recipe;

  const totalTime = formatTotalTime(prepTimeMinutes, cookTimeMinutes);
  const category = deriveCategory(recipe);
  const imgSrc = image || getFallbackImage(id);
  const isExplore = mode === "explore";

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(id);
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    onMenuOpen?.(id);
  };

  const handleCardClick = (): void => {
    navigate(`/recipes/${id}`);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/recipes/${id}`);
    }
  };

  return (
    <article
      className={`recipe-card recipe-card--${mode}`}
      aria-label={`${name}, ${totalTime}, ${category}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
    >
      {/* ── Image area ── */}
      <div className="recipe-card__image-wrapper">
        <img
          className="recipe-card__image"
          src={imgSrc}
          alt={name}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = getFallbackImage(id);
          }}
        />

        {/* Meal-type chip — explore mode only (top-left of image) */}
        {isExplore && (
          <span className="recipe-card__meal-chip" aria-label={`Meal type: ${category}`}>
            {category}
          </span>
        )}

        {/* Heart / favourite badge — always visible, top-right of image */}
        <button
          className={[
            "recipe-card__heart-btn",
            isFavorite ? "recipe-card__heart-btn--active" : "",
          ].filter(Boolean).join(" ")}
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
          aria-pressed={isFavorite}
        >
          <IconHeart filled={isFavorite} />
        </button>
      </div>

      {/* ── Content area ── */}
      <div className="recipe-card__content">

        {/* Rating row — explore mode only */}
        {isExplore && (
          <div className="recipe-card__rating" aria-label={`Rated ${rating} out of 5 from ${reviewCount} reviews`}>
            <span className="recipe-card__rating-star">
              <IconStar />
            </span>
            <span className="recipe-card__rating-score">{rating.toFixed(1)}</span>
            <span className="recipe-card__rating-count">({reviewCount})</span>
          </div>
        )}

        {/* Title row */}
        <div className="recipe-card__title-row">
          <h3 className="recipe-card__title">{name}</h3>
          {/* Overflow menu — shown in favorite mode (three-dot button in design) */}
          {!isExplore && (
            <button
              className="recipe-card__menu-btn"
              type="button"
              onClick={handleMenuClick}
              aria-label={`More options for ${name}`}
            >
              <IconDots />
            </button>
          )}
        </div>

        {/* Meta row: time + bullet + category/difficulty */}
        <div className="recipe-card__meta" aria-label={`${totalTime}, ${isExplore ? difficulty : category}`}>
          <span className="recipe-card__meta-item recipe-card__meta-item--time">
            {!isExplore && (
              <span className="recipe-card__meta-icon">
                <IconClock />
              </span>
            )}
            {totalTime}
          </span>
          <span className="recipe-card__meta-separator" aria-hidden="true">•</span>
          <span className="recipe-card__meta-item">
            {isExplore ? difficulty : category}
          </span>
        </div>

      </div>
    </article>
  );
};

export default RecipeCard;
