import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, RefreshCw, Ban, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import { hospitals, packages, subscriptionHistory, auditLogs } from "@/data/dummy";
import { PlanBadge, StatusBadge } from "@/components/admin/Badges";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/_shell/hospitals/$id")({
  head: () => ({ meta: [{ title: "Hospital detail — MediOps" }] }),
  loader: ({ params }) => {
    const h = hospitals.find((x) => x.id === params.id);
    if (!h) throw notFound();
    return { hospital: h };
  },
  notFoundComponent: () => (
    <div className="text-center py-20">
      <div className="font-display text-xl font-bold">Hospital not found</div>
      <Link to="/admin/hospitals" className="text-sm text-accent-foreground font-semibold mt-2 inline-block">Back to list</Link>
    </div>
  ),
  component: HospitalDetail,
});

const tabs = ["Overview", "Users", "Subscription History", "Audit Logs"] as const;

function HospitalDetail() {
  const { hospital } = Route.useLoaderData();
  const pkg = packages.find((p) => p.tier === hospital.plan)!;
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");

  return (
    <div className="space-y-6">
      <Link to="/admin/hospitals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to hospitals
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-display font-bold text-xl">
            {hospital.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{hospital.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <PlanBadge plan={hospital.plan} />
              <StatusBadge status={hospital.status} />
              <span className="text-xs text-muted-foreground">Joined {hospital.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.info("Change package modal")}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
            <RefreshCw className="size-4" /> Change Package
          </button>
          <button onClick={() => toast.warning("Hospital suspended")}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/10">
            <Ban className="size-4" /> Suspend
          </button>
          <button onClick={() => toast.success("Reset link emailed")}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border text-sm font-semibold hover:bg-muted">
            <KeyRound className="size-4" /> Reset Admin Password
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
          <h2 className="font-display font-bold">Information</h2>
          <InfoRow icon={<MapPin className="size-4" />} label="Address" value={`${hospital.address}, ${hospital.city}, ${hospital.state}`} />
          <InfoRow icon={<User className="size-4" />} label="Contact" value={hospital.contactPerson} />
          <InfoRow icon={<Phone className="size-4" />} label="Phone" value={hospital.phone} />
          <InfoRow icon={<Mail className="size-4" />} label="Email" value={hospital.email} />
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Current package · {pkg.tier}</h2>
            <span className="text-sm font-bold">₹{pkg.monthly.toLocaleString("en-IN")}/mo</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Usage label="Doctors" used={hospital.doctors} max={pkg.maxDoctors} suffix="" />
            <Usage label="Storage" used={hospital.storageGb} max={pkg.maxStorageGb} suffix="GB" />
            <Usage label="Branches" used={hospital.branches} max={pkg.maxBranches} suffix="" />
          </div>
          <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-2">
            {pkg.features.map((f) => (
              <div key={f.name} className={`text-xs flex items-center gap-2 ${f.enabled ? "" : "opacity-40 line-through"}`}>
                <span className={`size-1.5 rounded-full ${f.enabled ? "bg-success" : "bg-muted-foreground"}`} /> {f.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border flex overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors ${
                tab === t ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === "Overview" && (
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { k: "Patients on record", v: hospital.patients.toLocaleString("en-IN") },
                { k: "Active doctors", v: hospital.doctors },
                { k: "Active branches", v: hospital.branches },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border border-border p-4">
                  <div className="text-xs text-muted-foreground">{s.k}</div>
                  <div className="font-display text-2xl font-bold mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "Users" && (
            <div className="text-sm text-muted-foreground">
              Manage hospital users from the <Link to="/admin/users" className="text-accent-foreground font-semibold">Users</Link> page.
            </div>
          )}
          {tab === "Subscription History" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr><th className="text-left py-2">Date</th><th className="text-left py-2">Action</th><th className="text-left py-2">From → To</th><th className="text-right py-2">Amount</th><th className="text-left py-2 pl-4">By</th></tr>
                </thead>
                <tbody>
                  {subscriptionHistory.map((s) => (
                    <tr key={s.id} className="border-t border-border">
                      <td className="py-3">{s.date}</td>
                      <td className="py-3 font-medium">{s.action}</td>
                      <td className="py-3 text-muted-foreground">{s.from} → {s.to}</td>
                      <td className="py-3 text-right font-semibold">{s.amount ? `₹${s.amount.toLocaleString("en-IN")}` : "—"}</td>
                      <td className="py-3 pl-4 text-muted-foreground">{s.by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "Audit Logs" && (
            <ul className="space-y-3">
              {auditLogs.slice(0, 6).map((l) => (
                <li key={l.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 size-2 rounded-full bg-info shrink-0" />
                  <div><span className="font-medium">{l.action}</span> · {l.target} <div className="text-[11px] text-muted-foreground">{l.user} · {l.timestamp}</div></div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

function Usage({ label, used, max, suffix }: { label: string; used: number; max: number; suffix: string }) {
  const pct = Math.min(100, Math.round((used / max) * 100));
  const tone = pct > 85 ? "bg-destructive" : pct > 65 ? "bg-warning" : "bg-success";
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
        <div className="text-xs font-mono">{used}{suffix} / {max}{suffix}</div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
