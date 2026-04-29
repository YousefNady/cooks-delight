import './SectionGrid.css'; // same CSS as featured-recipes, renamed

interface PaginationProps {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

interface FilterTab {
  label: string;
  value: string;
}

interface SectionGridProps<T> {
  // Required
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  columns?: 2 | 3; // ← default 2
  variant?: 'boxed' | 'plain'; // ← add this, default 'boxed'


  // Optional — pagination
  pagination?: PaginationProps;

  // Optional — filter tabs
  tabs?: FilterTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;

  // Optional — loading/error states
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function SectionGrid<T>({
  title,
  items,
  renderItem,
  columns = 2,      // ← ADD with default
  variant = 'boxed', // ← ADD with default
  pagination,
  tabs,
  activeTab,
  onTabChange,
  loading,
  error,
  onRetry,
}: SectionGridProps<T>) {
  return (
    <section className="section-grid">
      <div className={`section-grid__inner section-grid__inner--${variant}`}>

        {/* Header: title + optional pagination arrows */}
        <div className="section-grid__header">
          <h2 className="section-grid__heading">{title}</h2>
          {pagination && (
            <div className="section-grid__nav">
              <button
                className="section-grid__arrow"
                onClick={pagination.onPrev}
                disabled={pagination.page === 1}
                aria-label="Previous"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="section-grid__arrow"
                onClick={pagination.onNext}
                disabled={pagination.page === pagination.totalPages}
                aria-label="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Optional filter tabs (Image 3) */}
        {tabs && (
          <div className="section-grid__tabs">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`section-grid__tab${activeTab === tab.value ? ' section-grid__tab--active' : ''}`}
                onClick={() => onTabChange?.(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="section-grid__loading">
            <div className="section-grid__spinner" />
            <p>Loading...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="section-grid__error">
            <p>⚠️ {error}</p>
            <button className="section-grid__retry" onClick={onRetry}>
              Try again
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className={`section-grid__grid section-grid__grid--cols-${columns ?? 2}`}>
            {items.map((item, index) => (
              <div key={index} className="section-grid__item">
                {renderItem(item)}
              </div>
            ))}
          </div>
)}
      </div>
    </section>
  );
}

export default SectionGrid;