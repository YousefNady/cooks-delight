// src/features/auth/hooks/useLoginForm.ts
//
// Changes from original:
//   • Imports useAuth and calls login() after a successful API response.
//   • localStorage is still written by loginUser() / the service layer,
//     and AuthContext.login() also writes it — both stay in sync.
//   • The manual localStorage.setItem calls are REMOVED from here since
//     AuthContext.login() → persistUser() handles that now.

import { useState } from 'react';
import axios from 'axios';
import { loginUser } from '../services/authService';
import type { FormErrors } from '../types/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';   // ← consume context to call login() on success

interface UseLoginFormReturn {
  username: string;
  password: string;
  isLoading: boolean;
  apiError: string;
  errors: FormErrors;
  setUsername: (val: string) => void;
  setPassword: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const validate = (username: string, password: string): FormErrors => {
  const errors: FormErrors = {};
  if (!username.trim()) errors.username = 'Username is required.';
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters.';
  }
  return errors;
};

export const useLoginForm = (): UseLoginFormReturn => {
  const navigate = useNavigate();
  const { login } = useAuth();   // ← consume context

  const [username, setUsernameState] = useState('');
  const [password, setPasswordState] = useState('');
  const [isLoading, setIsLoading]    = useState(false);
  const [apiError, setApiError]      = useState('');
  const [errors, setErrors]          = useState<FormErrors>({});

  const setUsername = (val: string) => {
    setUsernameState(val);
    if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
  };

  const setPassword = (val: string) => {
    setPasswordState(val);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate(username, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const data = await loginUser(username, password);

      /*
       * Call context login() — this:
       *   1. Updates React state → Navbar re-renders immediately (no refresh needed)
       *   2. Persists username / userId / email to localStorage via persistUser()
       * The token is written separately because AuthContext doesn't manage it
       * (it's only needed for API calls, not for UI auth state).
       */
      localStorage.setItem('token', data.token);
      login({
        username: data.username,
        userId:   String(data.id),
        email:    data.email,
        image:    `https://dummyjson.com/icon/${data.id}/128`,
      });

      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setApiError(msg || 'Login failed. Please check your credentials.');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    password,
    isLoading,
    apiError,
    errors,
    setUsername,
    setPassword,
    handleSubmit,
  };
};