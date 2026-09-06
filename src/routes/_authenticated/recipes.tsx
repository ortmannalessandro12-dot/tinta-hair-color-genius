import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatDateDE } from "@/lib/tinta";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/recipes")({
  component: RecipesList,
});

type Row = {
  id: string;
  treatment: string;
  created_at: string;
  client_id: string;
  client_name: string;
};

function RecipesList() {
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["all-recipes"],
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, treatment, created_at, client_id, clients(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        treatment: r.treatment,
        created_at: r.created_at,
        client_id: r.client_id,
        client_name: (r.clients as { name: string } | null)?.name ?? "Unbekannt",
      }));
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data;
    return data.filter(
      (r) =>
        r.client_name.toLowerCase().includes(needle) || r.treatment.toLowerCase().includes(needle),
    );
  }, [data, q]);

  return (
    <AppShell title="Rezepte">
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kundin oder Behandlung suchen …"
            className="pl-12 h-12 rounded-full"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 card-soft animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {data?.length ? "Keine Treffer." : "Noch keine Rezepturen vorhanden."}
          </div>
        ) : (
          <ul className="space-y-2.5">
            {filtered.map((r) => (
              <li key={r.id}>
                <Link
                  to="/clients/$clientId/recipes/$recipeId"
                  params={{ clientId: r.client_id, recipeId: r.id }}
                  className="card-soft p-4 flex items-center justify-between gap-4 hover:shadow-glow transition-all"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{r.treatment}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {r.client_name}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {formatDateDE(r.created_at)}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
