import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Persisted in Supabase Auth user_metadata (kein eigenes Feld in der DB
 * nötig) statt in der profiles-Tabelle, um für diese einfache Ein/Aus-
 * Präferenz keine Migration zu brauchen.
 */
export function useFarbtimerSetting() {
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["farbtimer-enabled"],
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      const value = data.user?.user_metadata?.farbtimer_enabled;
      return typeof value === "boolean" ? value : true;
    },
  });

  async function setEnabled(value: boolean) {
    const { error } = await supabase.auth.updateUser({ data: { farbtimer_enabled: value } });
    if (error) throw error;
    qc.setQueryData(["farbtimer-enabled"], value);
  }

  return { enabled: q.data ?? true, loading: q.isLoading, setEnabled };
}
