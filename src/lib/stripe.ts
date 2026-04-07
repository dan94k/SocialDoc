import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export const PRICE_IDS = {
  subscription: "price_1TJIl5GgPPRZ86mX5eH0W45U",
} as const;

export type PurchaseType = keyof typeof PRICE_IDS;
