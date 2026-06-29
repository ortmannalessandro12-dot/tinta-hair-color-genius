import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Monogram } from "@/components/Monogram";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { formatDateDE } from "@/lib/tinta";
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
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/clients/$clientId/")({
  component: ClientProfile,
});

function ClientProfile() {
  const { clientId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const { data: client, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();
      if (error) throw error;
      const { data: recipes } = await supabase
        .from("recipes")
        .select("id, treatment, created_at, note")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      return { client, recipes: recipes ?? [] };
    },
  });

  async function deleteClient() {
    const { error } = await supabase.from("clients").delete().eq("id", clientId);
    if (error) {
      console.error("[delete-client]", error);
      return toast.error("Löschen fehlgeschlagen. Bitte versuche es erneut.");
    }
    qc.invalidateQueries({ queryKey: ["clients"] });
    toast.success("Kundin gelöscht");
    navigate({ to: "/clients" });
  }

  if (isLoading || !data) {
    return (
      <AppShell back={{ to: "/clients" }}>
        <div className="h-40 card-soft animate-pulse" />
      </AppShell>
    );
  }

  return (
    <AppShell back={{ to: "/clients" }}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-soft p-7 mb-6 text-center"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="flex justify-center mb-3">
          <Monogram name={data.client.name} size={88} />
        </div>
        <h2 className="font-serif text-3xl">{data.client.name}</h2>
        {data.client.note && (
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">{data.client.note}</p>
        )}
      </motion.div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg">Rezepturen</h3>
        <Link
          to="/clients/$clientId/recipes/new"
          params={{ clientId }}
          className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" /> Neu
        </Link>
      </div>

      {data.recipes.length === 0 ? (
        <div className="card-soft p-10 text-center text-sm text-muted-foreground">
          Noch keine Rezepturen. Lege die erste an.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {data.recipes.map((r, idx) => (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                to="/clients/$clientId/recipes/$recipeId"
                params={{ clientId, recipeId: r.id }}
                className="card-soft p-4 flex items-center gap-3 hover:shadow-glow transition"
              >
                <span
                  className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{ background: "var(--blush)" }}
                >
                  {r.treatment.slice(0, 2)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{r.treatment}</div>
                  <div className="text-xs text-muted-foreground">{formatDateDE(r.created_at)}</div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}

      <div className="mt-10 pt-6 border-t border-border/60">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full inline-flex items-center justify-center gap-2 text-sm text-destructive hover:bg-destructive/5 h-11 rounded-full transition">
              <Trash2 className="h-4 w-4" /> Kundin löschen
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kundin und alle Rezepturen löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                Diese Aktion kann nicht rückgängig gemacht werden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={deleteClient}>Löschen</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}
