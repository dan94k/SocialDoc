import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardTabs from "@/components/dashboard/dashboard-tabs";
import { getSubscription } from "@/lib/subscription";

export default async function DashboardPage({
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

  const [contractsResult, subscriptionInfo, purchasesResult] = await Promise.all([
    supabase
      .from("contracts")
      .select("id, created_at, client_name, data")
      .order("created_at", { ascending: false }),
    getSubscription(supabase, user.id),
    supabase
      .from("purchases")
      .select("id, created_at, type, amount_brl, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const contracts = contractsResult.data ?? [];
  const subscription = subscriptionInfo.isActive ? subscriptionInfo : null;
  const purchases = purchasesResult.data ?? [];

  const name = user.user_metadata?.full_name?.split(" ")[0] ?? "você";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Olá, {name}!</h1>
        <p className="text-muted-foreground mt-1">
          {contracts.length
            ? `Você tem ${contracts.length} contrato${contracts.length > 1 ? "s" : ""} gerado${contracts.length > 1 ? "s" : ""}.`
            : "Você ainda não gerou nenhum contrato."}
        </p>
      </div>

      <DashboardTabs
        contracts={contracts}
        subscription={subscription}
        purchases={purchases}
        showSubscribedBanner={showSubscribedBanner}
      />
    </main>
  );
}
