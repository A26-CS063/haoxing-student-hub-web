import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL } from "@/lib/roles";
import { cn } from "@/lib/utils";

const SIDEBAR_KEY = "sidebar-collapsed";

export function AppLayout() {
  const { session, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Status buka/tutup sidebar desktop, disimpan di browser
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, String(collapsed));
    } catch {
      /* abaikan kalau penyimpanan browser tidak tersedia */
    }
  }, [collapsed]);

  if (!session || !role) return null;

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop: bisa dibuka/tutup, menempel saat halaman di-scroll */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r bg-card transition-[width] duration-200 motion-reduce:transition-none md:block",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <Sidebar
          role={role}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </aside>

      {/* Sidebar mobile: tetap seperti sebelumnya, tanpa mode ciut */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r bg-card shadow-lg">
            <Sidebar role={role} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Tinggi h-16 disamakan dengan header logo di sidebar agar garisnya sejajar */}
        <header className="flex h-16 items-center justify-between gap-3 border-b bg-card px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{session.user.fullName}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
            <Badge variant="secondary">{ROLE_LABEL[role]}</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut /> Keluar
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}