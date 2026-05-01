import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "./useDebouncedCallback";

const SEARCH_DEBOUNCE_MS = 500;

interface SearchInputState {
  query: string;
  term: string;
}

export function useRecipeSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState<SearchInputState>(() => ({
    query: currentQuery,
    term: currentQuery,
  }));

  let searchTerm = searchInput.term;

  if (searchInput.query !== currentQuery) {
    searchTerm = currentQuery;
    setSearchInput({
      query: currentQuery,
      term: currentQuery,
    });
  }

  const navigateToSearch = useCallback(
    (value: string) => {
      const query = value.trim();
      navigate(query ? `/recipes?q=${encodeURIComponent(query)}` : "/recipes");
    },
    [navigate]
  );

  const { schedule: scheduleSearch, cancel: cancelDebouncedSearch } =
    useDebouncedCallback((value: string) => {
      navigateToSearch(value);
    }, SEARCH_DEBOUNCE_MS);

  const submitSearch = (value = searchTerm) => {
    cancelDebouncedSearch();
    navigateToSearch(value);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput({
      query: currentQuery,
      term: value,
    });

    if (value.trim() === currentQuery.trim()) {
      cancelDebouncedSearch();
      return;
    }

    scheduleSearch(value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch();
  };

  return {
    searchTerm,
    handleSearchChange,
    submitSearch,
    handleSearchSubmit,
  };
}
