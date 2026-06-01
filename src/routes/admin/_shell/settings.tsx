import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/admin/_shell/settings")({
  head: () => ({ meta: [{ title: "Settings — MediOps" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center shadow-card">
      <div className="mx-auto size-14 rounded-2xl bg-muted grid place-items-center text-muted-foreground">
        <SettingsIcon className="size-7" />
      </div>
      <h1 className="font-display text-2xl font-bold mt-4">Settings coming soon</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
        Platform-wide preferences, billing config, integrations, and notification rules will live here.
      </p>
    </div>
  );
}
