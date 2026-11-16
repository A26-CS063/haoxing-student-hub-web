import type { ComponentType } from "react";
import {
  BellRing,
  FileText,
  GraduationCap,
  LayoutDashboard,
  SlidersHorizontal,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import AiAssistantPage from "@/pages/AiAssistantPage";
import DashboardPage from "@/pages/DashboardPage";
import FollowupsPage from "@/pages/FollowupsPage";
import KnowledgeBasePage from "@/pages/KnowledgeBasePage";
import RulesPage from "@/pages/RulesPage";
import StudentsPage from "@/pages/StudentsPage";
import type { Role } from "@/types/auth";

export interface AppRoute {
  path: string;
  label: string;
  icon: LucideIcon;
  /** Peran yang boleh membuka halaman ini. Menu di sidebar mengikuti daftar ini. */
  roles: Role[];
  component: ComponentType;
}

/**
 * SATU SUMBER KEBENARAN untuk rute dan menu.
 * Menambah halaman baru = menambah satu baris di sini; sidebar dan penjaga rute ikut otomatis.
 * Catatan: ini hanya pembatas tampilan. Penegakan sebenarnya ada di backend (RBAC) dan RLS database.
 */
export const APP_ROUTES: AppRoute[] = [
  { path: "/", label: "Beranda", icon: LayoutDashboard, roles: ["admin", "owner"], component: DashboardPage },
  { path: "/siswa", label: "Data siswa", icon: GraduationCap, roles: ["admin", "owner"], component: StudentsPage },
  { path: "/tindak-lanjut", label: "Tindak lanjut", icon: BellRing, roles: ["admin", "owner"], component: FollowupsPage },
  { path: "/asisten-ai", label: "Asisten AI", icon: Sparkles, roles: ["admin", "owner"], component: AiAssistantPage },
  { path: "/dokumen", label: "Dokumen aturan", icon: FileText, roles: ["admin"], component: KnowledgeBasePage },
  { path: "/aturan", label: "Aturan tindak lanjut", icon: SlidersHorizontal, roles: ["admin"], component: RulesPage },
];

export function routesForRole(role: Role): AppRoute[] {
  return APP_ROUTES.filter((r) => r.roles.includes(role));
}
