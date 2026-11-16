import type { Session } from "@/types/auth";

export const SESSION_KEY = "hsh.session";

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== "object") return false;
  const s = value as Partial<Session>;
  return (
    typeof s.accessToken === "string" &&
    typeof s.expiresAt === "number" &&
    !!s.user &&
    typeof s.user.id === "string" &&
    typeof s.user.email === "string" &&
    typeof s.user.fullName === "string" &&
    (s.user.role === "admin" || s.user.role === "owner")
  );
}

/** Membaca sesi tersimpan. Mengembalikan null jika tidak ada, rusak, atau sudah kedaluwarsa. */
export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isSession(parsed) || parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session: Session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* penyimpanan tidak tersedia: sesi hanya hidup di memori */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* abaikan */
  }
}
