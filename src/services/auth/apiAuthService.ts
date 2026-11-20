import { AuthError, type Session } from "@/types/auth";

import type { AuthService } from "./authService";
import { clearSession, readSession, writeSession } from "./sessionStore";

/**
 * Kerangka untuk login ke backend sungguhan.
 * SESUAIKAN dengan kontrak API yang disepakati FS-1 dan FS-2 di Minggu 1.
 * Asumsi saat ini: POST {API_URL}/auth/login -> { access_token, expires_in, user: { id, email, full_name, role } }
 * Peran (role) harus datang dari server (tabel profiles), bukan dari klaim yang bisa diubah klien.
 */
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

interface LoginResponse {
  access_token: string;
  expires_in: number; // detik
  user: { id: string; email: string; full_name: string; role: "admin" | "owner" };
}

export const apiAuthService: AuthService = {
  async login(email, password) {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
    } catch {
      throw new AuthError("network", "Tidak dapat terhubung ke server. Coba lagi.");
    }

    if (res.status === 403) {
      throw new AuthError(
        "account_disabled",
        "Akun ini dinonaktifkan. Hubungi pemilik lembaga.",
      );
    }
    if (!res.ok) {
      throw new AuthError("invalid_credentials", "Email atau kata sandi salah.");
    }

    const data = (await res.json()) as LoginResponse;
    const session: Session = {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.full_name,
        role: data.user.role,
      },
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
