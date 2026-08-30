import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useQuery } from "@tanstack/react-query";
import { useProductPrices } from "@/hooks/useProductPrices";
import { computeRecipeCost, formatEUR } from "@/lib/prices";

export const Route = createFileRoute("/_authenticated/consumption")({
  component: ConsumptionPage,
});

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

function monthLabel(key: string) {
  return new Date(`${key}-01T00:00:00`).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
}

function ConsumptionPage() {
  const { prices } = useProductPrices();

  const { data, isLoading } = useQuery({
    queryKey: ["consumption"],
    queryFn: async () => {
      const { data: recipes, error } = await supabase
        .from("recipes")
        .select("id, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const ids = recipes.map((r) => r.id);
      let components: { recipe_id: string; brand: string; grams: number }[] = [];
      if (ids.length) {
        const { data: comps, error: cErr } = await supabase
          .from("recipe_components")
          .select("recipe_id, brand, grams")
          .in("recipe_id", ids);
        if (cErr) throw cErr;
        components = comps ?? [];
      }
      return { recipes, components };
    },
  });

  const months = useMemo(() => {
    if (!data) return [];
    const byRecipe = new Map<string, { brand: string; grams: number }[]>();
    for (const c of data.components) {
      const arr = byRecipe.get(c.recipe_id) ?? [];
      arr.push({ brand: c.brand, grams: c.grams });
      byRecipe.set(c.recipe_id, arr);
    }

    const byMonth = new Map<string, { total: number; recipeCount: number; incomplete: number }>();
    for (const r of data.recipes) {
      const key = monthKey(r.created_at);
      const cost = computeRecipeCost(byRecipe.get(r.id) ?? [], prices);
      const entry = byMonth.get(key) ?? { total: 0, recipeCount: 0, incomplete: 0 };
      entry.total += cost.total;
      entry.recipeCount += 1;
      if (!cost.complete) entry.incomplete += 1;
      byMonth.set(key, entry);
    }

    return [...byMonth.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, v]) => ({ key, ...v }));
  }, [data, prices]);

  const currentKey = monthKey(new Date().toISOString());
  const current = months.find((m) => m.key === currentKey) ?? {
    key: currentKey,
    total: 0,
    recipeCount: 0,
    incomplete: 0,
  };
  const previous = months.filter((m) => m.key !== currentKey);

  return (
    <AppShell back={{ to: "/clients" }} title="Verbrauch">
      {isLoading ? (
        <div className="h-40 card-soft animate-pulse" />
      ) : (
        <div className="space-y-6">
          <div className="card-soft p-6 text-center" style={{ background: "var(--gradient-card)" }}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {monthLabel(current.key)} · läuft
            </div>
            <div className="text-4xl font-mono tabular-nums">{formatEUR(current.total)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {current.recipeCount === 0
                ? "Noch keine Rezepturen in diesem Monat"
                : `${current.recipeCount} ${current.recipeCount === 1 ? "Rezeptur" : "Rezepturen"}`}
            </p>
            {current.incomplete > 0 && (
              <p className="text-xs text-muted-foreground/70 mt-2">
                {current.incomplete}{" "}
                {current.incomplete === 1
                  ? "Rezeptur ohne vollständige Kostenberechnung"
                  : "Rezepturen ohne vollständige Kostenberechnung"}{" "}
                — Marke ohne hinterlegten Preis.
              </p>
            )}
          </div>

          {previous.length > 0 && (
            <div>
              <h3 className="font-serif text-lg mb-3">Vormonate</h3>
              <ul className="space-y-2.5">
                {previous.map((m) => (
                  <li
                    key={m.key}
                    className="card-soft p-4 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-medium capitalize">{monthLabel(m.key)}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {m.recipeCount} {m.recipeCount === 1 ? "Rezeptur" : "Rezepturen"}
                        {m.incomplete > 0 && (
                          <span className="text-muted-foreground/70">
                            {" "}
                            · {m.incomplete} ohne Preis
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-mono tabular-nums font-medium">{formatEUR(m.total)}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
