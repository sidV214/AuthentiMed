import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type BackendRole =
  | "manufacturer"
  | "distributor"
  | "pharmacist"
  | "consumer"
  | "regulator";

export interface AuthUser {
  token: string;
  role: BackendRole;
  userId: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (token: string, role: BackendRole, userId: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "authentimed_auth";

const AuthContext = createContext<AuthContextValue | null>(null);

function loadFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.token && data?.role && data?.userId) return data;
  } catch {
    /* ignore */
  }
  return null;
}

function saveToStorage(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(loadFromStorage());
    setHydrated(true);
  }, []);

  const login = useCallback((token: string, role: BackendRole, userId: string) => {
    const authUser: AuthUser = { token, role, userId };
    setUser(authUser);
    saveToStorage(authUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearStorage();
  }, []);

  const value: AuthContextValue = { user, login, logout };

  if (!hydrated) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
