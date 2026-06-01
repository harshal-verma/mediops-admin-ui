import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { packages } from "@/data/dummy";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/_shell/hospitals/create")({
  head: () => ({ meta: [{ title: "Create Hospital — MediOps" }] }),
  component: CreateHospital,
});

const steps = ["Hospital info", "Assign package", "Admin account"];

function CreateHospital() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", address: "", city: "", state: "", phone: "", email: "",
    packageId: "p3",
    contactPerson: "", adminEmail: "", autoPassword: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.name) e.name = "Hospital name required";
      if (!form.city) e.city = "City required";
      if (!form.phone) e.phone = "Phone required";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    }
    if (step === 2) {
      if (!form.contactPerson) e.contactPerson = "Contact person required";
      if (!/^\S+@\S+\.\S+$/.test(form.adminEmail)) e.adminEmail = "Valid admin email required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validate()) setStep((s) => Math.min(2, s + 1)); }
  function submit() {
    if (!validate()) return;
    toast.success(`${form.name} created successfully`);
    setTimeout(() => navigate({ to: "/admin/hospitals" }), 600);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/admin/hospitals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to hospitals
        </Link>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold">Onboard a new hospital</h1>
        <p className="text-sm text-muted-foreground">Provision a tenant in three quick steps.</p>
      </div>

      <ol className="flex items-center gap-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3 flex-1">
            <div className={`size-8 rounded-full grid place-items-center text-xs font-bold ${
              i < step ? "bg-success text-success-foreground" :
              i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <Check className="size-4" /> : i + 1}
            </div>
            <div className={`text-sm font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</div>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-success" : "bg-border"}`} />}
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        {step === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Hospital name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} />
            <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
            <Input label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} error={errors.city} />
            <Input label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
            <Input className="md:col-span-2" label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((p) => {
              const active = form.packageId === p.id;
              return (
                <button key={p.id} type="button" onClick={() => setForm({ ...form, packageId: p.id })}
                  className={`text-left rounded-xl border-2 p-4 transition-all ${active ? "border-accent bg-accent/5 shadow-lift" : "border-border hover:border-accent/40"}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-display font-bold">{p.tier}</div>
                    {p.popular && <span className="text-[10px] font-bold rounded-full bg-accent text-accent-foreground px-2 py-0.5">POPULAR</span>}
                  </div>
                  <div className="mt-2 font-display text-2xl font-bold">₹{p.monthly.toLocaleString("en-IN")}<span className="text-xs text-muted-foreground font-medium">/mo</span></div>
                  <ul className="mt-3 space-y-1.5 text-xs">
                    {p.features.filter(f => f.enabled).slice(0, 5).map((f) => (
                      <li key={f.name} className="flex items-center gap-1.5"><Check className="size-3.5 text-success" /> {f.name}</li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground">
                    Up to {p.maxDoctors} doctors · {p.maxStorageGb}GB · {p.maxBranches} branches
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Contact person" value={form.contactPerson} onChange={(v) => setForm({ ...form, contactPerson: v })} error={errors.contactPerson} />
            <Input label="Admin email" value={form.adminEmail} onChange={(v) => setForm({ ...form, adminEmail: v })} error={errors.adminEmail} />
            <label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-border p-4 cursor-pointer">
              <input type="checkbox" checked={form.autoPassword} onChange={(e) => setForm({ ...form, autoPassword: e.target.checked })}
                className="size-4 accent-[oklch(0.55_0.15_160)]" />
              <div>
                <div className="text-sm font-semibold">Auto-generate secure password</div>
                <div className="text-xs text-muted-foreground">A reset link will be emailed to the admin on creation.</div>
              </div>
            </label>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border text-sm font-semibold disabled:opacity-40 hover:bg-muted">
            <ArrowLeft className="size-4" /> Back
          </button>
          {step < 2 ? (
            <button onClick={next} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-95">
              Next <ArrowRight className="size-4" />
            </button>
          ) : (
            <button onClick={submit} className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-accent text-accent-foreground text-sm font-bold hover:opacity-95">
              <Check className="size-4" /> Create Hospital
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, error, className = "" }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="text-xs font-semibold mb-1.5">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full h-10 rounded-lg border bg-background px-3 text-sm outline-none transition-colors ${error ? "border-destructive" : "border-input focus:border-accent"}`} />
      {error && <div className="text-[11px] text-destructive mt-1">{error}</div>}
    </label>
  );
}
