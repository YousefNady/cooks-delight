// src/features/dashboard/utils/recentlyViewedStorage.ts

const RECENTLY_VIEWED_KEY = "cd_recently_viewed";

interface StoredViewEntry {
  id: number;
  viewedAt: string;
}

export function readRecentlyViewed(): StoredViewEntry[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item): StoredViewEntry | null => {
        if (typeof item === "number") {
          return { id: item, viewedAt: new Date().toISOString() };
        }
        if (item && typeof item === "object" && "id" in item) {
          return {
            id: Number(item.id),
            viewedAt:
              typeof item.viewedAt === "string"
                ? item.viewedAt
                : new Date().toISOString(),
          };
        }
        return null;
      })
      .filter((e): e is StoredViewEntry => e !== null && Number.isFinite(e.id));
  } catch {
    return [];
  }
}

export function writeRecentlyViewed(entries: StoredViewEntry[]): void {
  try {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(entries));
  } catch {
    console.warn("[recentlyViewedStorage] Could not write recently viewed.");
  }
}

export function markRecipeAsViewed(id: number): void {
  const entries = readRecentlyViewed().filter((e) => e.id !== id);
  entries.unshift({ id, viewedAt: new Date().toISOString() });
  writeRecentlyViewed(entries.slice(0, 20));
}