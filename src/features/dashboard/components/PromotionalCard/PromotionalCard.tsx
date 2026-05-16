import React from "react";
import { useNavigate } from "react-router-dom";
import "./PromotionalCard.css";

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const IconBell: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * The three tint flavours visible in the right column of the dashboard.
 *
 *  "orange"  → "Try Premium"     warm amber icon on apricot bg
 *  "blue"    → "Leave Reviews"   cornflower icon on icy blue bg
 *  "green"   → "Shopping List"   sage icon on mint bg
 *
 * The card surface itself is always white; only the icon bubble changes.
 */
export type PromotionalCardVariant = "orange" | "blue" | "green";

export interface PromotionalCardProps {
  /**
   * Card headline, e.g. "Try Premium".
   * An optional "Coming Soon" suffix label is toggled via `hasNotificationBadge`.
   */
  title: string;

  /** Supporting copy beneath the title */
  description: string;

  /**
   * Icon rendered inside the tinted bubble.
   * Pass an inline SVG element; the card controls size and colour.
   */
  icon: React.ReactElement;

  /**
   * When true, renders a "Coming Soon" badge inline with the title
   * and shows the "Notify Me" bell button.
   * When false (default), no badge and no notify button are rendered —
   * leaving room for a custom CTA passed via the `action` prop.
   */
  hasNotificationBadge?: boolean;

  /**
   * Optional CTA rendered at the bottom of the card.
   * If `hasNotificationBadge` is true this is ignored — the built-in
   * "Notify Me" button is shown instead.
   * Pass a <button> or <a> element styled however your feature needs.
   */
  action?: React.ReactNode;

  /**
   * Controls the icon bubble background and tint.
   * @default "orange"
   */
  variant?: PromotionalCardVariant;

  /** Optional click handler wired to the "Notify Me" button */
  onNotify?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const PromotionalCard: React.FC<PromotionalCardProps> = ({
  title,
  description,
  icon,
  hasNotificationBadge = false,
  action,
  variant = "orange",
  onNotify,
}) => {
  const navigate = useNavigate();
  return (
    <article
      className={`promo-card promo-card--${variant}`}
      aria-label={title}
    >
      {/* ── Icon bubble ── */}
      <div className="promo-card__icon-bubble" aria-hidden="true">
        {icon}
      </div>

      {/* ── Text ── */}
      <div className="promo-card__body">
        {/* Title + optional badge */}
        <div className="promo-card__title-row">
          <h3 className="promo-card__title">{title}</h3>
          {hasNotificationBadge && (
            <span className="promo-card__badge" aria-label="Coming soon">
              Coming Soon
            </span>
          )}
        </div>

        {/* Description */}
        <p className="promo-card__description">{description}</p>
      </div>

      {/* ── CTA ── */}
      {hasNotificationBadge ? (
        <button
          className="promo-card__notify-btn"
          type="button"
          onClick={() => {
            if (onNotify) onNotify();   
            navigate("/coming-soon");   // 👈
          }}
          aria-label={`Notify me when ${title} is available`}
        >
          <span className="promo-card__notify-btn-icon" aria-hidden="true">
            <IconBell />
          </span>
          Notify Me
        </button>
      ) : (
        action && <div className="promo-card__action">{action}</div>
      )}
    </article>
  );
};

export default PromotionalCard;