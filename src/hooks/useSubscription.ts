import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionRow = {
  status: "trialing" | "active" | "past_due" | "canceled" | string;
  trial_ends_at: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

export function useSubscription() {
  const q = useQuery({
    queryKey: ["subscription"],
    queryFn: async (): Promise<SubscriptionRow | null> => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("status, trial_ends_at, current_period_end, stripe_customer_id, stripe_subscription_id")
        .maybeSingle();
      if (error) throw error;
      return (data as SubscriptionRow) ?? null;
    },
    staleTime: 30_000,
  });

  const sub = q.data;
  const now = Date.now();
  const trialEnds = sub?.trial_ends_at ? new Date(sub.trial_ends_at).getTime() : 0;
  const inTrial = sub?.status === "trialing" && trialEnds > now;
  const isActive = sub?.status === "active";
  const hasAccess = inTrial || isActive;
  const trialDaysLeft = inTrial ? Math.max(0, Math.ceil((trialEnds - now) / 86_400_000)) : 0;

  return {
    subscription: sub,
    loading: q.isLoading,
    hasAccess,
    inTrial,
    isActive,
    trialDaysLeft,
    refetch: q.refetch,
  };
}
