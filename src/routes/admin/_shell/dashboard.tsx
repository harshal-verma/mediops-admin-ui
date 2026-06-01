import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, UserRound, IndianRupee, HardDrive, Plus, Package as PackageIcon, ArrowUpRight, Activity } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from "recharts";
import { auditLogs, revenueTrend } from "@/data/dummy";
import { StatusBadge } from "@/components/admin/Badges";

export const Route = createFileRoute("/admin/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MediOps Super Admin" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Operations overview</h1>
          <p className="text-sm text-muted-foreground">Monday, June 1, 2026 · All systems healthy</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/hospitals/create" className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-95">
            <Plus className="size-4" /> Add Hospital
          </Link>
          <Link to="/admin/packages/create" className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-card text-sm font-semibold hover:bg-muted">
            <PackageIcon className="size-4" /> Create Package
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Hospitals" value="25" delta="+3 this month" icon={<Building2 className="size-5" />}
          breakdown={[{ k: "Active", v: 18, tone: "bg-success" }, { k: "Trial", v: 5, tone: "bg-info" }, { k: "Expired", v: 2, tone: "bg-warning" }]} />
        <StatCard label="Doctors / Patients" value="320" delta="85,000 patients" icon={<UserRound className="size-5" />} />
        <StatCard label="Monthly Revenue" value="₹1,45,000" delta="+12.4% vs May" icon={<IndianRupee className="size-5" />} />
        <StatCard label="Storage Used" value="340 GB" delta="of 1 TB pool" icon={<HardDrive className="size-5" />} progress={34} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg">Revenue trend</h2>
              <p className="text-xs text-muted-foreground">Monthly recurring revenue (₹ thousands)</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 text-success-foreground text-xs font-semibold px-2.5 py-1">
              <ArrowUpRight className="size-3" /> +57% YoY
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.16 160)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.72 0.16 160)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="oklch(0.5 0.03 255)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.55 0.15 160)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg flex items-center gap-2"><Activity className="size-4" /> Recent activity</h2>
            <Link to="/admin/audit-logs" className="text-xs font-semibold text-accent-foreground hover:underline">View all</Link>
          </div>
          <ul className="space-y-4">
            {auditLogs.slice(0, 5).map((log) => (
              <li key={log.id} className="flex items-start gap-3">
                <span className={`mt-1.5 size-2 rounded-full shrink-0 ${
                  log.type === "create" ? "bg-success" :
                  log.type === "update" ? "bg-info" :
                  log.type === "suspend" || log.type === "delete" ? "bg-destructive" : "bg-muted-foreground"
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{log.action} <span className="text-muted-foreground font-normal">· {log.target}</span></div>
                  <div className="text-[11px] text-muted-foreground">{log.user} · {log.timestamp}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display font-bold text-lg mb-4">Hospital health snapshot</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: "Greenfield Multispeciality", plan: "ENTERPRISE", status: "Active" as const, dr: 48 },
            { name: "Riverline Hospital", plan: "PREMIUM", status: "Expired" as const, dr: 14 },
            { name: "Cura Family Health", plan: "BASIC", status: "Suspended" as const, dr: 3 },
          ].map((h) => (
            <div key={h.name} className="rounded-xl border border-border p-4 hover-lift">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{h.name}</div>
                <StatusBadge status={h.status} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{h.plan} · {h.dr} doctors</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, icon, breakdown, progress }: {
  label: string; value: string; delta: string; icon: React.ReactNode;
  breakdown?: { k: string; v: number; tone: string }[]; progress?: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card hover-lift">
      <div className="flex items-start justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="size-9 rounded-lg bg-accent/15 text-accent-foreground grid place-items-center">{icon}</div>
      </div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{delta}</div>
      {breakdown && (
        <div className="flex gap-3 mt-3 text-[11px] text-muted-foreground">
          {breakdown.map((b) => (
            <span key={b.k} className="inline-flex items-center gap-1">
              <span className={`size-2 rounded-full ${b.tone}`} /> {b.k} {b.v}
            </span>
          ))}
        </div>
      )}
      {progress !== undefined && (
        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
