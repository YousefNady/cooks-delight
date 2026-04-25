// src/app/shared/types/auth.ts

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

