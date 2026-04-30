// src/features/contact/index.ts
// Barrel export — import the page like: import { ContactPage } from '@/features/contact'

export { default as ContactPage } from './pages/ContactPage';
export { useContactForm } from './hooks/useContactForm';
export type { ContactFormData, ContactFormErrors, FormStatus } from './hooks/useContactForm';