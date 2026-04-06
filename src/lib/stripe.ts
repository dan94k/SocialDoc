import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export const PRICE_IDS = {
  single: "price_1TJIlVGgPPRZ86mX8NBj3mL0",
  subscription: "price_1TJIl5GgPPRZ86mX5eH0W45U",
} as const;

export type PurchaseType = keyof typeof PRICE_IDS;
