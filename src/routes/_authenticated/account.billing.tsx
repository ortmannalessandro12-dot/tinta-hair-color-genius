import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { useSubscription } from "@/hooks/useSubscription";
import { createPortalSession } from "@/lib/billing.functions";
import { formatDateDE } from "@/lib/tinta";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/account/billing")({
  component: BillingPage,
});

const STATUS_LABEL: Record<string, string> = {
  trialing: "Testphase",
  active: "Aktiv",
  past_due: "Zahlung überfällig",
  canceled: "Gekündigt",
};

function BillingPage() {
  const { subscription, loading, inTrial, isActive, trialDaysLeft, hasAccess } = useSubscription();
  const openPortal = useServerFn(createPortalSession);
  const [submitting, setSubmitting] = React.useState(false);

  async function onPortal() {
    setSubmitting(true);
    try {
      const res = await openPortal();
      if (res?.url) window.location.href = res.url;
      else throw new Error("Keine Portal-URL erhalten.");
    } catch (e) {
      console.error("[portal]", e);
      toast.error("Kundenportal konnte nicht geöffnet werden.");
      setSubmitting(false);
    }
  }

  return (
    <AppShell back={{ to: "/clients" }} title="Abonnement">
      <div className="max-w-md mx-auto space-y-5">
        {loading ? (
          <div className="card-soft p-6 h-40 animate-pulse" />
        ) : (
          <>
            <div className="card-soft p-6" style={{ background: "var(--gradient-card)" }}>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Status
              </div>
              <div className="font-serif text-2xl mb-3">
                {STATUS_LABEL[subscription?.status ?? ""] ?? "Kein Abo"}
              </div>
              {inTrial && (
                <p className="text-sm text-muted-foreground">
                  Deine Testphase endet in{" "}
                  <strong>
                    {trialDaysLeft} {trialDaysLeft === 1 ? "Tag" : "Tagen"}
                  </strong>
                  {subscription?.trial_ends_at && (
                    <> ({formatDateDE(subscription.trial_ends_at)})</>
                  )}
                  .
                </p>
              )}
              {isActive && subscription?.current_period_end && (
                <p className="text-sm text-muted-foreground">
                  Nächste Abrechnung am{" "}
                  <strong>{formatDateDE(subscription.current_period_end)}</strong>.
                </p>
              )}
              {subscription?.status === "past_due" && (
                <p className="text-sm text-destructive">
                  Letzte Zahlung fehlgeschlagen. Bitte aktualisiere deine Zahlungsmethode.
                </p>
              )}
              {subscription?.status === "canceled" && (
                <p className="text-sm text-muted-foreground">
                  Dein Abo ist gekündigt. Du kannst es jederzeit neu starten.
                </p>
              )}
            </div>

            {subscription?.stripe_customer_id ? (
              <button
                onClick={onPortal}
                disabled={submitting}
                className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? "Wird geöffnet …" : "Zahlung & Kündigung verwalten"}
              </button>
            ) : (
              <Link
                to="/subscribe"
                className="w-full h-12 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
              >
                Abo abschließen
              </Link>
            )}

            {hasAccess && (
              <Link
                to="/clients"
                className="block text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Zurück zu deinen Kundinnen
              </Link>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
