import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";

function getServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  const supabase = getServiceRoleClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const priceId = session.metadata?.price_id;
      const type = session.metadata?.type as "single" | "subscription";

      if (!userId) break;

      await supabase.from("purchases").upsert(
        {
          user_id: userId,
          stripe_session_id: session.id,
          price_id: priceId ?? "",
          amount_brl: session.amount_total ?? 0,
          type: type ?? "single",
          status: "paid",
        },
        { onConflict: "stripe_session_id" }
      );
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id;
      if (!userId) break;

      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_subscription_id: sub.id,
          stripe_customer_id:
            typeof sub.customer === "string" ? sub.customer : sub.customer.id,
          status: sub.status,
          current_period_end: new Date(
            (sub as unknown as { current_period_end: number }).current_period_end * 1000
          ).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        },
        { onConflict: "stripe_subscription_id" }
      );
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;

      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", sub.id);
      break;
    }
  }

  return new Response("ok", { status: 200 });
}
