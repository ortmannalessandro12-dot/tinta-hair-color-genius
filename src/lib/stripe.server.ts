// Server-only Stripe instance. Never import from client/route files at module scope.
import Stripe from "stripe";

export const TINTA_PRICE_ID = "price_1TnazXRZDgXSGDrUdHcsZJJq";

let _stripe: Stripe | undefined;
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  _stripe = new Stripe(key);
  return _stripe;
}
