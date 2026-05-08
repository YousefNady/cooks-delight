import "../styles/home.css";
import FeaturedRecipesSection from "../../../shared/components/FeaturedRecipesSection/FeaturedRecipesSection";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiSearch, FiX } from "react-icons/fi";
import AboutUsCard from "../components/aboutuscard";
import HomeShowcase from "../components/HomeShowcase";
import DiversePalette from "../components/DiversePalette";
import { useAuth } from "../../auth/context/useAuth";

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0?: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  item: (index: number) => SpeechRecognitionResultLike;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike {
  error?: string;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceBaseTermRef = useRef("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const submitMobileSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = mobileSearchTerm.trim();
    navigate(query ? `/recipes?q=${encodeURIComponent(query)}` : "/recipes");
  };

  const handleVoiceSearch = () => {
    searchInputRef.current?.focus();

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError("Voice search is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      return;
    }

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    voiceBaseTermRef.current = mobileSearchTerm.trim();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index] ?? event.results.item(index);
        const transcript = result?.[0]?.transcript ?? "";

        if (result?.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const spokenText = `${finalTranscript} ${interimTranscript}`.trim();
      const nextSearchTerm = `${voiceBaseTermRef.current} ${spokenText}`
        .trim();

      setVoiceError("");
      setMobileSearchTerm(nextSearchTerm);
    

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      silenceTimerRef.current = setTimeout(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
      }, 100000); 
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceError(
        event.error === "not-allowed"
          ? "Microphone access was blocked."
          : "We could not hear that clearly. Please try again."
      );
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    setVoiceError("");
    setIsListening(true);
    recognition.start();
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

          <form
            className={`home-mobile-search${isListening ? " home-mobile-search--listening" : ""}`}
            onSubmit={submitMobileSearch}
            role="search"
          >
            <FiSearch className="home-mobile-search__icon" aria-hidden="true" />
            <input
              ref={searchInputRef}
              className="home-mobile-search__input"
              type="search"
              placeholder="Search..."
              value={mobileSearchTerm}
              onChange={(event) => setMobileSearchTerm(event.target.value)}
              aria-label="Search recipes"
            />
            {mobileSearchTerm && (
              <button
                className="home-mobile-search__clear"
                type="button"
                onClick={() => {
                  setMobileSearchTerm("");
                  setVoiceError("");
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
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleVoiceSearch}
                aria-label={isListening ? "Stop voice search" : "Start voice search"}
                aria-pressed={isListening}
              >
                <FiMic aria-hidden="true" />
              </button>
            </span>
            <span className="home-mobile-search__status" aria-live="polite">
              {voiceError || (isListening ? "Listening" : "")}
            </span>
          </form>

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
