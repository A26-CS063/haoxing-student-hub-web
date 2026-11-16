import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authService } from "@/services/auth/authService";
import { SESSION_KEY } from "@/services/auth/sessionStore";
import type { Role, Session } from "@/types/auth";

type AuthNotice = "session_expired" | null;

interface AuthContextValue {
  session: Session | null;
  role: Role | null;
  notice: AuthNotice;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearNotice: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => authService.restore());
  const [notice, setNotice] = useState<AuthNotice>(null);

  const login = useCallback(async (email: string, password: string) => {
    const next = await authService.login(email, password);
    setNotice(null);
    setSession(next);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  // Sesi kedaluwarsa otomatis (FR-01).
  useEffect(() => {
    if (!session) return;
    const remaining = session.expiresAt - Date.now();
    const timer = setTimeout(
      () => {
        void authService.logout();
        setSession(null);
        setNotice("session_expired");
      },
      Math.max(remaining, 0),
    );
    return () => clearTimeout(timer);
  }, [session]);

  // Logout/login di tab lain ikut tersinkron.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) setSession(authService.restore());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      role: session?.user.role ?? null,
      notice,
      login,
      logout,
      clearNotice: () => setNotice(null),
    }),
    [session, notice, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
