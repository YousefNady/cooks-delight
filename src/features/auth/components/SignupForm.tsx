// src/features/auth/components/SignupForm.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignupForm } from '../hooks/useSignupForm';
import AuthLayout from '../layouts/AuthLayout';
import MobileMenu from '../../../shared/layout/Mobilemenu';
import '../styles/SignupForm.css';

// Unsplash image URL used as the left-panel background
const SIGNUP_IMAGE =
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80';

const SignupForm: React.FC = () => {
  const {
    fullName,
    email,
    password,
    confirmPassword,
    isLoading,
    apiError,
    successMessage,
    errors,
    setFullName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  } = useSignupForm();

    // ── Mobile menu state — same pattern as Navbar ──
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <AuthLayout
        imageSrc={SIGNUP_IMAGE}
        onMenuOpen={() => setIsMobileMenuOpen(true)}
      >

      <h1 className="signup-form__heading">CREATE ACCOUNT</h1>
      <p className="signup-form__subtext">
        Join the kitchen community. Save your favorite recipes,
        share cooking tips, and build your personal recipe space.
      </p>

      <form
        className="signup-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Sign up form"
      >
        {/* API error banner */}
        {apiError && (
          <div className="signup-form__api-error" role="alert">
            {apiError}
          </div>
        )}

        {/* Success banner */}
        {successMessage && (
          <div className="signup-form__success" role="status">
            {successMessage}{' '}
            <Link to="/login" className="signup-form__success-link">
              Log in now →
            </Link>
          </div>
        )}

        {/* Full Name */}
        <div className="signup-form__field">
          <label htmlFor="fullName" className="signup-form__label">
            FULL NAME
          </label>
          <input
            id="fullName"
            type="text"
            className={`signup-form__input${errors.fullName ? ' signup-form__input--error' : ''}`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            autoFocus
            disabled={isLoading}
            placeholder="Jane Doe"
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && (
            <span id="fullName-error" className="signup-form__error" role="alert">
              {errors.fullName}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="signup-form__field">
          <label htmlFor="email" className="signup-form__label">
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            type="email"
            className={`signup-form__input${errors.email ? ' signup-form__input--error' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={isLoading}
            placeholder="jane@example.com"
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <span id="email-error" className="signup-form__error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="signup-form__field">
          <label htmlFor="password" className="signup-form__label">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            className={`signup-form__input${errors.password ? ' signup-form__input--error' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={isLoading}
            placeholder="Min. 8 characters"
            aria-describedby={errors.password ? 'password-error' : undefined}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <span id="password-error" className="signup-form__error" role="alert">
              {errors.password}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="signup-form__field">
          <label htmlFor="confirmPassword" className="signup-form__label">
            CONFIRM PASSWORD
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`signup-form__input${errors.confirmPassword ? ' signup-form__input--error' : ''}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            disabled={isLoading}
            placeholder="Repeat your password"
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <span id="confirmPassword-error" className="signup-form__error" role="alert">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="signup-form__button"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Creating account...' : 'CREATE ACCOUNT'}
        </button>
      </form>

      <div className="signup-form__divider" />

      <p className="signup-form__login-text">
        ALREADY HAVE AN ACCOUNT?{' '}
        <Link to="/login" className="signup-form__login-link">
          LOG IN
        </Link>
      </p>

    </AuthLayout>

          {/* Mobile menu — same pattern as Navbar */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default SignupForm;
