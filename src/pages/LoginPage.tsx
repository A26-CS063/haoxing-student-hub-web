import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { AUTH_MODE } from "@/services/auth/authService";
import { MOCK_USERS } from "@/services/auth/mockAuthService";
import { AuthError } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LocationState {
  from?: { pathname: string; search?: string };
}

export default function LoginPage() {
  const { session, login, notice, clearNotice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const from = (location.state as LocationState | null)?.from;
  const redirectTo = from ? `${from.pathname}${from.search ?? ""}` : "/";

  if (session) return <Navigate to={redirectTo} replace />;

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    clearNotice();
    try {
      await login(values.email, values.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(
        err instanceof AuthError ? err.message : "Terjadi kesalahan. Coba lagi sebentar lagi.",
      );
    }
  }

  const showDemo = import.meta.env.DEV && AUTH_MODE === "mock";
  const demoAdmin = MOCK_USERS.find((u) => u.role === "admin" && u.isActive);
  const demoOwner = MOCK_USERS.find((u) => u.role === "owner" && u.isActive);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <p className="text-lg font-semibold tracking-tight">Haoxing Student Hub</p>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none text-[22rem] font-medium leading-none text-primary-foreground/10"
        >
          好
        </span>
        <div className="relative max-w-sm">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Data siswa Haoxing Mandarin Center dalam satu tempat.
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Catat, cari, dan pantau status siswa tanpa membuka buku.
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <p className="mb-6 text-lg font-semibold tracking-tight lg:hidden">Haoxing Student Hub</p>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Masuk</CardTitle>
              <CardDescription>Gunakan akun yang diberikan oleh pengelola lembaga.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                {notice === "session_expired" && !formError && (
                  <Alert>
                    <TriangleAlert />
                    <AlertTitle>Sesi berakhir</AlertTitle>
                    <AlertDescription>Silakan masuk lagi untuk melanjutkan.</AlertDescription>
                  </Alert>
                )}

                {formError && (
                  <Alert variant="destructive">
                    <TriangleAlert />
                    <AlertTitle>Tidak bisa masuk</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    autoFocus
                    placeholder="nama@lembaga.id"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Kata sandi</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="pr-10"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      {...register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 size-9 text-muted-foreground"
                      aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  {isSubmitting ? "Memeriksa akun..." : "Masuk"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {showDemo && demoAdmin && demoOwner && (
            <div className="mt-4 rounded-lg border border-dashed p-3 text-sm">
              <p className="mb-2 text-muted-foreground">Akun demo (hanya mode pengembangan)</p>
              <div className="flex gap-2">
                {[demoAdmin, demoOwner].map((u) => (
                  <Button
                    key={u.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setValue("email", u.email);
                      setValue("password", u.password);
                    }}
                  >
                    Isi akun {u.role === "admin" ? "admin" : "pemilik"}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
