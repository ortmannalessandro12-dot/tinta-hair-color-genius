import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Monogram } from "@/components/Monogram";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogOut } from "lucide-react";
import { formatDateDE } from "@/lib/tinta";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import womanHair from "@/assets/woman-hair.png";
import mirror from "@/assets/mirror.png";

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
      <div className="relative -mx-5 -mt-2 px-5 pb-2 overflow-hidden">
        {/* Hintergrund-Illustration */}
        <img
          src={womanHair}
          alt=""
          aria-hidden
          width={1024}
          height={1024}
          className="pointer-events-none select-none absolute -right-16 -top-4 w-[280px] sm:w-[340px] opacity-70 mix-blend-multiply"
          style={{ maskImage: "linear-gradient(to left, black 40%, transparent 95%)", WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 95%)" }}
        />

        <div className="relative pt-2 pb-6">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-primary">
            Dein Farbarchiv
          </p>
          <h1 className="font-serif text-5xl mt-2 leading-none">
            Tinta<span className="text-primary">.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {data?.length ?? 0} {data?.length === 1 ? "Kundin" : "Kundinnen"} — jede Formel sicher verwahrt.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kundin suchen …"
            className="pl-12 h-14 rounded-full bg-card/90 backdrop-blur border-border shadow-[0_8px_30px_-12px_rgba(217,143,168,0.35)]"
          />
        </div>
      </div>

      <div className="mt-6">
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
      </div>

      <Link
        to="/clients/new"
        className="fixed bottom-8 right-6 sm:right-[max(1.5rem,calc(50vw-20rem))] z-40 h-14 pl-5 pr-6 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center gap-2 hover:scale-105 active:scale-95 transition font-medium"
        aria-label="Neue Kundin"
      >
        <Plus className="h-5 w-5" />
        <span>Kundin</span>
      </Link>
    </AppShell>
  );
}

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="py-12 px-6 text-center">
      <img
        src={mirror}
        alt=""
        aria-hidden
        width={512}
        height={512}
        loading="lazy"
        className="mx-auto mb-5 h-16 w-auto drop-shadow-[0_8px_20px_rgba(217,143,168,0.35)]"
      />
      <h3 className="font-serif italic text-2xl text-foreground/80">
        {hasAny ? "Keine Treffer." : "Dein Archiv ist bereit."}
      </h3>
      <p className="text-sm text-muted-foreground mt-3 max-w-xs mx-auto">
        {hasAny
          ? "Versuche einen anderen Namen."
          : "Tippe unten auf +, um zu starten."}
      </p>
    </div>
  );
}
