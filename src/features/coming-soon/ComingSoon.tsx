import React, { useState, useEffect, useCallback } from "react";
import "./ComingSoon.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CountdownUnit {
  label: string;
  value: number;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: "success" | "error";
}

interface FloatingIngredient {
  id: number;
  emoji: string;
  style: React.CSSProperties;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LAUNCH_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

const FLOATING_INGREDIENTS: FloatingIngredient[] = [
  { id: 1, emoji: "🍅", style: { top: "12%", left: "8%", animationDelay: "0s", animationDuration: "6s" } },
  { id: 2, emoji: "🧄", style: { top: "25%", right: "10%", animationDelay: "1.2s", animationDuration: "7s" } },
  { id: 3, emoji: "🌿", style: { top: "55%", left: "5%", animationDelay: "0.5s", animationDuration: "8s" } },
  { id: 4, emoji: "🥕", style: { top: "70%", right: "7%", animationDelay: "2s", animationDuration: "6.5s" } },
  { id: 5, emoji: "🧅", style: { top: "40%", left: "3%", animationDelay: "1.8s", animationDuration: "9s" } },
  { id: 6, emoji: "🌶️", style: { top: "15%", right: "5%", animationDelay: "0.8s", animationDuration: "7.5s" } },
  { id: 7, emoji: "🍄", style: { bottom: "30%", left: "9%", animationDelay: "3s", animationDuration: "8s" } },
  { id: 8, emoji: "🍋", style: { bottom: "20%", right: "12%", animationDelay: "1.5s", animationDuration: "6.8s" } },
];

const TEASER_FEATURES = [
  {
    icon: "✦",
    title: "Smart Recipe Pairing",
    desc: "AI-curated wine & side dish suggestions tailored to every recipe.",
  },
  {
    icon: "◈",
    title: "Chef's Technique Library",
    desc: "Step-by-step video breakdowns from professional kitchens worldwide.",
  },
  {
    icon: "⬡",
    title: "Seasonal Ingredient Maps",
    desc: "Know exactly what's at peak flavour near you, right now.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcCountdown(target: Date): CountdownUnit[] {
  const diff = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return [
    { label: "Days", value: d },
    { label: "Hours", value: h },
    { label: "Mins", value: m },
    { label: "Secs", value: s },
  ];
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const FloatingIngredients: React.FC = () => (
  <div className="coming-soon__floats" aria-hidden="true">
    {FLOATING_INGREDIENTS.map((ing) => (
      <span key={ing.id} className="coming-soon__float" style={ing.style}>
        {ing.emoji}
      </span>
    ))}
  </div>
);

const CountdownBlock: React.FC<{ units: CountdownUnit[] }> = ({ units }) => (
  <div className="coming-soon__countdown" role="timer" aria-label="Countdown to launch">
    {units.map((u, i) => (
      <React.Fragment key={u.label}>
        <div className="coming-soon__countdown-unit">
          <span className="coming-soon__countdown-value">{pad(u.value)}</span>
          <span className="coming-soon__countdown-label">{u.label}</span>
        </div>
        {i < units.length - 1 && (
          <span className="coming-soon__countdown-sep" aria-hidden="true">:</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

const FeatureTeaser: React.FC = () => (
  <ul className="coming-soon__features" aria-label="Upcoming features">
    {TEASER_FEATURES.map((f) => (
      <li key={f.title} className="coming-soon__feature-card">
        <span className="coming-soon__feature-icon" aria-hidden="true">{f.icon}</span>
        <div>
          <h3 className="coming-soon__feature-title">{f.title}</h3>
          <p className="coming-soon__feature-desc">{f.desc}</p>
        </div>
      </li>
    ))}
  </ul>
);

const Toast: React.FC<{ toast: ToastState; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(onClose, 4000);
      return () => clearTimeout(t);
    }
  }, [toast.visible, onClose]);

  return (
    <div
      className={`coming-soon__toast coming-soon__toast--${toast.type} ${toast.visible ? "coming-soon__toast--visible" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="coming-soon__toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
      <span>{toast.message}</span>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ComingSoon: React.FC = () => {
  const [countdown, setCountdown] = useState<CountdownUnit[]>(calcCountdown(LAUNCH_DATE));
  const [email, setEmail] = useState<string>("");
  const [toast, setToast] = useState<ToastState>({ visible: false, message: "", type: "success" });

  // Countdown ticker
  useEffect(() => {
    const id = setInterval(() => setCountdown(calcCountdown(LAUNCH_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  const hideToast = useCallback(() => setToast((p) => ({ ...p, visible: false })), []);

  const handleNotify = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = email.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      if (!valid) {
        setToast({ visible: true, message: "Please enter a valid email address.", type: "error" });
        return;
      }
      setEmail("");
      setToast({
        visible: true,
        message: "You're on the list! We'll notify you at launch. 🎉",
        type: "success",
      });
    },
    [email]
  );

  return (
    <main className="coming-soon" id="main-content">
      <FloatingIngredients />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="coming-soon__hero" aria-labelledby="cs-heading">
        <div className="coming-soon__hero-inner">
          {/* Decorative pot illustration */}
          <div className="coming-soon__pot-wrap" aria-hidden="true">
            <div className="coming-soon__pot">
              <div className="coming-soon__pot-steam">
                <span /><span /><span />
              </div>
              <div className="coming-soon__pot-body">
                <div className="coming-soon__pot-lid" />
                <div className="coming-soon__pot-base">
                  <span className="coming-soon__pot-veg">🥕</span>
                  <span className="coming-soon__pot-veg">🌿</span>
                  <span className="coming-soon__pot-veg">🍅</span>
                </div>
              </div>
              <div className="coming-soon__pot-handles">
                <span /><span />
              </div>
            </div>
          </div>

          <div className="coming-soon__badge" aria-label="Status">
            <span className="coming-soon__badge-dot" aria-hidden="true" />
            Something is Cooking
          </div>

          <h1 className="coming-soon__heading" id="cs-heading">
            A New Chapter in <br />
            <em>Culinary Discovery</em>
          </h1>

          <p className="coming-soon__subtext">
            We're crafting something extraordinary — a space where passionate home cooks
            and seasoned chefs converge. Expect handpicked recipes, professional techniques,
            and stories told through flavour.
          </p>

          <p className="coming-soon__tagline">
            Launching soon. Until then, sharpen your knives.
          </p>
        </div>
      </section>

      {/* ── Countdown ─────────────────────────────────────────── */}
      <section className="coming-soon__countdown-section" aria-label="Launch countdown">
        <div className="coming-soon__container">
          <p className="coming-soon__countdown-label-text">Launch Countdown</p>
          <CountdownBlock units={countdown} />
          <div className="coming-soon__divider" aria-hidden="true" />
        </div>
      </section>

      {/* ── Feature Teasers ───────────────────────────────────── */}
      <section
        className="coming-soon__features-section"
        aria-labelledby="cs-features-heading"
      >
        <div className="coming-soon__container">
          <h2 className="coming-soon__section-label" id="cs-features-heading">
            What's coming
          </h2>
          <FeatureTeaser />
        </div>
      </section>

      {/* ── CTA / Notify Me ───────────────────────────────────── */}
      <section className="coming-soon__cta-section" aria-labelledby="cs-cta-heading">
        <div className="coming-soon__container coming-soon__container--narrow">
          <div className="coming-soon__cta-card">
            <div className="coming-soon__cta-decoration" aria-hidden="true">
              <span>🔔</span>
            </div>
            <h2 className="coming-soon__cta-heading" id="cs-cta-heading">
              Be the First to Know
            </h2>
            <p className="coming-soon__cta-body">
              Join a community of food lovers. Get early access, exclusive recipes,
              and behind-the-scenes kitchen notes — delivered to your inbox.
            </p>

            <form
              className="coming-soon__notify-form"
              onSubmit={handleNotify}
              noValidate
              aria-label="Email notification signup"
            >
              <label htmlFor="cs-email" className="coming-soon__notify-label">
                Your email address
              </label>
              <div className="coming-soon__notify-row">
                <input
                  id="cs-email"
                  type="email"
                  className="coming-soon__notify-input"
                  placeholder="chef@yourkitchen.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-required="true"
                />
                <button type="submit" className="coming-soon__notify-btn">
                  Notify Me
                </button>
              </div>
              <p className="coming-soon__notify-disclaimer">
                No spam, ever. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ── Back to Home ──────────────────────────────────────── */}
      <div className="coming-soon__back">
        <a href="/" className="coming-soon__back-link" aria-label="Return to Home page">
          <span className="coming-soon__back-arrow" aria-hidden="true">←</span>
          Back to Home
        </a>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </main>
  );
};

export default ComingSoon;