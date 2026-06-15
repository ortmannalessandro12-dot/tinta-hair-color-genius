import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDateDE } from "@/lib/tinta";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/clients/$clientId/recipes/$recipeId")({
  component: RecipeDetail,
});

function RecipeDetail() {
  const { clientId, recipeId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: async () => {
      const { data: recipe, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", recipeId)
        .single();
      if (error) throw error;
      const { data: comps } = await supabase
        .from("recipe_components")
        .select("*")
        .eq("recipe_id", recipeId)
        .order("position", { ascending: true });
      return { recipe, components: comps ?? [] };
    },
  });

  async function deleteRecipe() {
    const { error } = await supabase.from("recipes").delete().eq("id", recipeId);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["client", clientId] });
    toast.success("Rezeptur gelöscht");
    navigate({ to: "/clients/$clientId", params: { clientId } });
  }

  if (isLoading || !data) {
    return (
      <AppShell back={{ to: "/clients/$clientId", params: { clientId } }}>
        <div className="h-40 card-soft animate-pulse" />
      </AppShell>
    );
  }

  const total = data.components.reduce((s, c) => s + Number(c.grams || 0), 0);

  return (
    <AppShell
      back={{ to: "/clients/$clientId", params: { clientId } }}
      title={data.recipe.treatment}
    >
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Gesamt" value={`${total.toFixed(0)} g`} />
        <Stat label="Komponenten" value={`${data.components.length}`} />
        <Stat label="Datum" value={formatDateDE(data.recipe.created_at)} />
      </div>

      <ul className="space-y-3">
        {data.components.map((c, i) => (
          <li key={c.id} className="card-soft p-5">
            <div className="flex items-baseline justify-between mb-3">
              <div className="font-serif text-lg">Komponente {i + 1}</div>
              <div className="text-primary font-medium">{Number(c.grams).toFixed(0)} g</div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <Row label="Marke" value={c.brand_custom || c.brand} />
              <Row label="Ton" value={c.shade_custom || c.shade} />
              {c.correction && <Row label="Korrektur" value={c.correction} />}
              {c.developer && <Row label="Oxidant" value={c.developer} />}
              {c.time_minutes != null && <Row label="Einwirkzeit" value={`${c.time_minutes} Min.`} />}
            </dl>
          </li>
        ))}
      </ul>

      {data.recipe.note && (
        <div className="card-soft p-5 mt-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Notiz</div>
          <p className="text-sm whitespace-pre-wrap">{data.recipe.note}</p>
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-border/60">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full inline-flex items-center justify-center gap-2 text-sm text-destructive hover:bg-destructive/5 h-11 rounded-full transition">
              <Trash2 className="h-4 w-4" /> Rezeptur löschen
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rezeptur löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                Diese Aktion kann nicht rückgängig gemacht werden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={deleteRecipe}>Löschen</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-soft p-4 text-center">
      <div className="font-serif text-xl">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </>
  );
}
