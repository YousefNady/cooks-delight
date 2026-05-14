// src/features/auth/context/types.ts

export interface AuthUser {
  username: string;
  
  email: string;
  userId: string;
  image: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}
