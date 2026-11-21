import { Navigate, useLocation } from "react-router-dom";

import loginBg from "@/assets/login-bg.png"; // sesuaikan ekstensi (.png / .jpg) jika berbeda
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/context/AuthContext";

interface LocationState {
  from?: { pathname: string; search?: string };
}

export default function LoginPage() {
  const { session } = useAuth();
  const location = useLocation();

  const from = (location.state as LocationState | null)?.from;
  const redirectTo = from ? `${from.pathname}${from.search ?? ""}` : "/";

  // Sudah login: tidak perlu melihat halaman login lagi.
  if (session) return <Navigate to={redirectTo} replace />;

  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0" />
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}