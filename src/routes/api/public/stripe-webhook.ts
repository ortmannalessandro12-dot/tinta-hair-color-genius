import { createFileRoute } from "@tanstack/react-router";
import type Stripe from "stripe";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const sig = request.headers.get("stripe-signature");
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!sig || !webhookSecret) {
          return new Response("Missing signature or secret", { status: 400 });
        }

        const { getStripe } = await import("@/lib/stripe.server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const stripe = getStripe();
        const rawBody = await request.text();

        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
        } catch (err) {
          console.error("[stripe-webhook] signature verification failed", err);
          return new Response("Invalid signature", { status: 400 });
        }

        function mapStatus(s: Stripe.Subscription.Status): string {
          switch (s) {
            case "trialing":
              return "trialing";
            case "active":
              return "active";
            case "past_due":
            case "unpaid":
              return "past_due";
            case "canceled":
            case "incomplete_expired":
              return "canceled";
            default:
              return s;
          }
        }

        async function upsertFromSubscription(sub: Stripe.Subscription) {
          const userId =
            (sub.metadata?.supabase_user_id as string | undefined) ??
            (await (async () => {
              const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
              const { data } = await supabaseAdmin
                .from("subscriptions")
                .select("user_id")
                .eq("stripe_customer_id", customerId)
                .maybeSingle();
              return data?.user_id;
            })());
          if (!userId) {
            console.error("[stripe-webhook] no user mapping for subscription", sub.id);
            return;
          }
          const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
          const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
          await supabaseAdmin
            .from("subscriptions")
            .upsert(
              {
                user_id: userId,
                stripe_customer_id: customerId,
                stripe_subscription_id: sub.id,
                status: mapStatus(sub.status),
                current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
                trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
              },
              { onConflict: "user_id" },
            );
        }

        try {
          switch (event.type) {
            case "checkout.session.completed": {
              const session = event.data.object as Stripe.Checkout.Session;
              if (session.subscription) {
                const subId =
                  typeof session.subscription === "string"
                    ? session.subscription
                    : session.subscription.id;
                const sub = await stripe.subscriptions.retrieve(subId);
                const userId =
                  (session.metadata?.supabase_user_id as string | undefined) ??
                  (session.client_reference_id as string | undefined);
                if (userId && !sub.metadata?.supabase_user_id) {
                  sub.metadata = { ...sub.metadata, supabase_user_id: userId };
                }
                await upsertFromSubscription(sub);
              }
              break;
            }
            case "customer.subscription.updated":
            case "customer.subscription.created": {
              await upsertFromSubscription(event.data.object as Stripe.Subscription);
              break;
            }
            case "customer.subscription.deleted": {
              const sub = event.data.object as Stripe.Subscription;
              await supabaseAdmin
                .from("subscriptions")
                .update({ status: "canceled" })
                .eq("stripe_subscription_id", sub.id);
              break;
            }
            case "invoice.payment_failed": {
              const inv = event.data.object as unknown as {
                subscription?: string | { id: string } | null;
              };
              const subRef = inv.subscription;
              const subId = typeof subRef === "string" ? subRef : subRef?.id;
              if (subId) {
                await supabaseAdmin
                  .from("subscriptions")
                  .update({ status: "past_due" })
                  .eq("stripe_subscription_id", subId);
              }
              break;
            }
            default:
              break;
          }
        } catch (err) {
          console.error("[stripe-webhook] handler error", event.type, err);
          return new Response("Handler error", { status: 500 });
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
