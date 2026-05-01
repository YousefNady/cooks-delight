// src/features/auth/services/authService.ts

import axios from 'axios';
import type { AuthResponse, SignupRequest, SignupResponse } from '../types/auth';

const API_URL = 'https://dummyjson.com'; // I reaplaced from /auth to /user since the dummyjson API doesn't have an auth endpoint

// ── Login ─────────────────────────────────────────────────

export const loginUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/user/login`, {
    username,
    password,
    expiresInMins: 60,
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};

// ── Signup ────────────────────────────────────────────────
 
export const signupUser = async (
  payload: SignupRequest
): Promise<SignupResponse> => {
  const response = await axios.post<SignupResponse>(`${API_URL}/users/add`, {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
  });
  return response.data;
};