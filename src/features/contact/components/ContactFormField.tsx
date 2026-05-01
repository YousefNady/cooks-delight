// src/features/contact/components/ContactFormField.tsx

import React from 'react';
import type { ChangeEvent } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BaseFieldProps {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'text' | 'email';
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  as?: never;
  options?: never;
}

interface TextareaFieldProps extends BaseFieldProps {
  as: 'textarea';
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  type?: never;
  options?: never;
}

interface SelectFieldProps extends BaseFieldProps {
  as: 'select';
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  type?: never;
}

type ContactFormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

// ─── Component ────────────────────────────────────────────────────────────────

const ContactFormField: React.FC<ContactFormFieldProps> = (props) => {
  const { id, name, label, error, required } = props;
  const fieldId = id;
  const errorId = `${id}-error`;

  return (
    <div className={`contact-form__field${error ? ' contact-form__field--error' : ''}`}>
      <label className="contact-form__label" htmlFor={fieldId}>
        {label}
        {required && <span className="contact-form__required" aria-hidden="true"> *</span>}
      </label>

      {props.as === 'textarea' ? (
        <textarea
          id={fieldId}
          name={name}
          className="contact-form__textarea"
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          rows={5}
        />
      ) : props.as === 'select' ? (
        <select
          id={fieldId}
          name={name}
          className="contact-form__select"
          value={props.value}
          onChange={props.onChange}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        >
          <option value="" disabled>Select a subject…</option>
          {props.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          name={name}
          type={props.type}
          className="contact-form__input"
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      )}

      {error && (
        <p id={errorId} className="contact-form__error" role="alert" aria-live="polite">
          <span className="contact-form__error-icon" aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default ContactFormField;