// src/features/contact/components/ContactInfoCard.tsx

import React from 'react';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactInfoCardProps {
  icon: ReactNode;
  title: string;
  line1: string;
  line2?: string;
  href?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ icon, title, line1, line2, href }) => {
  return (
    <div className="contact-info__card">
      <div className="contact-info__card-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="contact-info__card-body">
        <h3 className="contact-info__card-title">{title}</h3>
        {href ? (
          <a
            href={href}
            className="contact-info__card-link"
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noreferrer' : undefined}
          >
            {line1}
          </a>
        ) : (
          <p className="contact-info__card-text">{line1}</p>
        )}
        {line2 && <p className="contact-info__card-subtext">{line2}</p>}
      </div>
    </div>
  );
};

export default ContactInfoCard;