import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRANDS, formatDateDE } from "@/lib/tinta";
import { useProductPrices } from "@/hooks/useProductPrices";
import type { ProductPrice } from "@/lib/prices";

export const Route = createFileRoute("/_authenticated/account/prices")({
  component: PricesPage,
});

const EDITABLE_BRANDS = BRANDS.filter((b) => b !== "Andere…");

function PricesPage() {
  const { prices, loading } = useProductPrices();
  const byBrand = new Map(prices.map((p) => [p.brand, p]));

  return (
    <AppShell back={{ to: "/clients" }} title="Preispflege">
      <p className="text-sm text-muted-foreground mb-5">
        Bruttopreise (inkl. MwSt.) je Marke. Werden für die Materialkosten-Berechnung in den
        Rezepturen verwendet.
      </p>

      {loading ? (
        <div className="space-y-3">
          {EDITABLE_BRANDS.map((b) => (
            <div key={b} className="h-32 card-soft animate-pulse" />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {EDITABLE_BRANDS.map((brand) => (
            <PriceRow key={brand} brand={brand} price={byBrand.get(brand)} />
          ))}
        </ul>
      )}
    </AppShell>
  );
}

function PriceRow({ brand, price }: { brand: string; price: ProductPrice | undefined }) {
  const qc = useQueryClient();
  const [tube, setTube] = useState(String(price?.tube_size_g ?? 60));
  const [eur, setEur] = useState(price ? String(price.price_eur) : "");
  const [saving, setSaving] = useState(false);

  const dirty =
    tube !== String(price?.tube_size_g ?? 60) || eur !== String(price?.price_eur ?? "");

  async function save() {
    const tubeVal = parseFloat(tube.replace(",", "."));
    const eurVal = parseFloat(eur.replace(",", "."));
    if (!tubeVal || !eurVal) {
      toast.error("Bitte Tubengröße und Preis angeben.");
      return;
    }
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const userId = u.user?.id;
      if (!userId) throw new Error("not authenticated");
      const today = new Date().toISOString().slice(0, 10);

      if (price) {
        const { error } = await supabase
          .from("product_prices")
          .update({
            tube_size_g: tubeVal,
            price_eur: eurVal,
            is_default: false,
            last_checked_at: today,
          })
          .eq("id", price.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("product_prices").insert({
          user_id: userId,
          brand,
          tube_size_g: tubeVal,
          price_eur: eurVal,
          is_default: false,
          price_verified: false,
          last_checked_at: today,
        });
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["product-prices"] });
      toast.success("Preis gespeichert");
    } catch (err) {
      console.error("[save-price]", err);
      toast.error("Speichern fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="card-soft p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="font-medium">{brand}</div>
        {price?.price_verified ? (
          price.price_source && (
            <span className="text-[11px] text-muted-foreground text-right shrink-0">
              {price.price_source}
            </span>
          )
        ) : (
          <span className="rounded-full bg-accent text-accent-foreground px-2.5 py-1 text-[11px] font-medium shrink-0">
            Richtwert — bitte prüfen
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Tubengröße (g)">
          <Input
            inputMode="decimal"
            value={tube}
            onChange={(e) => setTube(e.target.value)}
            className="font-mono"
          />
        </Field>
        <Field label="Preis (€, brutto)">
          <Input
            inputMode="decimal"
            value={eur}
            onChange={(e) => setEur(e.target.value)}
            placeholder="0,00"
            className="font-mono"
          />
        </Field>
      </div>

      {price?.last_checked_at && (
        <div className="text-[11px] text-muted-foreground">
          Zuletzt geprüft: {formatDateDE(price.last_checked_at)}
        </div>
      )}

      {dirty && (
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="w-full h-9 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Speichert …" : "Speichern"}
        </button>
      )}
    </li>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
