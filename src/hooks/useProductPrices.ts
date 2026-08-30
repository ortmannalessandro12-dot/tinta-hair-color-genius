import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ensureDefaultPrices, type ProductPrice } from "@/lib/prices";

/**
 * Lädt die Materialpreise der Nutzerin und legt beim allerersten Aufruf
 * die Startliste an (siehe lib/prices.ts).
 */
export function useProductPrices() {
  const q = useQuery({
    queryKey: ["product-prices"],
    queryFn: async (): Promise<ProductPrice[]> => {
      const { data: u } = await supabase.auth.getUser();
      const userId = u.user?.id;
      if (!userId) return [];
      await ensureDefaultPrices(userId);
      const { data, error } = await supabase
        .from("product_prices")
        .select("*")
        .order("brand", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });

  return { prices: q.data ?? [], loading: q.isLoading, refetch: q.refetch };
}
