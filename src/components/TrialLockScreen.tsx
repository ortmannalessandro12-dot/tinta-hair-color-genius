import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { createCheckoutSession } from "@/lib/billing.functions";

type BackTarget = { to: string; params?: Record<string, string> };

const FEATURES = [
  "Farbrezepte unbegrenzt verwalten",
  "Für das ganze Salon-Team",
  "Foto vom Ergebnis pro Rezeptur",
];

/**
 * Vollflächige Sperrseite für abgelaufene Testphasen. Ersetzt das jeweilige
 * Formular komplett (keine Dialog-/Modal-Semantik) – daher gibt es hier
 * bewusst kein X, keinen Klick-außerhalb und keinen Escape-Handler. Der
 * einzige Ausweg ist der explizite "Zurück"-Link zur vorherigen Lese-Ansicht.
 */
export function TrialLockScreen({ back }: { back: BackTarget }) {
  const startCheckout = useServerFn(createCheckoutSession);
  const [submitting, setSubmitting] = useState(false);

  async function onSubscribe() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await startCheckout();
      if ("error" in res && res.error === "already_subscribed") {
        toast.info("Du hast bereits ein aktives Abo.");
        setSubmitting(false);
        return;
      }
      if ("url" in res && res.url) {
        window.location.href = res.url;
        return;
      }
      throw new Error("Keine Checkout-URL erhalten.");
    } catch (err) {
      console.error("[checkout]", err);
      toast.error("Checkout konnte nicht gestartet werden. Bitte versuche es erneut.");
      setSubmitting(false);
    }
  }

  return (
    <AppShell back={back}>
      <div className="max-w-md mx-auto text-center py-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-2xl mb-2">Dein 14-tägiger Test ist abgelaufen.</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Schalte Tinta Pro frei, um neue Rezepte zu erstellen und zu bearbeiten.
        </p>

        <div
          className="card-soft p-6 mb-5 text-left"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="flex items-baseline gap-1 mb-4">
            <span className="font-serif text-4xl">14,99 €</span>
            <span className="text-sm text-muted-foreground">/ Monat</span>
          </div>
          <ul className="space-y-2.5 mb-5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onSubscribe}
            disabled={submitting}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "Wird geöffnet …" : "Jetzt abonnieren"}
          </button>
        </div>

        <Link
          to={back.to}
          params={back.params as never}
          className="inline-block text-sm text-muted-foreground hover:text-foreground transition"
        >
          Zurück
        </Link>
      </div>
    </AppShell>
  );
}
