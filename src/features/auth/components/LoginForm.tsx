import React from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import './LoginForm.css';

// Place Logo.svg in: src/app/assets/logo/Logo.svg
import logo from '../../../assets/logo/Logo.svg';
import { Link } from 'react-router-dom';

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

    return (
        <div className="login-page">
            {/* Brand logo — top-left, outside card, matches desktop design */}
            
        {/* Logo Section */}
{/* Navbar Section */}
            <header className="login-page__navbar">
                {/* 1. Left: Logo */}
        <Link to="/" className="login-page__brand-group">
                <img src={logo} alt="Cooks Delight" className="login-page__brand-logo" />
                <div className="login-page__brand-text">
                    <span className="login-page__brand-cooks">Cooks</span>
                    <span className="login-page__brand-delight">Delight</span>
                </div>
            </Link>

                {/* 3. Right: Hamburger Menu (Visible only on mobile) */}
                <div className="login-page__navbar-item login-page__navbar-item--right">
                    <button 
                        className="login-page__menu-btn" 
                        type="button" 
                        aria-label="Open menu"
                        onClick={() => console.log('Menu clicked! Open tabs here.')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 18L20 18" stroke="#262522" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M4 12L20 12" stroke="#262522" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M4 6L20 6" stroke="#262522" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
            </header>

            <div className="login-page__card">
                {/* Left panel — decorative food image */}
                <div className="login-page__image-panel" aria-hidden="true" />

                {/* Right panel — form */}
                <div className="login-page__form-panel">
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
                        {/* API-level error */}
                        {apiError && (
                            <div className="login-form__api-error" role="alert">
                                {apiError}
                            </div>
                        )}

                        {/* Username field */}
                        <div className="login-form__field">
                            <label
                                htmlFor="username"
                                className="login-form__label"
                            >
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
                                <span
                                    id="username-error"
                                    className="login-form__error"
                                    role="alert"
                                >
                                    {errors.username}
                                </span>
                            )}
                        </div>

                        {/* Password field */}
                        <div className="login-form__field">
                            <label
                                htmlFor="password"
                                className="login-form__label"
                            >
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
                                <span
                                    id="password-error"
                                    className="login-form__error"
                                    role="alert"
                                >
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
                            {isLoading ? 'Logging in...' : 'SIGN UP NOW!'}
                        </button>
                    </form>

                    {/* Divider + create account */}
                    <div className="login-page__divider" />
                    <p className="login-page__signup-text">
                        DON&apos;T HAVE AN ACCOUNT?{' '}
                        <a href="/register" className="login-page__signup-link">
                            CREATE ONE NOW
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
