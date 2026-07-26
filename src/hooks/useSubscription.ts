import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "none";

export type SubscriptionRow = {
  status: string;
  trial_ends_at: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

/**
 * Einzige Quelle der Wahrheit für den Abo-Status.
 */
export function useSubscription() {
  const q = useQuery({
    queryKey: ["subscription"],
    queryFn: async (): Promise<SubscriptionRow | null> => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          "status, trial_ends_at, current_period_end, stripe_customer_id, stripe_subscription_id",
        )
        .maybeSingle();
      if (error) throw error;
      return (data as SubscriptionRow) ?? null;
    },
    staleTime: 30_000,
  });

  const sub = q.data ?? null;
  const now = Date.now();
  const trialEnds = sub?.trial_ends_at ? new Date(sub.trial_ends_at).getTime() : 0;

  const rawStatus = sub?.status ?? "none";
  const status: SubscriptionStatus = (
    ["trialing", "active", "past_due", "canceled"].includes(rawStatus) ? rawStatus : "none"
  ) as SubscriptionStatus;

  const inTrial = status === "trialing" && trialEnds > now;
  const isActive = status === "active" || inTrial;
  const trialDaysLeft = inTrial ? Math.max(0, Math.ceil((trialEnds - now) / 86_400_000)) : 0;

  return {
    subscription: sub,
    status,
    loading: q.isLoading,
    isActive,
    inTrial,
    /** true nur bei echtem bezahltem Abo */
    isPro: status === "active",
    hasAccess: isActive,
    trialDaysLeft,
    refetch: q.refetch,
  };
}
