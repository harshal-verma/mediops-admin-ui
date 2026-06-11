import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Menu, Search, User } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const titles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/hospitals": "Hospitals",
  "/admin/hospitals/create": "Create Hospital",
  "/admin/packages": "Packages",
  "/admin/packages/create": "Create Package",
  "/admin/users": "Users",
  "/admin/audit-logs": "Audit Logs",
  "/admin/settings": "Settings",
};

export function AdminHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [_, setNotif] = useState(3);

  const initials = (user?.email ?? "SA")
    .split(/[@.]/)[0]
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    await logout();
    toast.success("Signed out");
    navigate({ to: "/admin/login" });
  }

  const crumbs = (() => {
    const parts = pathname.split("/").filter(Boolean); // ["admin", ...]
    const out: { label: string; to: string }[] = [{ label: "Admin", to: "/admin/dashboard" }];
    let acc = "";
    parts.forEach((p, i) => {
      if (i === 0) return;
      acc += "/" + p;
      const full = "/admin" + acc;
      const label = titles[full] || decodeURIComponent(p).replace(/-/g, " ");
      out.push({ label: label.replace(/^./, (c) => c.toUpperCase()), to: full });
    });
    return out;
  })();

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/85 backdrop-blur border-b border-border flex items-center gap-3 px-4 lg:px-8">
      <button
        onClick={onOpenSidebar}
        className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <nav className="hidden md:flex items-center text-sm text-muted-foreground">
        {crumbs.map((c, i) => (
          <span key={c.to} className="flex items-center">
            {i > 0 && <span className="mx-2 opacity-50">/</span>}
            {i === crumbs.length - 1 ? (
              <span className="text-foreground font-medium">{c.label}</span>
            ) : (
              <Link to={c.to} className="hover:text-foreground transition-colors">
                {c.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 w-72">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Search hospitals, users..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
        <button
          onClick={() => setNotif(0)}
          className="relative p-2 rounded-lg hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg hover:bg-muted pl-1 pr-2 py-1">
            <div className="size-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">
              SA
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-sm font-medium">Super Admin</div>
              <div className="text-[11px] text-muted-foreground">admin@medi.io</div>
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Signed in as Super Admin</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: "/admin/login" })}>
              <LogOut className="size-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
