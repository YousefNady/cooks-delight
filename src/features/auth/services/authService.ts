// src/app/shared/services/authService.ts

import axios from 'axios';
import type { AuthResponse } from '../types/auth';

const API_URL = 'https://dummyjson.com/user'; // I reaplaced from /auth to /user since the dummyjson API doesn't have an auth endpoint

export const loginUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
    username,
    password,
    expiresInMins: 60,
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};