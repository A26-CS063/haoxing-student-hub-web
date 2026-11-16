import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { routesForRole } from "@/routes/routeConfig";
import type { Role } from "@/types/auth";

interface SidebarProps {
  role: Role;
  onNavigate?: () => void;
}

export function Sidebar({ role, onNavigate }: SidebarProps) {
  const items = routesForRole(role);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-3 border-b px-5">
        <span
          className="flex size-8 items-center justify-center rounded-md bg-primary text-lg font-medium text-primary-foreground"
          aria-hidden="true"
        >
          好
        </span>
        <span className="font-semibold tracking-tight">Haoxing Student Hub</span>
      </div>

      <nav aria-label="Menu utama" className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {items.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === "/"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )
                }
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
