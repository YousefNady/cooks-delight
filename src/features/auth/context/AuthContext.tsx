// src/features/auth/context/AuthContext.tsx

import React, { useState, useCallback } from 'react';
import { AuthContext } from './auth-context';
import type { AuthUser } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type { AuthUser, AuthContextValue } from './types';

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEYS = {
  token: "token",
  username: "username",
  userId: "userId",
  email: "email",
  image: "image",
} as const;

const readStoredUser = (): AuthUser | null => {
  try {
    const username = localStorage.getItem(STORAGE_KEYS.username);
    if (!username) return null;
    const userId = localStorage.getItem(STORAGE_KEYS.userId) ?? "";
    // Prefer the explicitly stored image; reconstruct from userId as fallback
    const image =
      localStorage.getItem(STORAGE_KEYS.image) ||
      `https://dummyjson.com/icon/${userId || "default"}/128`;
    return {
      username,
      email: localStorage.getItem(STORAGE_KEYS.email) ?? "",
      userId,
      image,
    };
  } catch {
    return null;
  }
};

const persistUser = (user: AuthUser): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.username, user.username);
    localStorage.setItem(STORAGE_KEYS.userId, user.userId);
    localStorage.setItem(STORAGE_KEYS.email, user.email);
    if (user.image) localStorage.setItem(STORAGE_KEYS.image, user.image); // 👈 add this
  } catch {
    console.warn('[AuthContext] Could not write to localStorage.');
  }
};

const clearStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch {
    console.warn('[AuthContext] Could not clear localStorage.');
  }
};

// ─── Provider — the ONLY component export in this file ───────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  const login = useCallback((incoming: AuthUser): void => {
    persistUser(incoming);
    setUser(incoming);
  }, []);

  const logout = useCallback((): void => {
    clearStorage();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// useAuth lives in ./useAuth.ts — import it from there:
//   import { useAuth } from '../context/useAuth';
//   import { useAuth } from '../context';          ← via barrel index.ts
// ─────────────────────────────────────────────────────────────────────────────