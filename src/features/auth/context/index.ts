// src/features/auth/context/index.ts
//
// Re-exports everything through one path so no existing import statements
// need to change anywhere in the codebase.
//
// Before the split, consumers imported like this:
//   import { useAuth, AuthProvider } from '../context/AuthContext';
//
// After the split they can still use that exact path — just update it to:
//   import { useAuth, AuthProvider } from '../context';   ← cleaner
// OR keep the full path, both work identically.

export { AuthProvider } from './AuthContext';
export { AuthContext } from './auth-context';
export type { AuthUser, AuthContextValue } from './types';
export { useAuth } from './useAuth';