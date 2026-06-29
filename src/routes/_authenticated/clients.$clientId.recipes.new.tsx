import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRANDS, BRAND_SHADES, CORRECTIONS, DEVELOPERS, TIMES, TREATMENTS, getShadesForBrand } from "@/lib/tinta";

import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_authenticated/clients/$clientId/recipes/new")({
  component: NewRecipe,
});

type Component = {
  id: string;
  brand: string;
  brand_custom: string;
  shade: string;
  shade_custom: string;
  correction: string;
  grams: string;
  developer: string;
  time_minutes: string;
};

function blank(): Component {
  return {
    id: crypto.randomUUID(),
    brand: "",
    brand_custom: "",
    shade: "",
    shade_custom: "",
    correction: "Keine",
    grams: "",
    developer: "",
    time_minutes: "",
  };
}

function NewRecipe() {
  const { clientId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [treatment, setTreatment] = useState<string>("Coloration");
  const [components, setComponents] = useState<Component[]>([blank()]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const totalGrams = useMemo(
    () => components.reduce((s, c) => s + (parseFloat(c.grams) || 0), 0),
    [components],
  );

  function update(id: string, patch: Partial<Component>) {
    setComponents((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  async function save() {
    if (!components.every((c) => c.brand && c.shade && c.grams)) {
      toast.error("Bitte Marke, Ton und Gramm bei jeder Komponente angeben.");
      return;
    }
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const userId = u.user!.id;
      const { data: recipe, error } = await supabase
        .from("recipes")
        .insert({ client_id: clientId, user_id: userId, treatment, note: note.trim() || null })
        .select("id")
        .single();
      if (error) throw error;
      const rows = components.map((c, i) => ({
        recipe_id: recipe.id,
        user_id: userId,
        position: i,
        brand: c.brand,
        brand_custom: c.brand === "Andere…" ? c.brand_custom || null : null,
        shade: c.shade,
        shade_custom: c.shade === "Andere…" ? c.shade_custom || null : null,
        correction: c.correction === "Keine" ? null : c.correction,
        grams: parseFloat(c.grams) || 0,
        developer: c.developer || null,
        time_minutes: c.time_minutes ? parseInt(c.time_minutes, 10) : null,
      }));
      const { error: cErr } = await supabase.from("recipe_components").insert(rows);
      if (cErr) throw cErr;
      qc.invalidateQueries({ queryKey: ["client", clientId] });
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Rezeptur gespeichert");
      navigate({
        to: "/clients/$clientId/recipes/$recipeId",
        params: { clientId, recipeId: recipe.id },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell back={{ to: "/clients/$clientId", params: { clientId } }} title="Neue Rezeptur">
      <div className="space-y-6">
        <section>
          <Label className="mb-3 block">Behandlungsart</Label>
          <div className="flex flex-wrap gap-2">
            {TREATMENTS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTreatment(t)}
                className={`chip ${treatment === t ? "chip-active" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg">Komponenten</h3>
            <div className="text-xs text-muted-foreground">
              Gesamt: <span className="font-medium text-foreground">{totalGrams.toFixed(0)} g</span>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {components.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="card-soft p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Komponente {idx + 1}
                  </span>
                  {components.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setComponents((cs) => cs.filter((x) => x.id !== c.id))}
                      className="text-muted-foreground hover:text-destructive transition"
                      aria-label="Entfernen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <Field label="Marke">
                  <Pick
                    value={c.brand}
                    onChange={(v) =>
                      update(c.id, { brand: v, shade: "", shade_custom: "", brand_custom: "" })
                    }
                    options={BRANDS}
                  />
                </Field>
                {c.brand === "Andere…" && (
                  <Input
                    placeholder="Marke eingeben"
                    value={c.brand_custom}
                    onChange={(e) => update(c.id, { brand_custom: e.target.value })}
                  />
                )}

                <Field label="Ton / Nuance">
                  <Pick
                    value={c.shade}
                   options={c.brand && c.brand !== "Andere…" ? getShadesForBrand(c.brand) : ["Andere…"]}

                    placeholder={c.brand ? "Wählen …" : "Erst Marke wählen"}
                  />
                </Field>


                {c.shade === "Andere…" && (
                  <Input
                    placeholder="Ton eingeben"
                    value={c.shade_custom}
                    onChange={(e) => update(c.id, { shade_custom: e.target.value })}
                  />
                )}

                <Field label="Abmattierung / Korrektur">
                  <Pick
                    value={c.correction}
                    onChange={(v) => update(c.id, { correction: v })}
                    options={CORRECTIONS}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Gramm">
                    <Input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={1}
                      value={c.grams}
                      onChange={(e) => update(c.id, { grams: e.target.value })}
                      placeholder="60"
                    />
                  </Field>
                  <Field label="Oxidant">
                    <Pick
                      value={c.developer}
                      onChange={(v) => update(c.id, { developer: v })}
                      options={DEVELOPERS}
                      placeholder="—"
                    />
                  </Field>
                </div>

                <Field label="Einwirkzeit">
                  <Pick
                    value={c.time_minutes}
                    onChange={(v) => update(c.id, { time_minutes: v })}
                    options={TIMES.map((m) => `${m}`)}
                    render={(v) => `${v} Min.`}
                    placeholder="—"
                  />
                </Field>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setComponents((cs) => [...cs, blank()])}
            className="w-full card-soft p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition border-dashed"
            style={{ borderStyle: "dashed" }}
          >
            <Plus className="h-4 w-4" /> Komponente hinzufügen
          </button>
        </section>

        <section className="space-y-2">
          <Label htmlFor="note">Notiz</Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="z. B. Ansatz 30 Min., Längen 15 Min."
            rows={3}
          />
        </section>

        <Button onClick={save} disabled={saving} className="w-full h-12 rounded-full">
          {saving ? "Speichert …" : "Rezeptur speichern"}
        </Button>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Pick({
  value,
  onChange,
  options,
  placeholder = "Wählen …",
  render,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[] | string[];
  placeholder?: string;
  render?: (v: string) => string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-11 rounded-xl bg-card">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {render ? render(o) : o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
