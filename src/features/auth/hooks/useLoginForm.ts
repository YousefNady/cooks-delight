import { useState } from 'react';
import axios from 'axios';
import { loginUser } from '../../../features/auth/services/authService';
import type { FormErrors } from '../../../features/auth/types/auth';
import { useNavigate } from 'react-router-dom';

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
  if (!username.trim()) {
    errors.username = 'Username is required.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters.';
  }
  return errors;
};

export const useLoginForm = (): UseLoginFormReturn => {
  const navigate = useNavigate();
  const [username, setUsernameState] = useState('');
  const [password, setPasswordState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

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
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('userId', String(data.id));
      localStorage.setItem('email', data.email);
      // Navigate to home — caller can handle redirect
      // window.location.href = '/';
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