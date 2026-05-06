import { useSearchParams } from "react-router-dom";
import RecipeResults from "../components/RecipeResults";

export default function Recipes() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  return <RecipeResults query={query} />;
}
