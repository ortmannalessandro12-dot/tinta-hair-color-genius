import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Monogram } from "@/components/Monogram";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AllergyFields } from "@/components/AllergyFields";
import { TrialLockScreen } from "@/components/TrialLockScreen";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/clients/new")({
  component: NewClient,
});

function NewClient() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { loading: subLoading, hasAccess } = useSubscription();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [allergies, setAllergies] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentAt, setConsentAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      const { data: u } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("clients")
        .insert({
          name: name.trim(),
          note: note.trim() || null,
          user_id: u.user!.id,
          allergies: consent ? allergies.trim() || null : null,
          allergy_consent: consent,
          allergy_consent_at: consent ? consentAt ?? new Date().toISOString() : null,
        })
        .select("id")
        .single();
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Kundin angelegt");
      navigate({ to: "/clients/$clientId", params: { clientId: data.id } });
    } catch (err) {
      console.error("[save-client]", err);
      toast.error("Speichern fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setSaving(false);
    }
  }

  if (subLoading) {
    return (
      <AppShell back={{ to: "/clients" }} title="Neue Kundin">
        <div className="h-40 card-soft animate-pulse" />
      </AppShell>
    );
  }
  if (!hasAccess) {
    return <TrialLockScreen back={{ to: "/clients" }} />;
  }

  return (
    <AppShell back={{ to: "/clients" }} title="Neue Kundin">
      <form onSubmit={save} className="space-y-6">
        <div className="card-soft p-7 flex flex-col items-center text-center">
          <Monogram name={name || "?"} size={84} />
          <p className="text-xs text-muted-foreground mt-3">Vorschau Monogramm</p>
        </div>

        <div className="card-soft p-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z. B. Lina Bergmann"
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
              placeholder="z. B. empfindliche Kopfhaut"
              maxLength={500}
              rows={3}
            />
          </div>
        </div>

        <AllergyFields consent={consent} allergies={allergies} onChange={onAllergyChange} />

        <Button type="submit" disabled={saving || !name.trim()} className="w-full h-12 rounded-full">
          {saving ? "Speichert …" : "Kundin speichern"}
        </Button>
      </form>
    </AppShell>
  );
}
