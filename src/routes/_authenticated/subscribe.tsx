import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { useSubscription } from "@/hooks/useSubscription";
import { createCheckoutSession, createPortalSession } from "@/lib/billing.functions";
import { formatDateDE } from "@/lib/tinta";
import { toast } from "sonner";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/subscribe")({
  component: SubscribePage,
});

function SubscribePage() {
  const { subscription, status, inTrial, isPro, trialDaysLeft, loading, refetch } =
    useSubscription();
  const isActive = isPro;
  const startCheckout = useServerFn(createCheckoutSession);
  const openPortal = useServerFn(createPortalSession);
  const [submitting, setSubmitting] = React.useState(false);
  const [portalLoading, setPortalLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);


  async function onSubscribe() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await startCheckout();
      if ("error" in res && res.error === "already_subscribed") {
        toast.info("Du hast bereits ein aktives Abo.");
        await refetch();
        setSubmitting(false);
        return;
      }
      if ("url" in res && res.url) {
        window.location.href = res.url;
        return;
      }
      throw new Error("Keine Checkout-URL erhalten.");
    } catch (e) {
      console.error("[checkout]", e);
      setError("Der Checkout konnte nicht gestartet werden. Bitte versuche es erneut.");
      toast.error("Checkout konnte nicht gestartet werden.");
      setSubmitting(false);
    }
  }


  async function onPortal() {
    setPortalLoading(true);
    try {
      const res = await openPortal();
      if (res?.url) window.location.href = res.url;
      else throw new Error("Keine Portal-URL erhalten.");
    } catch (e) {
      console.error("[portal]", e);
      toast.error("Kundenportal konnte nicht geöffnet werden.");
      setPortalLoading(false);
    }
  }

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("checkout") === "cancel") {
      toast.info("Checkout abgebrochen. Du kannst jederzeit erneut starten.");
      window.history.replaceState({}, "", "/subscribe");
    }
  }, []);

  const features = [
    "Farbrezepte unbegrenzt verwalten",
    "Für das ganze Salon-Team",
    "Foto vom Ergebnis pro Rezeptur",
    "Sichere Cloud-Synchronisation",
    "Jederzeit kündbar",
  ];

  // Bereits aktives (echtes) Abo → Status anzeigen statt Checkout
  const hasPaidSubscription =
    isActive || (subscription?.status === "trialing" && !!subscription?.stripe_subscription_id);


  return (
    <AppShell
      right={
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition"
        >
          <X className="h-5 w-5" />
        </button>
      }
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">

          <div className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Tinta Pro
          </div>
          <h1 className="font-serif text-3xl mb-2">
            {hasPaidSubscription ? "Dein Abonnement" : "Dein Farbgedächtnis, jederzeit."}
          </h1>
          {!hasPaidSubscription && (
            <p className="text-sm text-muted-foreground">
              7 Tage gratis testen. Danach 14,99 € pro Monat. Jederzeit kündbar.
            </p>
          )}
        </div>

        {loading ? (
          <div className="card-soft p-6 h-40 animate-pulse" />
        ) : hasPaidSubscription ? (
          <div className="card-soft p-6 mb-5" style={{ background: "var(--gradient-card)" }}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Status
            </div>
            <div className="font-serif text-2xl mb-2">Du hast Tinta Pro</div>
            {inTrial && (
              <p className="text-sm text-muted-foreground mb-1">
                Testphase noch{" "}
                <strong>
                  {trialDaysLeft} {trialDaysLeft === 1 ? "Tag" : "Tage"}
                </strong>
                .
              </p>
            )}
            {subscription?.current_period_end && (
              <p className="text-sm text-muted-foreground mb-4">
                Nächste Abrechnung am{" "}
                <strong>{formatDateDE(subscription.current_period_end)}</strong>.
              </p>
            )}
            <button
              onClick={onPortal}
              disabled={portalLoading}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {portalLoading ? "Wird geöffnet …" : "Abo verwalten"}
            </button>
            <Link
              to="/account/billing"
              className="mt-3 block text-center text-sm text-primary hover:opacity-80"
            >
              Zur Abo-Übersicht
            </Link>
            <Link
              to="/clients"
              className="mt-2 block text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Zurück zu deinen Kundinnen
            </Link>

          </div>
        ) : (
          <>
            {inTrial && (
              <div className="card-soft p-4 mb-5 text-center text-sm">
                Deine Testphase läuft noch{" "}
                <strong>
                  {trialDaysLeft} {trialDaysLeft === 1 ? "Tag" : "Tage"}
                </strong>
                .
              </div>
            )}

            {subscription?.status === "past_due" && (
              <div className="card-soft p-4 mb-5 text-center text-sm text-destructive">
                Zahlung fehlgeschlagen. Bitte aktualisiere deine Zahlungsmethode.
              </div>
            )}

            <div className="card-soft p-6 mb-5" style={{ background: "var(--gradient-card)" }}>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-serif text-4xl">14,99 €</span>
                <span className="text-sm text-muted-foreground">/ Monat</span>
              </div>
              <ul className="space-y-2.5 mb-5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onSubscribe}
                disabled={submitting}
                className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? "Wird geöffnet …" : "Jetzt abonnieren"}
              </button>
              {error && (
                <p className="text-xs text-destructive text-center mt-3" role="alert">
                  {error}
                </p>
              )}
              <p className="text-xs text-muted-foreground text-center mt-3">
                7 Tage kostenlos testen. Zahlung über Stripe, jederzeit kündbar.
              </p>

            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
