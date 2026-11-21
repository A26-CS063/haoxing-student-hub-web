import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { BrandLogo } from "@/components/BrandLogo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

interface LoginFormProps extends React.ComponentProps<"div"> {
  redirectTo: string;
}

export function LoginForm({ className, redirectTo, ...props }: LoginFormProps) {
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-3xl border bg-card p-0 text-card-foreground shadow-sm">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-card p-6 text-primary md:p-10">
            <FieldGroup>
              <div className="flex flex-col items-start gap-4">
                <BrandLogo className="h-12 md:hidden" />
                <div className="flex flex-col gap-2">
                  <h1 className="font-heading text-3xl font-semibold uppercase leading-tight tracking-tight text-primary">
                    Selamat datang kembali
                  </h1>
                  <p className="text-balance text-primary/80">
                    Masuk untuk mengelola data siswa Haoxing Mandarin Center.
                  </p>
                </div>
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

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email" className="text-primary">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  autoFocus
                  placeholder="nama@lembaga.id"
                  className="h-11 rounded-xl border-primary/25 text-foreground focus-visible:border-primary focus-visible:ring-primary/30"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
                <FieldError id="email-error" errors={[errors.email]} />
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password" className="text-primary">
                  Kata sandi
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="h-11 rounded-xl border-primary/25 pr-11 text-foreground focus-visible:border-primary focus-visible:ring-primary/30"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 size-11 rounded-xl text-primary/70 hover:text-primary"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                <FieldError id="password-error" errors={[errors.password]} />
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  {isSubmitting ? "Memeriksa akun..." : "Masuk"}
                </Button>
              </Field>

              <FieldDescription className="pt-2 text-xs text-primary/70">
                &copy; {new Date().getFullYear()} Haoxing Mandarin Center. Hak cipta dilindungi.
              </FieldDescription>
            </FieldGroup>
          </form>
          {/* Panel kanan*/}
          <div className="hidden h-full w-full items-center justify-center bg-primary p-10 text-primary-foreground md:flex">
            <BrandLogo className="max-h-64 w-auto max-w-full object-contain" />
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}