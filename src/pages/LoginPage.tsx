import { Navigate, useLocation } from "react-router-dom";

import { LoginForm } from "@/components/layout/login-form";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import logoSquare from "@/assets/logo-haoxing-community.png";

interface LocationState {
  from?: { pathname: string; search?: string };
}

export default function LoginPage() {
  const { session } = useAuth();
  const location = useLocation();

  const from = (location.state as LocationState | null)?.from;
  const redirectTo = from ? `${from.pathname}${from.search ?? ""}` : "/";

  if (session) return <Navigate to={redirectTo} replace />;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Kolom kiri: brand di atas, form di tengah (struktur login-02) */}
      <div className="flex flex-col gap-4 bg-card p-6 md:p-10">
        <div className="flex justify-center md:justify-start lg:hidden">
          <Logo variant="color" className="h-10 w-auto" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm redirectTo={redirectTo} />
          </div>
        </div>
      </div>

      {/* Kolom kanan: di template berisi gambar, di sini logo besar */}
      {/* Kolom kanan: logo Haoxing memenuhi panel */}
      <div className="relative hidden bg-background lg:block">
        <img
          src={logoSquare}
          alt="Logo Haoxing Mandarin Center"
          className="absolute inset-0 h-full w-full object-contain p-12"
        />
      </div>
    </div>
  );
}