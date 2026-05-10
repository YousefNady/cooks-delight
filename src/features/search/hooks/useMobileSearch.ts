// src/features/search/hooks/useMobileSearch.ts

import axios, { AxiosError } from 'axios';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { MobileSearchData, Recipe } from '../types/search.types';

// ─── Constants ────────────────────────────────────────────────────────────────

const TRY_SAYING: string[] = [
  'Chicken recipes',
  'Healthy breakfast ideas',
  'Easy pasta recipes',
];

const RECENT_KEY  = 'cooks_delight_recent_searches';
const MAX_RECENT  = 5;
const RECIPES_URL = 'https://dummyjson.com/recipes?limit=50&select=name,tags';

// ─── API response shape ───────────────────────────────────────────────────────

interface RecipesApiResponse {
  recipes: Recipe[];
}

// ─── localStorage helpers (module-level, no side-effects on React) ────────────

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function persistRecent(items: string[]): void {
  localStorage.setItem(RECENT_KEY, JSON.stringify(items));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMobileSearch() {
  // Only the fetched slice is stored as state — everything else is derived.
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading]               = useState(false);
  const [error, setError]                       = useState<string | null>(null);

  // Recent searches: kept in state so the UI re-renders on mutation,
  // but never synced from/to a larger state object — no cascading effect needed.
  const [recent, setRecent] = useState<string[]>(loadRecent);

  // Guard: fetch exactly once per hook instance lifetime.
  const hasFetched = useRef(false);

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.get<RecipesApiResponse>(RECIPES_URL);

      const tagSet = new Set<string>();
      (data.recipes ?? []).forEach((recipe) =>
        recipe.tags?.forEach((tag) => tagSet.add(tag)),
      );

      setTrendingSearches([...tagSet].slice(0, 5));
    } catch (err) {
      const axiosError = err as AxiosError;
      const message =
        axiosError.response
          ? `Server error: ${axiosError.response.status}`
          : axiosError.request
          ? 'Network error — please check your connection.'
          : 'Failed to load suggestions.';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []); // ← stable: trendingSearches is set via setter, recent is never read here

  // ── Recent searches mutations ─────────────────────────────────────────────────

  const addRecent = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((r) => r !== trimmed)].slice(0, MAX_RECENT);
      persistRecent(next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    persistRecent([]);
  }, []);

  // ── Derived data (no state, no effect, no extra render) ──────────────────────
  //
  // useMemo gives consumers a stable object reference that only changes when
  // one of the three source values actually changes. This replaces the old
  // useEffect that called setData() to keep a mirror state in sync.

  const data = useMemo<MobileSearchData | null>(
    () =>
      isLoading && trendingSearches.length === 0
        ? null // still on initial load
        : {
            trendingSearches,
            trySaying:      TRY_SAYING,
            recentSearches: recent,
          },
    [trendingSearches, recent, isLoading],
  );

  return { data, isLoading, error, fetchData, addRecent, clearRecent } as const;
}