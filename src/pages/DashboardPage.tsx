import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ROLE_DESCRIPTION, ROLE_LABEL } from "@/lib/roles";
import { routesForRole } from "@/routes/routeConfig";

export default function DashboardPage() {
  const { session, role } = useAuth();
  if (!session || !role) return null;

  const shortcuts = routesForRole(role).filter((r) => r.path !== "/");

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Selamat datang, {session.user.fullName}
          </h1>
          <Badge variant="secondary">{ROLE_LABEL[role]}</Badge>
        </div>
        <p className="max-w-prose text-sm text-muted-foreground">{ROLE_DESCRIPTION[role]}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {shortcuts.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} className="rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <Card className="h-full gap-3 py-5 transition-colors hover:bg-accent/50">
              <CardHeader>
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <CardTitle className="pt-1">{label}</CardTitle>
                <CardDescription>Buka halaman {label.toLowerCase()}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
