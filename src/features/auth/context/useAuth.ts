// src/features/auth/context/useAuth.ts
//
// Kept in its own file so react-refresh/only-export-components is satisfied:
//   AuthContext.tsx  → exports components only (AuthProvider)
//   useAuth.ts       → exports hooks only (useAuth)

import { useContext } from 'react';
import { AuthContext } from './auth-context';
import type { AuthContextValue } from './types';

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      'useAuth must be used inside <AuthProvider>. ' +
      'Wrap your app root with <AuthProvider>.'
    );
  }
  return ctx;
};