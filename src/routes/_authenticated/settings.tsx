import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFarbtimerSetting } from "@/hooks/useFarbtimerSetting";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { enabled, loading, setEnabled } = useFarbtimerSetting();

  async function onToggle(value: boolean) {
    try {
      await setEnabled(value);
    } catch (err) {
      console.error("[toggle-farbtimer]", err);
      toast.error("Einstellung konnte nicht gespeichert werden.");
    }
  }

  return (
    <AppShell back={{ to: "/clients" }} title="Einstellungen">
      <div className="space-y-3">
        <div className="card-soft p-5 flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="farbtimer" className="text-sm font-medium">
              Farbtimer
            </Label>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Zeigt bei jeder Rezeptur-Komponente mit Einwirkzeit einen Countdown mit
              Benachrichtigung bei Ablauf.
            </p>
          </div>
          <Switch id="farbtimer" checked={enabled} disabled={loading} onCheckedChange={onToggle} />
        </div>
      </div>
    </AppShell>
  );
}
