import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Plus, Pencil } from "lucide-react";
import { packages } from "@/data/dummy";

export const Route = createFileRoute("/admin/_shell/packages/")({
  head: () => ({ meta: [{ title: "Packages — MediOps" }] }),
  component: PackagesList,
});

function PackagesList() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Subscription packages</h1>
          <p className="text-sm text-muted-foreground">Configure pricing tiers, features, and limits.</p>
        </div>
        <Link to="/admin/packages/create" className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-95">
          <Plus className="size-4" /> Create Package
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {packages.map((p) => (
          <div key={p.id} className={`relative rounded-2xl border bg-card p-6 shadow-card hover-lift ${p.popular ? "border-accent ring-2 ring-accent/20" : "border-border"}`}>
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider rounded-full bg-accent text-accent-foreground px-3 py-1">
                MOST POPULAR
              </div>
            )}
            <div className="font-display text-xs font-bold tracking-widest text-muted-foreground">{p.tier}</div>
            <div className="mt-3 font-display text-4xl font-bold">
              ₹{p.monthly.toLocaleString("en-IN")}
              <span className="text-sm font-medium text-muted-foreground">/mo</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">or ₹{p.yearly.toLocaleString("en-IN")}/yr</div>

            <div className="mt-5 space-y-2">
              {p.features.map((f) => (
                <div key={f.name} className={`text-sm flex items-center gap-2 ${f.enabled ? "" : "opacity-40"}`}>
                  <span className={`size-4 rounded-full grid place-items-center ${f.enabled ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                    {f.enabled ? <Check className="size-3" /> : <span className="size-1 rounded-full bg-current" />}
                  </span>
                  {f.name}
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-border grid grid-cols-3 gap-2 text-center">
              <Limit label="Doctors" v={p.maxDoctors} />
              <Limit label="Storage" v={`${p.maxStorageGb}GB`} />
              <Limit label="Branches" v={p.maxBranches} />
            </div>

            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{p.activeHospitals} active hospitals</span>
              <button className="inline-flex items-center gap-1 font-semibold text-accent-foreground hover:underline">
                <Pencil className="size-3" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Limit({ label, v }: { label: string; v: React.ReactNode }) {
  return (
    <div>
      <div className="font-display font-bold text-sm">{v}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
