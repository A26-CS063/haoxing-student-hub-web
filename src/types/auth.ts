export type Role = "admin" | "owner";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface Session {
  accessToken: string;
  user: AuthUser;
  /** Waktu kedaluwarsa sesi, dalam milidetik (Date.now()). */
  expiresAt: number;
}

export type AuthErrorCode = "invalid_credentials" | "account_disabled" | "network";

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}
