import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardLayout } from "../components/Layout";
import type { NavId } from "../components/Layout";
import { useAuth } from "../../auth/context";
import { useFavoritesContext } from "../../profile";
import "./ProfilePage.css"; // fixing the import 
import defaultAvatarImg from "../../../assets/profile/default-avatar.png";
// fixing the import 

// =============================================================================
// Icons
// =============================================================================

const IconPencil: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconHeart: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconBook: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
  </svg>
);

const IconUsers: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
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

const IconPlus: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// =============================================================================
// Local types
// =============================================================================

interface ActivityItem {
  id: number;
  text: string;
  timeAgo: string;
  emoji: string;
}

type FoodPref =
  | "Vegetarian"
  | "Vegan"
  | "Gluten Free"
  | "Keto"
  | "Halal"
  | "Pescatarian";

type FavoriteCategory =
  | "Pasta"
  | "Desserts"
  | "Healthy"
  | "Seafood"
  | "Breakfast"
  | "Dinner";

// =============================================================================
const ALL_FOOD_PREFS: FoodPref[] = [
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Keto",
  "Halal",
  "Pescatarian",
];

const ALL_FAV_CATEGORIES: FavoriteCategory[] = [
  "Pasta",
  "Desserts",
  "Healthy",
  "Seafood",
  "Breakfast",
  "Dinner",
];

const CUISINE_OPTIONS = [
  "Italian",
  "Asian",
  "Mexican",
  "Mediterranean",
  "American",
  "French",
  "Indian",
  "Japanese",
  "Greek",
];

const SKILL_OPTIONS = [
  "Beginner",
  "Home Cook",
  "Intermediate",
  "Advanced",
  "Chef",
];

