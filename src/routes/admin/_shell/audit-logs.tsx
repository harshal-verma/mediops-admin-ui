import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, Filter } from "lucide-react";
import { auditLogs, type AuditAction } from "@/data/dummy";

export const Route = createFileRoute("/admin/_shell/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — MediOps" }] }),
  component: AuditLogsPage,
});

const typeColors: Record<AuditAction, string> = {
  create: "bg-success/15 text-success-foreground ring-success/30",
  update: "bg-info/15 text-info-foreground ring-info/30",
  delete: "bg-destructive/15 text-destructive ring-destructive/30",
  suspend: "bg-destructive/15 text-destructive ring-destructive/30",
  login: "bg-muted text-muted-foreground ring-border",
};

function AuditLogsPage() {
  const [type, setType] = useState<"all" | AuditAction>("all");
  const [user, setUser] = useState("all");
  const userList = Array.from(new Set(auditLogs.map((l) => l.user)));

  const filtered = useMemo(
    () => auditLogs.filter((l) => (type === "all" || l.type === type) && (user === "all" || l.user === user)),
    [type, user]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Audit logs</h1>
        <p className="text-sm text-muted-foreground">Every privileged action across the platform.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-card flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 h-10">
          <Calendar className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Last 30 days</span>
        </div>
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="all">All actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="suspend">Suspend</option>
          <option value="delete">Delete</option>
          <option value="login">Login</option>
        </select>
        <select value={user} onChange={(e) => setUser(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="all">All users</option>
          {userList.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground"><Filter className="size-3" /> {filtered.length} entries</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display font-bold mb-4">Timeline</h2>
          <ol className="relative border-l-2 border-border pl-5 space-y-5">
            {filtered.slice(0, 8).map((l) => (
              <li key={l.id} className="relative">
                <span className={`absolute -left-[27px] top-1 size-3 rounded-full ring-4 ring-background ${
                  l.type === "create" ? "bg-success" :
                  l.type === "update" ? "bg-info" :
                  l.type === "suspend" || l.type === "delete" ? "bg-destructive" : "bg-muted-foreground"
                }`} />
                <div className="text-sm font-semibold">{l.action}</div>
                <div className="text-xs text-muted-foreground">{l.target}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{l.user} · {l.timestamp}</div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Timestamp</th>
                  <th className="text-left font-semibold px-5 py-3">User</th>
                  <th className="text-left font-semibold px-5 py-3">Action</th>
                  <th className="text-left font-semibold px-5 py-3">Target</th>
                  <th className="text-left font-semibold px-5 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap font-mono text-xs">{l.timestamp}</td>
                    <td className="px-5 py-3 font-medium">{l.user}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${typeColors[l.type]}`}>
                        {l.action}
                      </span>
                    </td>
                    <td className="px-5 py-3">{l.target}</td>
                    <td className="px-5 py-3 text-muted-foreground">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
