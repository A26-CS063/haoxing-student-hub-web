import type { ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import ForbiddenPage from "@/pages/ForbiddenPage";
import type { Role } from "@/types/auth";

/** Membatasi halaman berdasarkan peran. Peran yang tidak cocok melihat halaman 403. */
export function RoleRoute({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { role } = useAuth();
  if (!role || !roles.includes(role)) return <ForbiddenPage />;
  return <>{children}</>;
}
