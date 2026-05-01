// src/features/profile/pages/ProfilePage.tsx

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFavoritesContext } from '../context/FavoritesContext';
import RecipeCard from '../../../shared/components/RecipeCard/RecipeCard';
import './ProfilePage.css';

// ─── Read auth state from localStorage (written by useLoginForm) ──────────────

interface AuthUser {
  username: string;
  email: string;
  userId: string;
}

const readAuthUser = (): AuthUser | null => {
  const username = localStorage.getItem('username');
  const email    = localStorage.getItem('email');
  const userId   = localStorage.getItem('userId');
  if (!username) return null;
  return { username, email: email ?? '', userId: userId ?? '' };
};

/** Generate a deterministic avatar URL from the DummyJSON user id */
const avatarUrl = (userId: string): string =>
  `https://dummyjson.com/icon/${userId || 'default'}/128`;

// ─── Component ────────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const { favorites, clearFavorites } = useFavoritesContext();
  const user = useMemo(readAuthUser, []);

  return (
    <div className="profile-page">

      {/* ── User card ─────────────────────────────────────────────────────── */}
      <section className="profile-hero" aria-labelledby="profile-name">
        <div className="profile-hero__inner">

          <div className="profile-hero__avatar-wrap">
            {user ? (
              <img
                className="profile-hero__avatar"
                src={avatarUrl(user.userId)}
                alt={`${user.username}'s avatar`}
                onError={(e) => {
                  // Fallback to initials on broken image
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (sibling) sibling.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Initials fallback (shown by JS above, or always when logged out) */}
            <div
              className="profile-hero__avatar-fallback"
              style={{ display: user ? 'none' : 'flex' }}
              aria-hidden={!!user}
            >
              {user ? user.username.slice(0, 2).toUpperCase() : 'CD'}
            </div>
          </div>

          <div className="profile-hero__info">
            <p className="profile-hero__eyebrow">YOUR PROFILE</p>
            <h1 className="profile-hero__name" id="profile-name">
              {user?.username ?? 'Guest User'}
            </h1>
            <p className="profile-hero__email">
              {user?.email ?? 'Not logged in'}
            </p>

            <div className="profile-hero__stats">
              <div className="profile-hero__stat">
                <span className="profile-hero__stat-value">{favorites.length}</span>
                <span className="profile-hero__stat-label">Saved Recipes</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Favorites gallery ──────────────────────────────────────────────── */}
      <section className="profile-favorites" aria-labelledby="favorites-heading">
        <div className="profile-favorites__header">
          <div>
            <p className="profile-favorites__eyebrow">COLLECTION</p>
            <h2 className="profile-favorites__heading" id="favorites-heading">
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

        {/* ── Empty state ── */}
        {favorites.length === 0 ? (
          <div className="profile-empty" role="status">
            <div className="profile-empty__icon" aria-hidden="true">🍳</div>
            <h3 className="profile-empty__title">No favorites yet</h3>
            <p className="profile-empty__text">
              Tap the heart on any recipe to save it here for quick access.
            </p>
            <Link to="/recipes" className="profile-empty__cta">
              EXPLORE RECIPES
            </Link>
          </div>
        ) : (
          /* ── Favorites grid ── */
          <div className="profile-favorites__grid">
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                hideFavoriteBtn={false}  /* keep heart so users can un-save */
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default ProfilePage;