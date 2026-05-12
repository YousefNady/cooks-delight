// src/features/profile/pages/ProfilePage.tsx

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useFavoritesContext } from '../context/FavoritesContext';
import RecipeCard from '../../../shared/components/RecipeCard/RecipeCard';

import '../styles/Profilepage.css';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface AuthUser {
  username: string;
  email: string;
  userId: string;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const readAuthUser = (): AuthUser | null => {
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const userId = localStorage.getItem('userId');

  if (!username) return null;

  return {
    username,
    email: email ?? '',
    userId: userId ?? '',
  };
};

const avatarUrl = (userId: string): string =>
  `https://dummyjson.com/icon/${userId || 'default'}/128`;

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';

  return 'Good Evening';
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const { favorites, clearFavorites } = useFavoritesContext();

  const [user] = React.useState<AuthUser | null>(() => readAuthUser());

  const greeting = getGreeting();

  // ───────────────────────────────────────────────────────────
  // Smart Insights
  // ───────────────────────────────────────────────────────────

  const insights = useMemo(() => {
    const total = favorites.length;

    const italian = favorites.filter((recipe) =>
      recipe.name?.toLowerCase().includes('pizza')
    ).length;

    const healthy = favorites.filter((recipe) => {
      const name = recipe.name?.toLowerCase() || '';

      return (
        name.includes('salad') ||
        name.includes('avocado') ||
        name.includes('healthy') ||
        name.includes('vegan')
      );
    }).length;

    const dessert = favorites.filter((recipe) => {
      const name = recipe.name?.toLowerCase() || '';

      return (
        name.includes('cookie') ||
        name.includes('cake') ||
        name.includes('chocolate')
      );
    }).length;

    const score = Math.min(total * 21, 100);

    return {
      total,
      italian,
      healthy,
      dessert,
      score,
    };
  }, [favorites]);

  // ───────────────────────────────────────────────────────────
  // Last Saved Recipe
  // ───────────────────────────────────────────────────────────

  const latestRecipe = favorites[0];

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ───────────────── HERO ───────────────── */}

      <section
        className="profile-hero"
        aria-labelledby="profile-name"
      >
        <div className="profile-hero__overlay"></div>

        <div className="profile-hero__inner">

          {/* Avatar */}

          <motion.div
            className="profile-hero__avatar-wrap"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {user ? (
              <img
                className="profile-hero__avatar"
                src={avatarUrl(user.userId)}
                alt={`${user.username}'s avatar`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';

                  const sibling =
                    e.currentTarget.nextElementSibling as HTMLElement | null;

                  if (sibling) sibling.style.display = 'flex';
                }}
              />
            ) : null}

            {/* Initials fallback */}

            <div
              className="profile-hero__avatar-fallback"
              style={{ display: user ? 'none' : 'flex' }}
              aria-hidden={!!user}
            >
              {user ? user.username.slice(0, 2).toUpperCase() : 'CD'}
            </div>
          </motion.div>

          {/* Info */}

          <div className="profile-hero__info">

            <motion.p
              className="profile-hero__eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              YOUR PROFILE
            </motion.p>

            <motion.h2
              className="profile-hero__greeting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {greeting} 👋
            </motion.h2>

            <motion.h1
              className="profile-hero__name"
              id="profile-name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {user?.username ?? 'Guest User'}
            </motion.h1>

            <motion.p
              className="profile-hero__email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {user?.email ?? 'Not logged in'}
            </motion.p>

            {/* Stats */}

            <motion.div
              className="profile-hero__stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >

              <div className="profile-stat-card">
                <span className="profile-stat-card__icon">🔥</span>

                <div>
                  <h3>{insights.total}</h3>
                  <p>Saved Recipes</p>
                </div>
              </div>

              <div className="profile-stat-card">
                <span className="profile-stat-card__icon">🥗</span>

                <div>
                  <h3>{insights.healthy}</h3>
                  <p>Healthy Picks</p>
                </div>
              </div>

              <div className="profile-stat-card">
                <span className="profile-stat-card__icon">🍕</span>

                <div>
                  <h3>{insights.italian}</h3>
                  <p>Italian Recipes</p>
                </div>
              </div>

              <div className="profile-stat-card">
                <span className="profile-stat-card__icon">⭐</span>

                <div>
                  <h3>{insights.score}%</h3>
                  <p>Collection Score</p>
                </div>
              </div>
              

            </motion.div>

            {/* Latest Recipe */}

            {latestRecipe && (
              <motion.div
                className="profile-latest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="profile-latest__label">
                  LAST SAVED
                </span>

                <h3 className='last-saved-recipe'>{latestRecipe.name}</h3>
              </motion.div>
            )}

          </div>

        </div>
      </section>

      {/* ───────────────── FAVORITES ───────────────── */}

      <section
        className="profile-favorites"
        aria-labelledby="favorites-heading"
        id="favorites-section"
      >

        <div className="profile-favorites__header">

          <div>
            <p className="profile-favorites__eyebrow">
              COLLECTION
            </p>

            <h2
              className="profile-favorites__heading"
              id="favorites-heading"
            >
              MY FAVORITE RECIPES
            </h2>
          </div>

          {favorites.length > 0 && (
            <button
              type="button"
              className="profile-favorites__clear-btn"
              onClick={clearFavorites}
              aria-label="Clear all favorites"
            >
              Clear All
            </button>
          )}

        </div>

        {/* Empty State */}

        {favorites.length === 0 ? (
          <motion.div
            className="profile-empty"
            role="status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            <div
              className="profile-empty__icon"
              aria-hidden="true"
            >
              🍳
            </div>

            <h3 className="profile-empty__title">
              No favorites yet
            </h3>

            <p className="profile-empty__text">
              Save recipes you love and build your own
              delicious collection.
            </p>

            <Link
              to="/recipes"
              className="profile-empty__cta"
            >
              EXPLORE RECIPES
            </Link>

          </motion.div>
        ) : (
          <motion.div
            className="profile-favorites__grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            {favorites.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RecipeCard
                  recipe={recipe}
                  hideFavoriteBtn={false}
                />
              </motion.div>
            ))}

          </motion.div>
        )}

      </section>
    </motion.div>
  );
};

export default ProfilePage;