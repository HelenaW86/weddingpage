
import {
  useEffect,
  useState,
  type ReactNode
} from "react";
import { AuthContext, type User } from "./auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3000/api/auth";

  // Check existing session on page load
  useEffect(() => {
    fetch(`${API}/me`, {
      credentials: "include"
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data.user;
      })
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Kunde inte skapa konto");
    }

    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Inloggningen misslyckades");
    }

    setUser(data.user);
  };

  // Logout
  const logout = async () => {
    const res = await fetch(`${API}/logout`, {
      method: "POST",
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("Kunde inte logga ut");
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
