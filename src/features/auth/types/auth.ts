// src/features/auth/types/auth.ts

export interface AuthResponse {
  token: string;
  username: string;
  id: number;
  email: string;
}

export interface FormErrors {
  username?: string;
  password?: string;
}

// ── Signup ────────────────────────────────────────────────
 
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
 
export interface SignupResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}
 
export interface SignupFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
