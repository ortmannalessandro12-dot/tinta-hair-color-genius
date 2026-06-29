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
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/clients/new")({
  component: NewClient,
});

function NewClient() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("clients")
        .insert({ name: name.trim(), note: note.trim() || null, user_id: u.user!.id })
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

        <Button type="submit" disabled={saving || !name.trim()} className="w-full h-12 rounded-full">
          {saving ? "Speichert …" : "Kundin speichern"}
        </Button>
      </form>
    </AppShell>
  );
}
