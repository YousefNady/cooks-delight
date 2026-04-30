// src/features/contact/hooks/useContactForm.ts

import { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface UseContactFormReturn {
  formData: ContactFormData;
  errors: ContactFormErrors;
  status: FormStatus;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM_DATA: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Validation ───────────────────────────────────────────────────────────────

const validateForm = (data: ContactFormData): ContactFormErrors => {
  const errors: ContactFormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Full name is required.';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.subject.trim()) {
    errors.subject = 'Please select a subject.';
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required.';
  } else if (data.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters.';
  }

  return errors;
};

// ─── Simulated API call ───────────────────────────────────────────────────────

const simulateApiSubmit = (data: ContactFormData): Promise<void> =>
  new Promise((resolve, reject) => {
    console.log('[ContactForm] Submitting:', data);
    setTimeout(() => {
      // Simulate 95% success rate
      if (Math.random() > 0.05) {
        resolve();
      } else {
        reject(new Error('Server error'));
      }
    }, 1800);
  });

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useContactForm = (): UseContactFormReturn => {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));

      // Clear the error for this field as the user types
      if (errors[name as keyof ContactFormData]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});
      setStatus('submitting');

      try {
        await simulateApiSubmit(formData);
        setStatus('success');
        setFormData(INITIAL_FORM_DATA);
      } catch {
        setStatus('error');
      }
    },
    [formData]
  );

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setStatus('idle');
  }, []);

  return { formData, errors, status, handleChange, handleSubmit, resetForm };
};
