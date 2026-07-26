import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, Loader2, LogOut, Menu, Search, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { api, formatINR, type SearchResults } from "@/lib/api";
import { toast } from "sonner";

const titles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/hospitals": "Hospitals",
  "/admin/hospitals/create": "Create Hospital",
  "/admin/packages": "Packages",
  "/admin/packages/create": "Create Package",
  "/admin/users": "Users",
  "/admin/audit-logs": "Audit Logs",
};

export function AdminHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [_, setNotif] = useState(3);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults["results"] | null>(null);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const initials = (user?.email ?? "SA")
    .split(/[@.]/)[0]
    .slice(0, 2)
    .toUpperCase();

  // Debounced search — 300ms after the last keystroke, min 2 chars.
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const t = setTimeout(() => {
      api.search
        .query(q)
        .then((res) => {
          if (cancelled) return;
          setSearchResults(res.results);
          setOpen(true);
        })
        .catch(() => {
          // Search failures are silent by design.
          if (!cancelled) setSearchResults(null);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [searchQuery]);

  // Close on click outside / Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        searchInputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function closeSearch() {
    setOpen(false);
    setSearchQuery("");
    setSearchResults(null);
  }

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

  const hasResults =
    !!searchResults &&
    searchResults.hospitals.length + searchResults.packages.length + searchResults.users.length > 0;

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
        <div ref={searchBoxRef} className="hidden md:block relative">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 w-72">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults && setOpen(true)}
              placeholder="Search hospitals, users..."
              className="bg-transparent outline-none text-sm w-full"
            />
            {searching && <Loader2 className="size-4 animate-spin text-muted-foreground shrink-0" />}
          </div>

          {open && searchResults && (
            <div className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-y-auto rounded-xl border border-border bg-card shadow-card p-2 z-50">
              {!hasResults ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No results for “{searchQuery.trim()}”
                </div>
              ) : (
                <>
                  {searchResults.hospitals.length > 0 && (
                    <div className="mb-1">
                      <SearchGroupLabel>Hospitals</SearchGroupLabel>
                      {searchResults.hospitals.map((h) => (
                        <Link
                          key={h.id}
                          to="/admin/hospitals/$id"
                          params={{ id: String(h.id) }}
                          onClick={closeSearch}
                          className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                        >
                          <span className="truncate font-medium">{h.name}</span>
                          <span
                            className={`shrink-0 text-[10px] font-bold ${
                              h.isActive ? "text-success" : "text-muted-foreground"
                            }`}
                          >
                            {h.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.packages.length > 0 && (
                    <div className="mb-1">
                      <SearchGroupLabel>Packages</SearchGroupLabel>
                      {searchResults.packages.map((p) => (
                        <Link
                          key={p.id}
                          to="/admin/packages"
                          onClick={closeSearch}
                          className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                        >
                          <span className="truncate font-medium">{p.name}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatINR(p.monthlyPrice)}/mo
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.users.length > 0 && (
                    <div>
                      <SearchGroupLabel>Users</SearchGroupLabel>
                      {searchResults.users.map((u) => (
                        <div key={u.id} className="rounded-lg px-3 py-2 hover:bg-muted">
                          <div className="text-sm font-medium truncate">{u.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
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
              {initials}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-sm font-medium">{user?.role?.replace(/_/g, " ") ?? "Super Admin"}</div>
              <div className="text-[11px] text-muted-foreground">{user?.email ?? "—"}</div>
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Signed in as {user?.email ?? "Admin"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="size-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function SearchGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  );
}
