import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { routesForRole } from "@/routes/routeConfig";
import type { Role } from "@/types/auth";

interface SidebarProps {
  role: Role;
  onNavigate?: () => void;
  /** true = sidebar diciutkan (hanya ikon). Abaikan untuk sidebar versi HP. */
  collapsed?: boolean;
  /** Kalau diisi, tombol buka/tutup muncul di bagian bawah sidebar. */
  onToggleCollapse?: () => void;
}

export function Sidebar({ role, onNavigate, collapsed = false, onToggleCollapse }: SidebarProps) {
  const items = routesForRole(role);

  return (
    <div className="flex h-full flex-col">
      {/* Logo: versi Color saat terbuka, versi Square saat diciutkan */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b",
          collapsed ? "justify-center px-2" : "px-5",
        )}
      >
        {collapsed ? (
          <Logo variant="square" className="size-10" />
        ) : (
          <Logo variant="color" className="h-10 w-auto max-w-full" />
        )}
      </div>

      <nav aria-label="Menu utama" className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {items.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === "/"}
                onClick={onNavigate}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    collapsed ? "justify-center px-0" : "px-3",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {/* Saat diciutkan, teks disembunyikan secara visual tapi tetap dibaca screen reader */}
                <span className={cn(collapsed && "sr-only")}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {onToggleCollapse && (
        <div className="shrink-0 border-t p-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onToggleCollapse}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            className={cn(
              "w-full text-muted-foreground",
              collapsed ? "justify-center px-0" : "justify-start",
            )}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            {!collapsed && <span>Tutup sidebar</span>}
          </Button>
        </div>
      )}
    </div>
  );
}