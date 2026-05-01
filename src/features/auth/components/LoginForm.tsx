// src/features/auth/components/LoginForm.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import AuthLayout from '../layouts/AuthLayout';
import MobileMenu from '../../../shared/layout/Mobilemenu';
import loginImage from '../../../assets/login/pexels-zain-abba-1.png';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const {
    username,
    password,
    isLoading,
    apiError,
    errors,
    setUsername,
    setPassword,
    handleSubmit,
  } = useLoginForm();

    // ── Mobile menu state — same pattern as Navbar ──
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <>
          <AuthLayout
        imageSrc={loginImage}
        onMenuOpen={() => setIsMobileMenuOpen(true)}
      >

      <h1 className="login-form__heading">LOG IN</h1>
      <p className="login-form__subtext">
        Welcome back to your kitchen. Log in to access your saved recipes,
        favorite dishes, and personal cooking space.
      </p>

      <form
        className="login-form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Login form"
      >
        {/* API error */}
        {apiError && (
          <div className="login-form__api-error" role="alert">
            {apiError}
          </div>
        )}

        {/* Username */}
        <div className="login-form__field">
          <label htmlFor="username" className="login-form__label">
            USERNAME
          </label>
          <input
            id="username"
            type="text"
            className={`login-form__input${errors.username ? ' login-form__input--error' : ''}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            disabled={isLoading}
            aria-describedby={errors.username ? 'username-error' : undefined}
            aria-invalid={!!errors.username}
          />
          {errors.username && (
            <span id="username-error" className="login-form__error" role="alert">
              {errors.username}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="login-form__field">
          <label htmlFor="password" className="login-form__label">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            className={`login-form__input${errors.password ? ' login-form__input--error' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={isLoading}
            aria-describedby={errors.password ? 'password-error' : undefined}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <span id="password-error" className="login-form__error" role="alert">
              {errors.password}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="login-form__button"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Logging in...' : 'SIGN IN NOW!'}
        </button>
      </form>

      <div className="login-form__divider" />

      <p className="login-form__signup-text">
        DON&apos;T HAVE AN ACCOUNT?{' '}
        <Link to="/register" className="login-form__signup-link">
          CREATE ONE NOW
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

export default LoginForm;
