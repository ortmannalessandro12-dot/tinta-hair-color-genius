import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useSubscription } from "@/hooks/useSubscription";

export const Route = createFileRoute("/_authenticated/clients")({
  component: ClientsGate,
});

function ClientsGate() {
  const { loading, hasAccess } = useSubscription();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!hasAccess) return <Navigate to="/subscribe" />;
  return <Outlet />;
}
