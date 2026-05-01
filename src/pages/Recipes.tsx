import { useEffect, useState } from "react";
import { getRecipes } from "../features/recipes/services/API";
import type { Recipe } from "../features/recipes/types/Recipe";
import { filterRecipes } from "../features/recipes/utils/filtre";
import FilterButtons from "../features/recipes/components/FilterButtons";
import RecipeCard from "../shared/components/RecipeCard/RecipeCard";
import "../shared/components/RecipeCard/RecipeCard.css";
import "../features/recipes/style/buttomsShow.css"

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All");
  
  // العدد الأولي للكروت
  const INITIAL_COUNT = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    getRecipes().then((data) => {
      if (data?.recipes) {
        setRecipes(data.recipes);
      }
      setLoading(false);
    });
  }, []);

  // إعادة العرض لـ 6 فقط عند تغيير الفلتر
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [selected]);

  if (loading) return <p>Loading...</p>;

  // تصفية البيانات
  const filteredData = filterRecipes(recipes, selected);
  // قصر البيانات المعروضة بناءً على السيت
  const displayedRecipes = filteredData.slice(0, visibleCount);

  // هل الحالة حالياً "عرض الكل"؟
  const isExpanded = visibleCount >= filteredData.length;

  const toggleRecipes = () => {
    if (isExpanded) {
      setVisibleCount(INITIAL_COUNT); // ارجع لـ 6
    } else {
      setVisibleCount(filteredData.length); // اعرض الكل
    }
  };

  return (
    <>
      {/* Intro */}
      <div className="recipes-intro">
        <p className="recipes-title">Recipes</p>
        <h1 className="recipes-heading">
          Recipes Embark on a journey
        </h1>
        <p className="recipes-text">
          With our diverse collection of recipes we have something to satisfy every palate.
        </p>
      </div>

      {/* Filter Buttons */}
      <FilterButtons selected={selected} setSelected={setSelected} />

      {/* Recipes Grid */}
      <div className="recipes-grid">
        {displayedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* زر عرض المزيد / عرض أقل */}
      {filteredData.length > INITIAL_COUNT && (
        <div className="load-more-container">
          <button 
            className="toggle-expand-btn" 
            onClick={toggleRecipes}
          >
            {isExpanded ? "Show Less" : "Show All Recipes"}
            <span className={`arrow-icon ${isExpanded ? "up" : "down"}`}>
              {isExpanded ? "▴" : "▾"}
            </span>
          </button>
        </div>
      )}
    </>
  );
}