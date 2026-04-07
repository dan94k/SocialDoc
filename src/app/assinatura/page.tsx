import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import SubscriptionTab from "@/components/dashboard/subscription-tab";

export default async function AssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const params = await searchParams;
  const showSubscribedBanner = params.subscribed === "1";

  const [subscriptionInfo, purchasesResult] = await Promise.all([
    getSubscription(supabase, user.id),
    supabase
      .from("purchases")
      .select("id, created_at, type, amount_brl, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const subscription = subscriptionInfo.isActive ? subscriptionInfo : null;
  const purchases = purchasesResult.data ?? [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Assinatura & Gastos</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seu plano e veja o histórico de pagamentos.
        </p>
      </div>

      <SubscriptionTab
        subscription={subscription}
        purchases={purchases}
        showSubscribedBanner={showSubscribedBanner}
      />
    </main>
  );
}