// =============================================================================
// ProfilePage
// =============================================================================

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { favorites } = useFavoritesContext();
  const [activeNavId, setActiveNavId] = useState<NavId>("profile");

  const [bio, setBio] = useState<string>(
    "I love cooking healthy meals for my family and trying new recipes from different cuisines.",
  );
  const [foodPrefs, setFoodPrefs] = useState<Set<FoodPref>>(
    new Set(["Vegetarian"]),
  );
  const [favCuisine, setFavCuisine] = useState<string>("Italian");
  const [skillLevel, setSkillLevel] = useState<string>("Home Cook");
  const [favCategories, setFavCategories] = useState<Set<FavoriteCategory>>(
    new Set(["Pasta", "Desserts", "Healthy"]),
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const firstName =
    user?.username?.split(/[._\s-]/)[0] || user?.username || "Guest";
  const displayName = user?.username || "Guest";
  const displayEmail = user?.email || "Sign in to manage your profile";
 const defaultAvatar = defaultAvatarImg;


  // user.image = `https://dummyjson.com/icon/${userId}/128` (set by AuthContext)
  // Falls back to ui-avatars only when user is null (logged out)
  const avatarUrl = user?.image ?? defaultAvatar;

  const memberSince = "your first sign in";
  const activityItems = useMemo<ActivityItem[]>(
    () =>
      favorites.slice(0, 5).map((recipe, index) => ({
        id: recipe.id,
        emoji: "",
        text: `You saved "${recipe.name}"`,
        timeAgo: index === 0 ? "Recently" : "Earlier",
      })),
    [favorites],
  );
  const bioLength = bio.length;
  const BIO_MAX = 200;

  const toggleFoodPref = (pref: FoodPref): void => {
    setFoodPrefs((prev) => {
      const next = new Set(prev);
      if (next.has(pref)) {
        next.delete(pref);
      } else {
        next.add(pref);
      }
      return next;
    });
    setIsSaved(false);
  };

  const toggleFavCategory = (cat: FavoriteCategory): void => {
    setFavCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
    setIsSaved(false);
  };

  const handleSave = (): void => {
    setIsSaved(true);
    console.log("[ProfilePage] save profile:", {
      bio,
      foodPrefs: [...foodPrefs],
      favCuisine,
      skillLevel,
      favCategories: [...favCategories],
    });
    // TODO: PATCH /users/1
  };

  // const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f97316&color=fff&size=128`;

  return (
    <DashboardLayout
      activeNavId={activeNavId}
      onNavChange={(id) => {
        setActiveNavId(id);
        const routes: Partial<Record<NavId, string>> = {
          dashboard: "/dashboard",
          favorites: "/favorites",
          explore: "/explore",
          "recently-viewed": "/recently-viewed",
          profile: "/profile-dashboard",
          settings: "/settings",
        };
        const route = routes[id];
        if (route) navigate(route);
      }}
      onLogout={logout}
      onUpgrade={() => console.log("[ProfilePage] upgrade")}
      fetchUserId={Number(user?.userId) || 1}
      notificationCount={2}
      onSearchSubmit={(q) => console.log("[ProfilePage] search:", q)}
      onNotificationsClick={() => console.log("[ProfilePage] notifications")}
      onProfileClick={() => navigate("/profile-dashboard")}
    >
      <div className="prof-page">
        <section className="prof-page__hero" aria-label="Profile overview">
          {/* Avatar */}
          <div className="prof-page__avatar-wrap">
            <img
              className="prof-page__avatar"
              src={avatarUrl}
              alt={displayName}
              width={96}
              height={96}
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null; // 👈
                target.src = defaultAvatar;
              }}
            />
            <button
              className="prof-page__avatar-edit-btn"
              type="button"
              aria-label="Change profile photo"
            >
              <IconPencil />
            </button>
          </div>

          {/* Identity */}
          <div className="prof-page__identity">
            <h1 className="prof-page__name">{firstName}</h1>
            <p className="prof-page__email">{displayEmail}</p>
            <p className="prof-page__since">Member since {memberSince}</p>
          </div>

          {/* Edit Profile button */}
          <button
            className="prof-page__edit-btn"
            type="button"
            onClick={handleSave}
            aria-label="Edit profile"
          >
            <span className="prof-page__edit-btn-icon" aria-hidden="true">
              <IconPencil />
            </span>
            Edit Profile
          </button>

          {/* Stats row */}
          <div className="prof-page__stats" aria-label="Profile statistics">
            {(
              [
                { icon: <IconBook />, value: 0, label: "Recipes Posted" },
                {
                  icon: <IconHeart />,
                  value: favorites.length,
                  label: "Total Favorites",
                },
                { icon: <IconUsers />, value: 0, label: "Followers" },
              ] as const
            ).map(({ icon, value, label }) => (
              <div
                key={label}
                className="prof-page__stat-card"
                aria-label={`${label}: ${value}`}
              >
                <span className="prof-page__stat-icon" aria-hidden="true">
                  {icon}
                </span>
                <strong className="prof-page__stat-value">{value}</strong>
                <span className="prof-page__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            TWO-COLUMN CONTENT AREA
            Left : About Me (bio + food prefs + cuisine + skill + categories)
            Right: Recent Activity
            ================================================================ */}
        <div className="prof-page__content">
          {/* â”€â”€ LEFT â€” About Me form â”€â”€ */}
          <section
            className="prof-page__about"
            aria-labelledby="prof-about-title"
          >
            <div className="prof-page__card">
              <h2 className="prof-page__card-title" id="prof-about-title">
                About Me
              </h2>
              <p className="prof-page__card-hint">
                Tell us a little bit about yourself (optional).
              </p>

              {/* Bio textarea */}
              <div className="prof-page__field">
                <label className="prof-page__label" htmlFor="prof-bio">
                  Bio
                </label>
                <div className="prof-page__textarea-wrap">
                  <textarea
                    id="prof-bio"
                    className="prof-page__textarea"
                    value={bio}
                    maxLength={BIO_MAX}
                    rows={4}
                    placeholder="Write a short bioâ€¦"
                    onChange={(e) => {
                      setBio(e.target.value);
                      setIsSaved(false);
                    }}
                    aria-describedby="prof-bio-count"
                  />
                  <span
                    id="prof-bio-count"
                    className={[
                      "prof-page__char-count",
                      bioLength >= BIO_MAX
                        ? "prof-page__char-count--limit"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-live="polite"
                  >
                    {bioLength}/{BIO_MAX}
                  </span>
                </div>
              </div>

              {/* Food Preferences checkboxes */}
              <div className="prof-page__field">
                <p className="prof-page__label">Food Preferences</p>
                <p className="prof-page__field-hint">Select all that apply</p>
                <div
                  className="prof-page__checkbox-grid"
                  role="group"
                  aria-label="Food preferences"
                >
                  {ALL_FOOD_PREFS.map((pref) => (
                    <label key={pref} className="prof-page__checkbox-item">
                      <input
                        type="checkbox"
                        className="prof-page__checkbox"
                        checked={foodPrefs.has(pref)}
                        onChange={() => toggleFoodPref(pref)}
                        aria-label={pref}
                      />
                      <span className="prof-page__checkbox-label">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Favorite Cuisine select */}
              <div className="prof-page__field">
                <label className="prof-page__label" htmlFor="prof-cuisine">
                  Favorite Cuisine
                </label>
                <div className="prof-page__select-wrap">
                  <select
                    id="prof-cuisine"
                    className="prof-page__select"
                    value={favCuisine}
                    onChange={(e) => {
                      setFavCuisine(e.target.value);
                      setIsSaved(false);
                    }}
                  >
                    {CUISINE_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cooking Skill Level select */}
              <div className="prof-page__field">
                <label className="prof-page__label" htmlFor="prof-skill">
                  Cooking Skill Level
                </label>
                <div className="prof-page__select-wrap">
                  <select
                    id="prof-skill"
                    className="prof-page__select"
                    value={skillLevel}
                    onChange={(e) => {
                      setSkillLevel(e.target.value);
                      setIsSaved(false);
                    }}
                  >
                    {SKILL_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Favorite Categories chips */}
              <div className="prof-page__field">
                <p className="prof-page__label">Favorite Categories</p>
                <p className="prof-page__field-hint">
                  What do you enjoy cooking the most?
                </p>
                <div
                  className="prof-page__cat-chips"
                  role="group"
                  aria-label="Favorite recipe categories"
                >
                  {ALL_FAV_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      className={[
                        "prof-page__cat-chip",
                        favCategories.has(cat)
                          ? "prof-page__cat-chip--active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      type="button"
                      onClick={() => toggleFavCategory(cat)}
                      aria-pressed={favCategories.has(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    className="prof-page__cat-chip-add"
                    type="button"
                    aria-label="Add category"
                  >
                    <IconPlus />
                    Add more
                  </button>
                </div>
              </div>

              {/* Save button */}
              <div className="prof-page__form-footer">
                <button
                  className={[
                    "prof-page__save-btn",
                    isSaved ? "prof-page__save-btn--saved" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  type="button"
                  onClick={handleSave}
                >
                  {isSaved ? "✓ Saved" : "Save Changes"}
                </button>
              </div>
            </div>
          </section>

          {/* â”€â”€ RIGHT â€” Recent Activity â”€â”€ */}
          <aside
            className="prof-page__activity"
            aria-labelledby="prof-activity-title"
          >
            <div className="prof-page__card">
              <h2 className="prof-page__card-title" id="prof-activity-title">
                Recent Activity
              </h2>

              <ul className="prof-page__activity-list" role="list">
                {activityItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <li className="prof-page__activity-item" role="listitem">
                      <span
                        className="prof-page__activity-emoji"
                        aria-hidden="true"
                      >
                        {item.emoji}
                      </span>
                      <div className="prof-page__activity-body">
                        <p className="prof-page__activity-text">{item.text}</p>
                        <div className="prof-page__activity-meta">
                          <span
                            className="prof-page__activity-clock"
                            aria-hidden="true"
                          >
                            <IconClock />
                          </span>
                          <span className="prof-page__activity-time">
                            {item.timeAgo}
                          </span>
                        </div>
                      </div>
                    </li>
                    {index < activityItems.length - 1 && (
                      <li
                        className="prof-page__activity-divider"
                        role="separator"
                        aria-hidden="true"
                      />
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};;

export default ProfilePage;
