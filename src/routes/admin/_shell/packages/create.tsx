import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/_shell/packages/create")({
  head: () => ({ meta: [{ title: "Create Package — MediOps" }] }),
  component: CreatePackage,
});

const FEATURES = [
  "Patient Management", "Appointments", "Prescription", "Billing", "Lab Reports", "Pharmacy", "Patient Portal",
] as const;

function CreatePackage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "GROWTH",
    monthly: 4999,
    yearly: 49990,
    maxDoctors: 15,
    maxStorageGb: 50,
    maxBranches: 3,
    features: { "Patient Management": true, "Appointments": true, "Prescription": true, "Billing": true, "Lab Reports": false, "Pharmacy": false, "Patient Portal": false } as Record<string, boolean>,
  });

  function toggle(f: string) { setForm({ ...form, features: { ...form.features, [f]: !form.features[f] } }); }

  function submit() {
    if (!form.name.trim()) { toast.error("Package name is required"); return; }
    toast.success(`${form.name} package created`);
    setTimeout(() => navigate({ to: "/admin/packages" }), 600);
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/packages" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to packages
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold">Create a new package</h1>
        <p className="text-sm text-muted-foreground">Define pricing, limits, and feature access. Live preview on the right.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Package name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })} className="input" /></Field>
            <Field label="Monthly (₹)"><input type="number" value={form.monthly} onChange={(e) => setForm({ ...form, monthly: +e.target.value })} className="input" /></Field>
            <Field label="Yearly (₹)"><input type="number" value={form.yearly} onChange={(e) => setForm({ ...form, yearly: +e.target.value })} className="input" /></Field>
          </div>

          <div>
            <div className="text-sm font-bold mb-3">Features</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {FEATURES.map((f) => (
                <button key={f} type="button" onClick={() => toggle(f)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-sm transition-colors ${form.features[f] ? "border-accent bg-accent/5" : "border-border hover:bg-muted/50"}`}>
                  <span className="font-medium">{f}</span>
                  <span className={`relative h-5 w-9 rounded-full transition-colors ${form.features[f] ? "bg-accent" : "bg-muted"}`}>
                    <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${form.features[f] ? "left-[18px]" : "left-0.5"}`} />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold mb-3">Limits</div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Max doctors"><input type="number" value={form.maxDoctors} onChange={(e) => setForm({ ...form, maxDoctors: +e.target.value })} className="input" /></Field>
              <Field label="Max storage (GB)"><input type="number" value={form.maxStorageGb} onChange={(e) => setForm({ ...form, maxStorageGb: +e.target.value })} className="input" /></Field>
              <Field label="Max branches"><input type="number" value={form.maxBranches} onChange={(e) => setForm({ ...form, maxBranches: +e.target.value })} className="input" /></Field>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Link to="/admin/packages" className="h-10 px-4 inline-flex items-center rounded-lg border border-border text-sm font-semibold hover:bg-muted">Cancel</Link>
            <button onClick={submit} className="h-10 px-5 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-95">
              <Check className="size-4" /> Save Package
            </button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 self-start">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Live preview</div>
          <div className="rounded-2xl border-2 border-accent/40 bg-card p-6 shadow-lift">
            <div className="font-display text-xs font-bold tracking-widest text-muted-foreground">{form.name || "PACKAGE"}</div>
            <div className="mt-2 font-display text-4xl font-bold">₹{form.monthly.toLocaleString("en-IN")}<span className="text-sm font-medium text-muted-foreground">/mo</span></div>
            <div className="text-xs text-muted-foreground">or ₹{form.yearly.toLocaleString("en-IN")}/yr</div>
            <div className="mt-4 space-y-1.5">
              {FEATURES.map((f) => (
                <div key={f} className={`text-sm flex items-center gap-2 ${form.features[f] ? "" : "opacity-40 line-through"}`}>
                  <Check className={`size-3.5 ${form.features[f] ? "text-success" : "text-muted-foreground"}`} /> {f}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 text-center">
              <div><div className="font-display font-bold">{form.maxDoctors}</div><div className="text-[10px] uppercase text-muted-foreground">Doctors</div></div>
              <div><div className="font-display font-bold">{form.maxStorageGb}GB</div><div className="text-[10px] uppercase text-muted-foreground">Storage</div></div>
              <div><div className="font-display font-bold">{form.maxBranches}</div><div className="text-[10px] uppercase text-muted-foreground">Branches</div></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`.input { width:100%; height:40px; border-radius:8px; border:1px solid var(--input); background:var(--background); padding:0 12px; font-size:14px; outline:none; }
      .input:focus { border-color: var(--accent); }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="text-xs font-semibold mb-1.5">{label}</div>{children}</label>;
}
