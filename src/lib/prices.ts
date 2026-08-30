import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ProductPrice = Tables<"product_prices">;

type DefaultPrice = {
  brand: string;
  tube_size_g: number;
  price_eur: number;
  is_default: true;
  price_verified: boolean;
  price_source: string | null;
};

/**
 * Startliste, Marken müssen exakt zu den Schlüsseln in BRAND_SHADES (lib/tinta.ts) passen.
 * Brutto-Richtwerte, Quelle AlfaStore (aktueller Fachhandelspreis), Stand 08/2026.
 */
const DEFAULT_PRICES: DefaultPrice[] = [
  {
    brand: "Wella",
    tube_size_g: 60,
    price_eur: 7.79,
    is_default: true,
    price_verified: true,
    price_source: "AlfaStore, 08/2026",
  },
  {
    brand: "Goldwell Topchic",
    tube_size_g: 60,
    price_eur: 10.5,
    is_default: true,
    price_verified: true,
    price_source: "AlfaStore, 08/2026 — Richtwert aus Spanne 9,50–11,32 € je Nuance",
  },
  {
    brand: "Schwarzkopf Igora Royal",
    tube_size_g: 60,
    price_eur: 9.3,
    is_default: true,
    price_verified: true,
    price_source: "AlfaStore, 08/2026 — Richtwert aus Spanne 6,97–9,34 € je Nuance",
  },
  {
    brand: "Redken Shades EQ",
    tube_size_g: 60,
    price_eur: 14.9,
    is_default: true,
    price_verified: true,
    price_source: "AlfaStore, 08/2026 — Richtwert aus Spanne 14,64–15,23 € je Nuance",
  },
  {
    brand: "L'Oréal Dia Light",
    tube_size_g: 60,
    price_eur: 10.66,
    is_default: true,
    price_verified: true,
    price_source: "AlfaStore, 08/2026",
  },
  {
    brand: "Newsha",
    tube_size_g: 60,
    price_eur: 10.0,
    is_default: true,
    price_verified: false,
    price_source: null,
  },
];

/**
 * Legt beim ersten Aufruf die Startpreise für Marken an, die der Nutzer noch nicht hat.
 * Bereits vorhandene (auch bearbeitete) Zeilen werden nie überschrieben.
 */
export async function ensureDefaultPrices(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase
    .from("product_prices")
    .upsert(
      DEFAULT_PRICES.map((p) => ({
        ...p,
        user_id: userId,
        last_checked_at: p.price_verified ? today : null,
      })),
      { onConflict: "user_id,brand", ignoreDuplicates: true },
    );
  if (error) throw error;
}

export function pricePerGram(price: Pick<ProductPrice, "price_eur" | "tube_size_g">) {
  if (!price.tube_size_g) return 0;
  return price.price_eur / price.tube_size_g;
}

export type RecipeCost = {
  /** Summe der Materialkosten aller Komponenten mit hinterlegtem Preis. */
  total: number;
  /** true, wenn für jede Komponente ein Preis gefunden wurde. */
  complete: boolean;
  /** Marken, für die kein Preis hinterlegt ist. */
  missingBrands: string[];
};

export function computeRecipeCost(
  components: { brand: string; grams: number | string | null }[],
  prices: Pick<ProductPrice, "brand" | "price_eur" | "tube_size_g">[],
): RecipeCost {
  const byBrand = new Map(prices.map((p) => [p.brand, p]));
  let total = 0;
  const missingBrands = new Set<string>();

  for (const c of components) {
    const grams = Number(c.grams) || 0;
    const price = byBrand.get(c.brand);
    if (!price) {
      missingBrands.add(c.brand);
      continue;
    }
    total += grams * pricePerGram(price);
  }

  return { total, complete: missingBrands.size === 0, missingBrands: [...missingBrands] };
}

export function formatEUR(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}
