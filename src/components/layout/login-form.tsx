import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { AUTH_MODE } from "@/services/auth/authService";
import { MOCK_USERS } from "@/services/auth/mockAuthService";
import { AuthError } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps extends React.ComponentProps<"form"> {
  redirectTo: string;
}

export function LoginForm({ redirectTo, className, ...props }: LoginFormProps) {
  const { login, notice, clearNotice } = useAuth();
  const navigate = useNavigate();
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      {/* Header (gaya login-02: judul di tengah) */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold">Masuk ke akun Anda</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Gunakan akun yang diberikan oleh pengelola lembaga.
        </p>
      </div>

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

      <div className="grid gap-6">
        <div className="grid gap-3">
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

        <div className="grid gap-3">
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Memeriksa akun..." : "Masuk"}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun atau lupa kata sandi? Hubungi admin lembaga.
      </p>

      {showDemo && demoAdmin && demoOwner && (
        <div className="rounded-lg border border-dashed p-3 text-sm">
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
    </form>
  );
}