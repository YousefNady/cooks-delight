// src/features/contact/pages/ContactPage.tsx

import React from 'react';
import {
  FiMail,
  FiMapPin,
  FiClock,
} from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import ContactForm from '../components/ContactForm';
import ContactInfoCard from '../components/ContactInfoCard';
import '../styles/ContactPage.css';

// ─── Component ────────────────────────────────────────────────────────────────

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">

      {/* ── Hero Banner ── */}
      <section className="contact-hero" aria-labelledby="contact-hero-heading">
        <div className="contact-hero__content">
          <p className="contact-hero__eyebrow">GET IN TOUCH</p>
          <h1 className="contact-hero__heading" id="contact-hero-heading">
            LET'S TALK<br />FOOD &amp; FLAVORS
          </h1>
          <p className="contact-hero__subtext">
            Have a recipe question, collaboration idea, or just want to share
            your culinary adventures? Isabella's kitchen door is always open.
          </p>
        </div>

        {/* <div className="contact-hero__blobs-wrapper"> */}
        {/* Decorative ingredient blobs */}
        {/* <span className="contact-hero__blob contact-hero__blob--1" aria-hidden="true" /> */}
        {/* <span className="contact-hero__blob contact-hero__blob--2" aria-hidden="true" /> */}
        {/* <span className="contact-hero__blob contact-hero__blob--3" aria-hidden="true" /> */}
        {/* </div> */}
      </section>

      {/* ── Main content: info cards + form ── */}
      <section className="contact-main" aria-label="Contact information and form">
        <div className="contact-main__container">

          {/* ── Left: Info panel ── */}
          <aside className="contact-info" aria-label="Contact details">
            <div className="contact-info__header">
              <h2 className="contact-info__title">Contact Information</h2>
              <p className="contact-info__subtitle">
                Prefer not to fill out a form? Reach out directly — any way you like.
              </p>
            </div>

            <div className="contact-info__cards">
              <ContactInfoCard
                icon={<FiMail />}
                title="Email Us"
                line1="hello@cooksdelight.com"
                line2="We reply within 2–3 business days"
                href="mailto:hello@cooksdelight.com"
              />
              <ContactInfoCard
                icon={<FiMapPin />}
                title="Based In"
                line1="Florence, Italy"
                line2="Cooking for the world 🌍"
              />
              <ContactInfoCard
                icon={<FiClock />}
                title="Office Hours"
                line1="Mon – Fri: 9 AM – 6 PM CET"
                line2="Weekends: occasionally 😄"
              />
            </div>

            {/* Social links */}
            <div className="contact-info__social">
              <p className="contact-info__social-label">Follow along</p>
              <div className="contact-info__social-icons">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="contact-info__social-link"
                >
                  <FaFacebookF aria-hidden="true" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="contact-info__social-link"
                >
                  <FaInstagram aria-hidden="true" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="contact-info__social-link"
                >
                  <FaYoutube aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Decorative food illustration text art */}
            <div className="contact-info__deco" aria-hidden="true">
              <span>🍳</span>
              <span>🌿</span>
              <span>🍋</span>
            </div>
          </aside>

          {/* ── Right: Form panel ── */}
          <div className="contact-form-panel" aria-label="Send us a message">
            <div className="contact-form-panel__header">
              <h2 className="contact-form-panel__title">Send a Message</h2>
              <p className="contact-form-panel__subtitle">
                Fill in the form below and we'll be in touch soon.
                Fields marked with <span aria-label="asterisk, required">*</span> are required.
              </p>
            </div>
            <ContactForm />
          </div>

        </div>
      </section>

      {/* ── FAQ teaser strip ── */}
      <section className="contact-faq" aria-labelledby="faq-heading">
        <div className="contact-faq__container">
          <p className="contact-faq__eyebrow">QUICK ANSWERS</p>
          <h2 className="contact-faq__heading" id="faq-heading">
            Frequently Asked Questions
          </h2>
          <div className="contact-faq__grid">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="contact-faq__item">
                <summary className="contact-faq__question">{item.q}</summary>
                <p className="contact-faq__answer">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'Can I submit my own recipe?',
    a: 'Absolutely! Send it via the form above using "Feedback & Suggestions" as the subject. We review all community recipes every month.',
  },
  {
    q: 'Do you offer cooking classes?',
    a: "Not yet, but it's on the horizon! Sign up for an account to be the first to know when we launch.",
  },
  {
    q: 'How do I report a broken recipe step?',
    a: 'Select "Report a Bug" in the subject dropdown and describe what is wrong. We will fix it within 48 hours.',
  },
  {
    q: 'Are you open to brand collaborations?',
    a: 'Yes! We love working with food brands that align with our values. Choose "Collaboration / Press" and tell us about yourself.',
  },
];

export default ContactPage;
