// src/features/search/components/MobileSearchModal.tsx

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiMic, FiClock } from 'react-icons/fi';
import { useMobileSearch } from '../hooks/useMobileSearch';
import { useSpeechRecognition } from '../../../shared/hooks/useSpeechRecognition';
import '../styles/mobile-search-modal.css';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const MobileSearchModal = ({ isOpen, onClose }: MobileSearchModalProps) => {
  const [term, setTerm] = useState('');
  const inputRef        = useRef<HTMLInputElement>(null);
  const navigate        = useNavigate();

  const { data, isLoading, error, fetchData, addRecent, clearRecent } =
    useMobileSearch();

  // Wire voice search to the modal's input
  const handleVoiceResult = useCallback((transcript: string) => setTerm(transcript), []);
  const { isListening, voiceError, toggleListening, stop } = useSpeechRecognition({
    onResult: handleVoiceResult,
  });

  // Fetch suggestions when modal opens (only once)
  useEffect(() => {
    if (isOpen) {
      fetchData();
      // Delay focus so the open animation doesn't jank
      setTimeout(() => inputRef.current?.focus(), 120);
    }
    // Clean up voice on close
    if (!isOpen) stop();
  }, [isOpen, fetchData, stop]);

  // Block body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const submitSearch = (value: string) => {
    const q = value.trim();
    if (!q) return;
    addRecent(q);
    onClose();
    navigate(`/recipes?q=${encodeURIComponent(q)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch(term);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTerm(suggestion);
    submitSearch(suggestion);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mobile-search" role="dialog" aria-modal="true" aria-label="Search">

      {/* ── Top bar ── */}
      <div className="mobile-search__bar">
        <button
          className="mobile-search__close"
          type="button"
          onClick={onClose}
          aria-label="Close search"
        >
          <FiX aria-hidden="true" />
        </button>

        <form
          className="mobile-search__input-wrap"
          onSubmit={handleSubmit}
          role="search"
        >
          <FiSearch className="mobile-search__input-icon" aria-hidden="true" />

          <input
            ref={inputRef}
            className="mobile-search__input"
            type="text"
            placeholder="Search recipes, ingredients..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            aria-label="Search recipes"
          />

          <button
            className={`mobile-search__mic${isListening ? ' mobile-search__mic--listening' : ''}`}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => toggleListening(term)}
            aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
            aria-pressed={isListening}
            title={voiceError || undefined}
          >
            <FiMic aria-hidden="true" />
          </button>
        </form>
      </div>

      {/* ── Body ── */}
      <div className="mobile-search__body">

        {isLoading && (
          <div className="mobile-search__loading" aria-live="polite">
            {/* Skeleton pills */}
            <div style={{ width: '100%', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[90, 70, 110, 80, 95].map((w) => (
                <div key={w} className="mobile-search__skeleton" style={{ width: w }} />
              ))}
            </div>
          </div>
        )}

        {error && <p className="mobile-search__error">{error}</p>}

        {data && !isLoading && (
          <>
            {/* ── Trending Searches ── */}
            {data.trendingSearches.length > 0 && (
              <section className="mobile-search__section" aria-labelledby="ms-trending">
                <div className="mobile-search__section-head">
                  <h2 className="mobile-search__section-title" id="ms-trending">
                    Trending Searches
                  </h2>
                </div>
                <div className="mobile-search__tags" role="list">
                  {data.trendingSearches.map((tag) => (
                    <button
                      key={tag}
                      className="mobile-search__tag"
                      type="button"
                      role="listitem"
                      onClick={() => handleSuggestionClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ── Try saying… ── */}
            <section className="mobile-search__section" aria-labelledby="ms-try">
              <div className="mobile-search__section-head">
                <h2 className="mobile-search__section-title" id="ms-try">Try saying…</h2>
              </div>
              <ul className="mobile-search__try-list" role="list">
                {data.trySaying.map((phrase) => (
                  <li key={phrase}>
                    <button
                      className="mobile-search__try-item"
                      type="button"
                      onClick={() => handleSuggestionClick(phrase)}
                    >
                      <span className="mobile-search__try-text">{phrase}</span>
                      <FiMic className="mobile-search__try-mic" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── Recent Searches ── */}
            {data.recentSearches.length > 0 && (
              <section className="mobile-search__section" aria-labelledby="ms-recent">
                <div className="mobile-search__section-head">
                  <h2 className="mobile-search__section-title" id="ms-recent">
                    Recent Searches
                  </h2>
                  <button
                    className="mobile-search__clear-btn"
                    type="button"
                    onClick={clearRecent}
                    aria-label="Clear recent searches"
                  >
                    Clear
                  </button>
                </div>
                <ul className="mobile-search__recent-list" role="list">
                  {data.recentSearches.map((item) => (
                    <li key={item}>
                      <button
                        className="mobile-search__recent-item"
                        type="button"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <FiClock
                          className="mobile-search__recent-icon"
                          aria-hidden="true"
                        />
                        <span className="mobile-search__recent-text">{item}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MobileSearchModal;