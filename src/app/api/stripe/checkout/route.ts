import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PRICE_IDS } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { priceId, type } = body as { priceId: string; type: "single" | "subscription" };

  const validPriceIds = Object.values(PRICE_IDS);
  if (!validPriceIds.includes(priceId as typeof PRICE_IDS[keyof typeof PRICE_IDS])) {
    return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  const successUrl =
    type === "single"
      ? `${origin}/contrato?session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/assinatura?subscribed=1`;

  const session = await stripe.checkout.sessions.create({
    mode: type === "single" ? "payment" : "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: `${origin}/contrato`,
    customer_email: user.email,
    metadata: {
      user_id: user.id,
      price_id: priceId,
      type,
    },
    ...(type === "subscription" && {
      subscription_data: {
        metadata: { user_id: user.id },
      },
    }),
  });

  return NextResponse.json({ url: session.url });
}
