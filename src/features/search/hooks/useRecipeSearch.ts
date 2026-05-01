import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function useRecipeSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setSearchTerm(searchParams.get("q") ?? "");
  }, [searchParams]);

  const submitSearch = (value = searchTerm) => {
    const query = value.trim();

    navigate(query ? `/recipes?q=${encodeURIComponent(query)}` : "/recipes");
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch();
  };

  return {
    searchTerm,
    setSearchTerm,
    submitSearch,
    handleSearchSubmit,
  };
}
