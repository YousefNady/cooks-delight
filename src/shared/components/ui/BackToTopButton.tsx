// src/shared/components/ui/BackToTopButton.tsx

import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import './BackToTopButton.css';

const SCROLL_THRESHOLD = 300; // px before button appears

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`scroll-to-top${isVisible ? ' scroll-to-top--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      type="button"
    >
      <FiArrowUp className="scroll-to-top__icon" />
    </button>
  );
};

export default ScrollToTop;
