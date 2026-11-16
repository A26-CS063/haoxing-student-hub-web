import type { Session } from "@/types/auth";

import { apiAuthService } from "./apiAuthService";
import { mockAuthService } from "./mockAuthService";

export interface AuthService {
  login(email: string, password: string): Promise<Session>;
  logout(): Promise<void>;
  /** Memulihkan sesi dari penyimpanan. null jika tidak ada atau sudah kedaluwarsa. */
  restore(): Session | null;
}

/** Ganti lewat VITE_AUTH_MODE di file .env ("mock" atau "api"). */
export const AUTH_MODE = import.meta.env.VITE_AUTH_MODE ?? "mock";

export const authService: AuthService =
  AUTH_MODE === "api" ? apiAuthService : mockAuthService;
