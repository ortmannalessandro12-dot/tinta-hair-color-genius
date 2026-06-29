import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { useSubscription } from "@/hooks/useSubscription";
import { createCheckoutSession } from "@/lib/billing.functions";
import { toast } from "sonner";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/subscribe")({
  component: SubscribePage,
});

function SubscribePage() {
  const { subscription, inTrial, isActive, trialDaysLeft, loading } = useSubscription();
  const startCheckout = useServerFn(createCheckoutSession);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!loading && isActive) {
      navigate({ to: "/account/billing" });
    }
  }, [loading, isActive, navigate]);

  async function onSubscribe() {
    setSubmitting(true);
    try {
      const res = await startCheckout();
      if (res?.url) window.location.href = res.url;
      else throw new Error("Keine Checkout-URL erhalten.");
    } catch (e) {
      console.error("[checkout]", e);
      toast.error("Checkout konnte nicht gestartet werden.");
      setSubmitting(false);
    }
  }

  const features = [
    "Unbegrenzte Kundinnen",
    "Unbegrenzte Farbrezepturen",
    "Foto vom Ergebnis pro Rezeptur",
    "Sichere Cloud-Synchronisation",
    "Auf iPhone & iPad installierbar",
  ];

  return (
    <AppShell>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Tinta Pro
          </div>
          <h1 className="font-serif text-3xl mb-2">Dein Farbgedächtnis, jederzeit.</h1>
          <p className="text-sm text-muted-foreground">
            7 Tage gratis testen. Danach 14,99 € pro Monat. Jederzeit kündbar.
          </p>
        </div>

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
            {submitting ? "Wird geöffnet …" : inTrial ? "Jetzt abonnieren" : "Abo starten"}
          </button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Zahlung über Stripe. Du kannst jederzeit kündigen.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
