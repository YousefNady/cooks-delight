// src/features/search/types/search.types.ts

export interface Recipe {
  id: number;
  name: string;
  tags: string[];
}

export interface MobileSearchData {
  trendingSearches: string[];
  trySaying: string[];
  recentSearches: string[];
}