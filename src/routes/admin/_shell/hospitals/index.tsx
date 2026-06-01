import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Ban } from "lucide-react";
import { hospitals, type HospitalStatus, type PackageTier } from "@/data/dummy";
import { PlanBadge, StatusBadge } from "@/components/admin/Badges";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/_shell/hospitals/")({
  head: () => ({ meta: [{ title: "Hospitals — MediOps" }] }),
  component: HospitalsList,
});

function HospitalsList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | HospitalStatus>("All");
  const [plan, setPlan] = useState<"All" | PackageTier>("All");

  const filtered = useMemo(() => hospitals.filter((h) =>
    (status === "All" || h.status === status) &&
    (plan === "All" || h.plan === plan) &&
    (q === "" || h.name.toLowerCase().includes(q.toLowerCase()) || h.city.toLowerCase().includes(q.toLowerCase()))
  ), [q, status, plan]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Hospitals</h1>
          <p className="text-sm text-muted-foreground">{hospitals.length} tenants on the platform</p>
        </div>
        <Link to="/admin/hospitals/create" className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-95">
          <Plus className="size-4" /> Create Hospital
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="p-4 flex flex-wrap gap-3 border-b border-border">
          <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 h-10 flex-1 min-w-[220px]">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by hospital name or city…"
              className="bg-transparent outline-none text-sm w-full" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
            <option>All</option><option>Active</option><option>Trial</option><option>Expired</option><option>Suspended</option>
          </select>
          <select value={plan} onChange={(e) => setPlan(e.target.value as any)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
            <option>All</option><option>FREE</option><option>BASIC</option><option>PREMIUM</option><option>ENTERPRISE</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Hospital</th>
                <th className="text-left font-semibold px-5 py-3">Plan</th>
                <th className="text-left font-semibold px-5 py-3">Status</th>
                <th className="text-left font-semibold px-5 py-3">Doctors</th>
                <th className="text-left font-semibold px-5 py-3">Created</th>
                <th className="text-right font-semibold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-3">
                    <Link to="/admin/hospitals/$id" params={{ id: h.id }} className="font-semibold hover:text-accent-foreground">{h.name}</Link>
                    <div className="text-xs text-muted-foreground">{h.city}, {h.state}</div>
                  </td>
                  <td className="px-5 py-3"><PlanBadge plan={h.plan} /></td>
                  <td className="px-5 py-3"><StatusBadge status={h.status} /></td>
                  <td className="px-5 py-3 font-medium">{h.doctors}</td>
                  <td className="px-5 py-3 text-muted-foreground">{h.createdAt}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Link to="/admin/hospitals/$id" params={{ id: h.id }}
                        className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md hover:bg-muted text-xs font-medium">
                        <Eye className="size-3.5" /> View
                      </Link>
                      <button onClick={() => toast.info(`Edit ${h.name}`)}
                        className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md hover:bg-muted text-xs font-medium">
                        <Pencil className="size-3.5" /> Edit
                      </button>
                      <button onClick={() => toast.warning(`${h.name} suspended`)}
                        className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md hover:bg-destructive/10 text-destructive text-xs font-medium">
                        <Ban className="size-3.5" /> Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-16 text-center">
                  <div className="text-sm font-semibold">No hospitals match your filters</div>
                  <div className="text-xs text-muted-foreground mt-1">Try clearing the search or status filter.</div>
                  <button onClick={() => { setQ(""); setStatus("All"); setPlan("All"); }}
                    className="mt-3 inline-flex items-center gap-2 h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                    Reset filters
                  </button>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
