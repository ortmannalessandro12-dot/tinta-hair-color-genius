import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export function AvvGate() {
  const qc = useQueryClient();
  const [accepted, setAccepted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const { data } = useQuery({
    queryKey: ["profile", "avv"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, avv_accepted_at")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });

  const needsConsent = data && !data.avv_accepted_at;
  if (!needsConsent) return null;

  async function onAccept() {
    if (!accepted) return;
    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("no user");
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { user_id: uid, avv_accepted_at: new Date().toISOString() },
          { onConflict: "user_id" },
        );
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["profile", "avv"] });
    } catch (e) {
      console.error("[avv]", e);
      toast.error("Zustimmung konnte nicht gespeichert werden.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center px-5">
      <div className="w-full max-w-md card-soft p-6 bg-card">
        <h2 className="font-serif text-2xl mb-2">Auftragsverarbeitungsvertrag</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Damit du Tinta weiter nutzen kannst, benötigen wir deine Zustimmung zum
          Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO.
        </p>
        <label className="flex items-start gap-2.5 text-sm cursor-pointer select-none mb-5">
          <Checkbox
            checked={accepted}
            onCheckedChange={(v) => setAccepted(v === true)}
            id="avv-gate"
          />
          <span>
            Ich habe den{" "}
            <a
              href="/avv"
              target="_blank"
              rel="noreferrer"
              className="underline text-primary"
            >
              Auftragsverarbeitungsvertrag
            </a>{" "}
            gelesen und stimme ihm zu.
          </span>
        </label>
        <button
          onClick={onAccept}
          disabled={!accepted || submitting}
          className="w-full h-11 rounded-full bg-primary text-primary-foreground font-medium disabled:opacity-50 transition hover:opacity-90"
        >
          {submitting ? "Wird gespeichert …" : "Zustimmen und fortfahren"}
        </button>
      </div>
    </div>
  );
}
