import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

export function TrialChip() {
  const { subscription, loading, inTrial, isActive, trialDaysLeft } = useSubscription();
  if (loading || !subscription) return null;

  let label = "Test beendet";
  let icon = <Sparkles className="h-3 w-3" />;
  let tone =
    "bg-secondary/70 text-foreground/70 hover:bg-secondary";

  if (isActive) {
    label = "Tinta Pro";
    icon = <Check className="h-3 w-3" />;
    tone = "bg-primary/15 text-primary hover:bg-primary/25";
  } else if (inTrial) {
    label = `Test – noch ${trialDaysLeft} ${trialDaysLeft === 1 ? "Tag" : "Tage"}`;
    icon = <Sparkles className="h-3 w-3" />;
    tone = "bg-primary/10 text-primary hover:bg-primary/20";
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
