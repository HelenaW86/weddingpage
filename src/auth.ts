import { createContext, useContext } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  wedding_attendance: boolean | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  updateAttendance: (attendance: boolean | null) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth måste användas inom AuthProvider");
  }

  return context;
}
