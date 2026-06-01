import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/_shell")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  component: () => (
    <AdminShell>
      <Outlet />
    </AdminShell>
  ),
});
