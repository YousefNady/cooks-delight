import { useEffect, useMemo, useState } from "react";

interface UseShowMoreRecipesOptions<T> {
  items: T[];
  initialCount: number;
  resetKey?: string;
}

interface UseShowMoreRecipesReturn<T> {
  visibleItems: T[];
  isExpanded: boolean;
  canToggle: boolean;
  toggleVisibleItems: () => void;
}

export function useShowMoreRecipes<T>({
  items,
  initialCount,
  resetKey = "",
}: UseShowMoreRecipesOptions<T>): UseShowMoreRecipesReturn<T> {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [initialCount, resetKey]);

  const isExpanded = visibleCount >= items.length;
  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const toggleVisibleItems = () => {
    setVisibleCount(isExpanded ? initialCount : items.length);
  };

  return {
    visibleItems,
    isExpanded,
    canToggle: items.length > initialCount,
    toggleVisibleItems,
  };
}
