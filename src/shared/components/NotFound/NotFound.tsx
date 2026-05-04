// src/shared/components/NotFound/NotFound.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <div className="not-found__container">

        {/* Image */}
        <div className="not-found__image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80"
            alt="An empty plate — page not found"
            className="not-found__image"
          />
          <span className="not-found__badge">404</span>
        </div>

        {/* Copy */}
        <div className="not-found__content">
          <h1 className="not-found__heading">
            This recipe is missing from our cookbook.
          </h1>
          <p className="not-found__subtext">
            Looks like this page wandered off the menu. It may have been moved,
            removed, or never existed in the first place — much like a soufflé
            that didn't quite make it.
          </p>

          <Link to="/" className="not-found__btn">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
