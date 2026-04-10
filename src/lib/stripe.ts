import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export const PRICE_IDS = {
  subscription: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
} as const;

export type PurchaseType = keyof typeof PRICE_IDS;
