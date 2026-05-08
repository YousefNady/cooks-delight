import "../styles/home.css";
import FeaturedRecipesSection from "../../../shared/components/FeaturedRecipesSection/FeaturedRecipesSection";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiSearch, FiX } from "react-icons/fi";
import AboutUsCard from "../components/aboutuscard";
import HomeShowcase from "../components/HomeShowcase";
import DiversePalette from "../components/DiversePalette";
import { useAuth } from "../../auth/context/useAuth";
// ── All Speech types + mic logic now live here ────────────────────────────────
import { useSpeechRecognition } from "../../../shared/hooks/useSpeechRecognition";
import { useRecipeSearch } from "../../../shared/hooks/useRecipeSearch";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const {
    searchTerm,
    setSearchTerm,
    handleSearchChange,
    submitSearch,
    handleSearchSubmit,
  } = useRecipeSearch();

  const handleVoiceResult = useCallback(
    (transcript: string) => setSearchTerm(transcript),
    [setSearchTerm]
  );

  // Delegate all mic state & Web Speech API complexity to the shared hook
  const { isListening, voiceError, toggleListening, stop, clearError } =
    useSpeechRecognition({
      onResult: handleVoiceResult,
    });

  // Abort recognition if the component unmounts (e.g. navigating away mid-listen)
  useEffect(() => () => stop(), [stop]);

  const handleToggleMic = () => {
    searchInputRef.current?.focus();

    if (isListening) {
      stop();
      submitSearch(searchTerm);
      return;
    }

    toggleListening(searchTerm);
  };

  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <section className="home-hero">
        <div className="home-hero__content">

          <h1 className="home-hero__title">
            UNLEASH CULINARY <br /> EXCELLENCE
          </h1>

          <p className="home-hero__description">
            Explore a world of flavors, discover handcrafted recipes,
            and let the aroma of our passion for cooking fill your kitchen.
          </p>

          {/* ── Mobile voice-enabled search ── */}
          <form
            className={`home-mobile-search${isListening ? " home-mobile-search--listening" : ""}`}
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <FiSearch className="home-mobile-search__icon" aria-hidden="true" />

            <input
              ref={searchInputRef}
              className="home-mobile-search__input"
              type="search"
              placeholder="Search recipes, ingredients..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search recipes"
            />

            {searchTerm && (
              <button
                className="home-mobile-search__clear"
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  clearError();
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <FiX aria-hidden="true" />
              </button>
            )}

            <span className="home-mobile-search__mic-wrap">
              <button
                className={`home-mobile-search__mic${isListening ? " home-mobile-search__mic--listening" : ""}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleToggleMic}
                aria-label={isListening ? "Stop voice search" : "Start voice search"}
                aria-pressed={isListening}
              >
                <FiMic aria-hidden="true" />
              </button>
            </span>

            <span className="home-mobile-search__status" aria-live="polite">
              {voiceError || (isListening ? "Listening…" : "")}
            </span>
          </form>

          {/* ── CTA buttons ── */}
          <div className="home-hero__actions">
            {!isAuthenticated && (
              <button
                className="hero-signin-button"
                onClick={() => navigate("/register")}
              >
                SIGN UP NOW
              </button>
            )}
            <button
              className="hero-button--secondary"
              onClick={() => navigate("/recipes")}
            >
              EXPLORE RECIPES
            </button>
          </div>

        </div>
      </section>

      <DiversePalette />
      <FeaturedRecipesSection />
      <HomeShowcase />
      <AboutUsCard />
    </div>
  );
}
