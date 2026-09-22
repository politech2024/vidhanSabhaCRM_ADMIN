import { createContext } from 'react';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
