// src/features/auth/hooks/useSignupForm.ts

import { useState } from 'react';
import axios from 'axios';
import { signupUser } from '../services/authService';
import type { SignupFormErrors } from '../types/auth';

interface SignupFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseSignupFormReturn extends SignupFormState {
  isLoading: boolean;
  apiError: string;
  successMessage: string;
  errors: SignupFormErrors;
  setFullName: (val: string) => void;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

// ── Pure validation ───────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (fields: SignupFormState): SignupFormErrors => {
  const errors: SignupFormErrors = {};

  if (!fields.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (fields.fullName.trim().split(' ').length < 2) {
    errors.fullName = 'Please enter your first and last name.';
  }

  if (!fields.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

// ── Hook ──────────────────────────────────────────────────

export const useSignupForm = (): UseSignupFormReturn => {
  const [fullName, setFullNameState] = useState('');
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [confirmPassword, setConfirmPasswordState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<SignupFormErrors>({});

  // Clear individual field error on change
  const clearError = (field: keyof SignupFormErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const setFullName = (val: string) => { setFullNameState(val); clearError('fullName'); };
  const setEmail = (val: string) => { setEmailState(val); clearError('email'); };
  const setPassword = (val: string) => { setPasswordState(val); clearError('password'); };
  const setConfirmPassword = (val: string) => { setConfirmPasswordState(val); clearError('confirmPassword'); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    const fields = { fullName, email, password, confirmPassword };
    const validationErrors = validate(fields);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const [firstName, ...rest] = fullName.trim().split(' ');
    const lastName = rest.join(' ');

    setIsLoading(true);
    try {
      const data = await signupUser({ firstName, lastName, email, password });
      setSuccessMessage(`Welcome, ${data.firstName}! Your account has been created.`);
      // Reset form on success
      setFullNameState('');
      setEmailState('');
      setPasswordState('');
      setConfirmPasswordState('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setApiError(msg || 'Sign up failed. Please try again.');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};