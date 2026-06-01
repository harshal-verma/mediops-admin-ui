import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Ban, KeyRound, ShieldCheck } from "lucide-react";
import { users } from "@/data/dummy";
import { StatusBadge } from "@/components/admin/Badges";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/_shell/users")({
  head: () => ({ meta: [{ title: "Users — MediOps" }] }),
  component: UsersPage,
});

const tabs = ["Hospital Admins", "Support Staff", "Super Admins"] as const;

function UsersPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Hospital Admins");
  const roleMap = { "Hospital Admins": "Hospital Admin", "Support Staff": "Support Staff", "Super Admins": "Super Admin" } as const;
  const filtered = users.filter((u) => u.role === roleMap[tab]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">Manage all platform accounts across tenants.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors ${
                tab === t ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t} <span className="ml-1 text-xs text-muted-foreground">({users.filter(u => u.role === roleMap[t]).length})</span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Name</th>
                <th className="text-left font-semibold px-5 py-3">Email</th>
                <th className="text-left font-semibold px-5 py-3">Hospital</th>
                <th className="text-left font-semibold px-5 py-3">Status</th>
                <th className="text-left font-semibold px-5 py-3">Last login</th>
                <th className="text-right font-semibold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-accent/15 text-accent-foreground grid place-items-center text-xs font-bold">
                        {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        {u.twoFA && <div className="text-[10px] text-success font-semibold inline-flex items-center gap-1"><ShieldCheck className="size-3" /> 2FA enabled</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3">{u.hospital}</td>
                  <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{u.lastLogin}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => toast.warning(`${u.name} disabled`)} className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md hover:bg-destructive/10 text-destructive text-xs font-medium">
                        <Ban className="size-3.5" /> Disable
                      </button>
                      <button onClick={() => toast.success("Reset email sent")} className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md hover:bg-muted text-xs font-medium">
                        <KeyRound className="size-3.5" /> Reset
                      </button>
                      <button onClick={() => toast.success("2FA enrollment sent")} className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md hover:bg-muted text-xs font-medium">
                        <ShieldCheck className="size-3.5" /> 2FA
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
