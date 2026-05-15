// src/features/dashboard/hooks/useRecentlyViewed.ts
// =============================================================================
// useRecentlyViewed — manages two separate localStorage tracking lists:
//
//   cd_recently_viewed  — capped ordered list (last N seen, newest first)
//   cd_total_explored   — unbounded unique set of every recipe ever opened
//
// This separation allows the Dashboard to show two genuinely different stats:
//   "Recently Viewed"   → recentlyViewedCount  (capped, e.g. last 10)
//   "Recipes Explored"  → totalExploredCount   (all-time unique visits)
// =============================================================================

import { useCallback, useEffect, useState } from "react";

// --------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------

/** Ordered, capped list — newest first. */
export const RECENTLY_VIEWED_KEY = "cd_recently_viewed";
/** Unordered, unbounded unique set — all recipe IDs ever opened. */
export const TOTAL_EXPLORED_KEY  = "cd_total_explored";

/** Maximum length of the "recently viewed" list. */
export const MAX_RECENTLY_VIEWED = 10;

// --------------------------------------------------------------------------
// Low-level localStorage helpers
// (pure functions — no React, easy to unit-test, safe to call anywhere)
// --------------------------------------------------------------------------

/** Read and validate a stored JSON number array; returns [] on any error. */
function readNumericArray(key: string): number[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item: unknown) => Number(item))
      .filter((n) => Number.isFinite(n) && n > 0);
  } catch {
    return [];
  }
}

/** Write a number array to localStorage; silently swallows storage errors. */
function writeNumericArray(key: string, ids: number[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // localStorage may be unavailable (private browsing quota, etc.)
  }
}

// --------------------------------------------------------------------------
// Public read helpers (used for SSR-safe state initialisation)
// --------------------------------------------------------------------------

/** Returns the capped recently-viewed ID list (newest first). */
export function readRecentlyViewedIds(): number[] {
  return readNumericArray(RECENTLY_VIEWED_KEY);
}

/** Returns the full unique set of all explored recipe IDs. */
export function readTotalExploredIds(): number[] {
  return readNumericArray(TOTAL_EXPLORED_KEY);
}

// --------------------------------------------------------------------------
// Core write function — called from RecipeDetails on every page mount
// --------------------------------------------------------------------------

/**
 * Record a recipe visit in BOTH storage keys simultaneously.
 *
 *  cd_recently_viewed : prepend `id`, deduplicate, cap at MAX_RECENTLY_VIEWED.
 *  cd_total_explored  : add `id` to the set only when not already present
 *                       (so the all-time count never inflates on revisits).
 *
 * Returns the updated values of both lists so callers can sync React state
 * without a second read round-trip.
 *
 * This function has NO React dependency — it is safe to import and call from
 * any component tree, including pages outside the Dashboard (e.g. Recipes tab,
 * Search results, Similar Recipes section).
 */
export function persistRecentlyViewed(id: number): {
  recentlyViewed: number[];
  totalExplored: number[];
} {
  // -- recently viewed (capped, ordered) ------------------------------------
  const prevViewed = readRecentlyViewedIds();
  const nextViewed = [
    id,
    ...prevViewed.filter((stored) => stored !== id),
  ].slice(0, MAX_RECENTLY_VIEWED);
  writeNumericArray(RECENTLY_VIEWED_KEY, nextViewed);

  // -- total explored (unbounded unique set) --------------------------------
  const prevExplored = readTotalExploredIds();
  const nextExplored = prevExplored.includes(id)
    ? prevExplored                  // revisit — set unchanged
    : [...prevExplored, id];        // first visit — append
  writeNumericArray(TOTAL_EXPLORED_KEY, nextExplored);

  return { recentlyViewed: nextViewed, totalExplored: nextExplored };
}

// --------------------------------------------------------------------------
// React hook
// --------------------------------------------------------------------------

interface UseRecentlyViewedReturn {
  /** Capped ordered list of recently-viewed IDs (newest first, max 10). */
  recentlyViewedIds: number[];
  /**
   * recentlyViewedIds.length
   * Use this for the "Recently Viewed" StatsCard.
   */
  recentlyViewedCount: number;

  /** All-time unique set of every recipe ID ever opened by this browser. */
  totalExploredIds: number[];
  /**
   * totalExploredIds.length
   * Use this for the "Recipes Explored" StatsCard.
   */
  totalExploredCount: number;

  /**
   * Imperatively record a recipe visit from inside a component.
   * Prefers calling `persistRecentlyViewed` directly from RecipeDetails
   * (inside useEffect) so tracking fires on every route, not just Dashboard.
   */
  addRecentlyViewed: (id: number) => void;
}

export function useRecentlyViewed(): UseRecentlyViewedReturn {
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>(
    readRecentlyViewedIds,   // lazy initialiser — reads localStorage once
  );
  const [totalExploredIds, setTotalExploredIds] = useState<number[]>(
    readTotalExploredIds,
  );

  // Re-sync when RecipeDetails (potentially in a different route/tab) writes
  // to localStorage while the Dashboard is already mounted.
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === RECENTLY_VIEWED_KEY) {
        setRecentlyViewedIds(readRecentlyViewedIds());
      }
      if (e.key === TOTAL_EXPLORED_KEY) {
        setTotalExploredIds(readTotalExploredIds());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addRecentlyViewed = useCallback((id: number) => {
    const { recentlyViewed, totalExplored } = persistRecentlyViewed(id);
    setRecentlyViewedIds(recentlyViewed);
    setTotalExploredIds(totalExplored);
  }, []);

  return {
    recentlyViewedIds,
    recentlyViewedCount: recentlyViewedIds.length,
    totalExploredIds,
    totalExploredCount:  totalExploredIds.length,
    addRecentlyViewed,
  };
}