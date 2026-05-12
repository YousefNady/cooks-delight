import React from "react";
import "./StatsCard.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * The three color variants visible in the dashboard's top stat row.
 * Each maps to a distinct icon background tint + icon color.
 *
 *  "orange"  → Saved Recipes     (warm coral/orange)
 *  "green"   → Recently Viewed   (soft sage green)
 *  "purple"  → Recipes Explored  (soft lavender/purple)
 */
export type StatsCardVariant = "orange" | "green" | "purple";

export interface StatsCardProps {
    /**
     * The icon rendered inside the tinted circle.
     * Pass an inline SVG element; the component controls size and color.
     */
    icon: React.ReactElement;

    /** The large numeric value displayed prominently, e.g. 24 */
    value: number;

    /** The card's main label, e.g. "Saved Recipes" */
    label: string;

    /** The smaller helper/sub-label beneath the value, e.g. "Your favorite recipes" */
    helperText: string;

    /**
     * Controls the icon bubble tint.
     * @default "orange"
     */
    variant?: StatsCardVariant;
}

// ---------------------------------------------------------------------------
// Default icon — used in the example/Storybook; consumers supply their own
// ---------------------------------------------------------------------------

// const DefaultIcon: React.FC = () => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
//         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
//     </svg>
// );

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    value,
    label,
    helperText,
    variant = "orange",
}) => {
    return (
        <article
            className={`stats-card stats-card--${variant}`}
            aria-label={`${label}: ${value}`}
        >
            {/* Tinted icon bubble */}
            <div className="stats-card__icon-bubble" aria-hidden="true">
                {icon}
            </div>

            {/* Text block */}
            <div className="stats-card__body">
                <span className="stats-card__label">{label}</span>
                <strong className="stats-card__value">{value}</strong>
                <span className="stats-card__helper">{helperText}</span>
            </div>
        </article>
    );
};

export default StatsCard;