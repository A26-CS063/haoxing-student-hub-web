import { AuthError, type AuthUser, type Session } from "@/types/auth";

import type { AuthService } from "./authService";
import { clearSession, readSession, writeSession } from "./sessionStore";

/**
 * AKUN DEMO UNTUK PENGEMBANGAN LOKAL SAJA.
 * Jangan dipakai di staging/produksi. Kata sandi asli dikelola Supabase Auth di backend.
 */
interface MockUser extends AuthUser {
  password: string;
  isActive: boolean;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    email: "admin@haoxing.test",
    password: "Admin123!",
    fullName: "Admin Haoxing",
    role: "admin",
    isActive: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    email: "pemilik@haoxing.test",
    password: "Pemilik123!",
    fullName: "Pemilik Haoxing",
    role: "owner",
    isActive: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    email: "nonaktif@haoxing.test",
    password: "Nonaktif123!",
    fullName: "Akun Nonaktif",
    role: "admin",
    isActive: false,
  },
];

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 jam

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuthService: AuthService = {
  async login(email, password) {
    await wait(600);
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    // Pesan sama untuk "email tidak terdaftar" dan "kata sandi salah" agar tidak membocorkan daftar akun.
    if (!found || found.password !== password) {
      throw new AuthError("invalid_credentials", "Email atau kata sandi salah.");
    }
    if (!found.isActive) {
      throw new AuthError(
        "account_disabled",
        "Akun ini dinonaktifkan. Hubungi pemilik lembaga.",
      );
    }
    const session: Session = {
      accessToken: `mock-token-${found.id}`,
      expiresAt: Date.now() + SESSION_DURATION_MS,
      user: { id: found.id, email: found.email, fullName: found.fullName, role: found.role },
    };
    writeSession(session);
    return session;
  },

  async logout() {
    clearSession();
  },

  restore() {
    return readSession();
  },
};
