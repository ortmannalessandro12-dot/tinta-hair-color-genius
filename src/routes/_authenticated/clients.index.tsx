import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Monogram } from "@/components/Monogram";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogOut, Scissors } from "lucide-react";
import { formatDateDE } from "@/lib/tinta";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/clients/")({
  component: ClientsList,
});

type Row = {
  id: string;
  name: string;
  note: string | null;
  recipes: { count: number; latest: string | null };
};

function ClientsList() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async (): Promise<Row[]> => {
      const { data: clients, error } = await supabase
        .from("clients")
        .select("id, name, note")
        .order("name", { ascending: true });
      if (error) throw error;
      const ids = clients.map((c) => c.id);
      let stats: Record<string, { count: number; latest: string | null }> = {};
      if (ids.length) {
        const { data: rec } = await supabase
          .from("recipes")
          .select("client_id, created_at")
          .in("client_id", ids);
        for (const r of rec ?? []) {
          const s = (stats[r.client_id] ??= { count: 0, latest: null });
          s.count++;
          if (!s.latest || r.created_at > s.latest) s.latest = r.created_at;
        }
      }
      return clients.map((c) => ({ ...c, recipes: stats[c.id] ?? { count: 0, latest: null } }));
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data;
    return data.filter((c) => c.name.toLowerCase().includes(needle));
  }, [data, q]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate({ to: "/auth", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell
      right={
        <button
          onClick={signOut}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition text-muted-foreground"
          aria-label="Abmelden"
        >
          <LogOut className="h-4 w-4" />
        </button>
      }
    >
      <div className="mb-6">
        <h2 className="font-serif text-3xl">Kundinnen</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {data?.length ?? 0} {data?.length === 1 ? "Eintrag" : "Einträge"}
        </p>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Suche nach Name"
          className="pl-11 h-12 rounded-full bg-card border-border"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 card-soft animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasAny={!!data?.length} />
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((c, idx) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.25 }}
            >
              <Link
                to="/clients/$clientId"
                params={{ clientId: c.id }}
                className="card-soft p-4 flex items-center gap-4 hover:shadow-glow transition-all"
              >
                <Monogram name={c.name} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c.recipes.count === 0
                      ? "Noch keine Rezepturen"
                      : `${c.recipes.count} ${c.recipes.count === 1 ? "Rezeptur" : "Rezepturen"}${c.recipes.latest ? " · zuletzt " + formatDateDE(c.recipes.latest) : ""}`}
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}

      <Link
        to="/clients/new"
        className="fixed bottom-8 right-6 sm:right-[max(1.5rem,calc(50vw-20rem))] z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center hover:scale-105 active:scale-95 transition"
        aria-label="Neue Kundin"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </AppShell>
  );
}

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="card-soft py-14 px-6 text-center">
      <div
        className="mx-auto mb-5 h-16 w-16 rounded-full flex items-center justify-center"
        style={{ background: "var(--gradient-card)" }}
      >
        <Scissors className="h-7 w-7 text-primary" />
      </div>
      <h3 className="font-serif text-xl">
        {hasAny ? "Keine Treffer" : "Noch keine Kundinnen"}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
        {hasAny
          ? "Versuche einen anderen Namen."
          : "Lege deine erste Kundin an, um die erste Farbrezeptur zu speichern."}
      </p>
    </div>
  );
}
