// src/features/contact/components/ContactForm.tsx

import React from 'react';
import { FiSend, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import ContactFormField from './ContactFormField';
import { useContactForm } from '../hooks/useContactForm';
import '../styles/ContactForm.css';

// ─── Subject options ──────────────────────────────────────────────────────────

const SUBJECT_OPTIONS = [
  { value: 'general',         label: 'General Inquiry'        },
  { value: 'recipe',          label: 'Recipe Question'        },
  { value: 'collaboration',   label: 'Collaboration / Press'  },
  { value: 'bug',             label: 'Report a Bug'           },
  { value: 'feedback',        label: 'Feedback & Suggestions' },
  { value: 'other',           label: 'Other'                  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ContactForm: React.FC = () => {
  const { formData, errors, status, handleChange, handleSubmit, resetForm } = useContactForm();

  /* ── Success state ── */
  if (status === 'success') {
    return (
      <div className="contact-form__success" role="status" aria-live="polite">
        <div className="contact-form__success-icon">
          <FiCheckCircle aria-hidden="true" />
        </div>
        <h3 className="contact-form__success-title">Message Sent!</h3>
        <p className="contact-form__success-text">
          Thank you for reaching out! Isabella will get back to you
          within 2–3 business days. In the meantime, explore some recipes!
        </p>
        <button
          type="button"
          className="contact-form__btn contact-form__btn--secondary"
          onClick={resetForm}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
    >
      {/* Server-level error banner */}
      {status === 'error' && (
        <div className="contact-form__server-error" role="alert">
          <FiAlertCircle aria-hidden="true" />
          <p>Something went wrong on our end. Please try again in a moment.</p>
          <button
            type="button"
            className="contact-form__dismiss"
            onClick={resetForm}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Row 1: Name + Email */}
      <div className="contact-form__row">
        <ContactFormField
          id="contact-name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="e.g. John Smith"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <ContactFormField
          id="contact-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="e.g. john@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      </div>

      {/* Row 2: Subject */}
      <ContactFormField
        id="contact-subject"
        name="subject"
        as="select"
        label="Subject"
        value={formData.subject}
        onChange={handleChange}
        options={SUBJECT_OPTIONS}
        error={errors.subject}
        required
      />

      {/* Row 3: Message */}
      <ContactFormField
        id="contact-message"
        name="message"
        as="textarea"
        label="Your Message"
        placeholder="Tell us anything — recipe ideas, collaborations, or just say hi!"
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        required
      />

      {/* Submit */}
      <button
        type="submit"
        className={`contact-form__btn contact-form__btn--primary${status === 'submitting' ? ' contact-form__btn--loading' : ''}`}
        disabled={status === 'submitting'}
        aria-busy={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <>
            <span className="contact-form__spinner" aria-hidden="true">
              <FiRefreshCw />
            </span>
            Sending…
          </>
        ) : (
          <>
            <FiSend aria-hidden="true" />
            SEND MESSAGE
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;