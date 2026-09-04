import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AllergyFields } from "@/components/AllergyFields";
import { TrialLockScreen } from "@/components/TrialLockScreen";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/clients/$clientId/edit")({
  component: EditClient,
});

function EditClient() {
  const { clientId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { loading: subLoading, hasAccess } = useSubscription();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [allergies, setAllergies] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentAt, setConsentAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["client-edit", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!data) return;
    setName(data.name);
    setNote(data.note ?? "");
    setAllergies(data.allergies ?? "");
    setConsent(!!data.allergy_consent);
    setConsentAt(data.allergy_consent_at);
  }, [data]);

  function onAllergyChange(patch: { consent?: boolean; allergies?: string }) {
    if (patch.consent !== undefined) {
      setConsent(patch.consent);
      if (patch.consent) setConsentAt(new Date().toISOString());
      else {
        setAllergies("");
        setConsentAt(null);
      }
    }
    if (patch.allergies !== undefined) setAllergies(patch.allergies);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          name: name.trim(),
          note: note.trim() || null,
          allergies: consent ? allergies.trim() || null : null,
          allergy_consent: consent,
          allergy_consent_at: consent ? consentAt ?? new Date().toISOString() : null,
        })
        .eq("id", clientId);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["client", clientId] });
      qc.invalidateQueries({ queryKey: ["client-edit", clientId] });
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Änderungen gespeichert");
      navigate({ to: "/clients/$clientId", params: { clientId } });
    } catch (err) {
      console.error("[update-client]", err);
      toast.error("Speichern fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setSaving(false);
    }
  }

  if (subLoading) {
    return (
      <AppShell back={{ to: "/clients/$clientId", params: { clientId } }} title="Kundin bearbeiten">
        <div className="h-40 card-soft animate-pulse" />
      </AppShell>
    );
  }
  if (!hasAccess) {
    return <TrialLockScreen back={{ to: "/clients/$clientId", params: { clientId } }} />;
  }

  return (
    <AppShell back={{ to: "/clients/$clientId", params: { clientId } }} title="Kundin bearbeiten">
      <form onSubmit={save} className="space-y-6">
        <div className="card-soft p-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Notiz (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
        </div>

        <AllergyFields consent={consent} allergies={allergies} onChange={onAllergyChange} />

        <Button type="submit" disabled={saving || !name.trim()} className="w-full h-12 rounded-full">
          {saving ? "Speichert …" : "Änderungen speichern"}
        </Button>
      </form>
    </AppShell>
  );
}
