import { Link } from "@tanstack/react-router";
import { AlertCircle, Check, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

export function TrialChip() {
  const { status, loading, inTrial, trialDaysLeft } = useSubscription();

  // Ruhiger Platzhalter – gleiche Höhe/Breite, kein Layout-Sprung
  if (loading) {
    return <span className="inline-block h-7 w-24 rounded-full bg-secondary/50 animate-pulse" />;
  }

  let label = "Test beendet";
  let icon = <Sparkles className="h-3 w-3" />;
  let tone = "bg-secondary/70 text-foreground/70 hover:bg-secondary";

  if (status === "active") {
    label = "Tinta Pro";
    icon = <Check className="h-3 w-3" />;
    tone = "bg-primary/15 text-primary hover:bg-primary/25";
  } else if (status === "past_due") {
    label = "Zahlung fehlgeschlagen";
    icon = <AlertCircle className="h-3 w-3" />;
    tone = "bg-destructive/10 text-destructive hover:bg-destructive/20";
  } else if (inTrial) {
    label = `Noch ${trialDaysLeft} ${trialDaysLeft === 1 ? "Tag" : "Tage"} Test`;
    icon = <Sparkles className="h-3 w-3" />;
    tone =
      trialDaysLeft <= 2
        ? "bg-[oklch(0.92_0.06_65)] text-[oklch(0.45_0.12_55)] hover:opacity-90"
        : "bg-secondary/70 text-foreground/70 hover:bg-secondary";
  }

  return (
    <Link
      to="/subscribe"
      className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-medium transition ${tone}`}
      aria-label="Abo-Status anzeigen"
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}
