
import {
  useEffect,
  useState,
  type ReactNode
} from "react";
import { AuthContext, type User } from "./auth";

type AuthApiResponse = {
  user?: User | null;
  message?: string;
};

async function requestAuthApi(
  path: string,
  init: RequestInit,
  failureMessage: string
): Promise<AuthApiResponse> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      credentials: "include"
    });
  } catch {
    throw new Error("Kunde inte nå API-servern. Kontrollera att den kör.");
  }

  let data: AuthApiResponse;
  try {
    data = await response.json() as AuthApiResponse;
  } catch {
    if (!response.ok) {
      throw new Error(
        `${failureMessage} Servern svarade med HTTP ${response.status}.`
      );
    }

    throw new Error("Servern returnerade ett ogiltigt svar.");
  }

  if (!response.ok) {
    throw new Error(data.message || failureMessage);
  }

  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API = "/api/auth";

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
    const data = await requestAuthApi(`${API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    }, "Kunde inte skapa konto");

    if (!data.user) throw new Error("Servern returnerade ingen användare");
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const data = await requestAuthApi(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    }, "Inloggningen misslyckades");

    if (!data.user) throw new Error("Servern returnerade ingen användare");
    setUser(data.user);
  };

  const updateAttendance = async (attendance: boolean | null) => {
    const data = await requestAuthApi(`${API}/wedding-attendance`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ wedding_attendance: attendance })
    }, "Kunde inte spara svaret");

    if (!data.user) throw new Error("Servern returnerade ingen användare");
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
    <AuthContext.Provider
      value={{ user, loading, register, login, updateAttendance, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
