import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import SignOutButton from "@/components/dashboard/sign-out-button";
import DashboardTabs from "@/components/dashboard/dashboard-tabs";

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

  const [contractsResult, subscriptionResult, purchasesResult] = await Promise.all([
    supabase
      .from("contracts")
      .select("id, created_at, client_name, data")
      .order("created_at", { ascending: false }),
    supabase
      .from("subscriptions")
      .select("status, current_period_end, stripe_customer_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle(),
    supabase
      .from("purchases")
      .select("id, created_at, type, amount_brl, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const contracts = contractsResult.data ?? [];
  const subscription = subscriptionResult.data ?? null;
  const purchases = purchasesResult.data ?? [];

  const name = user.user_metadata?.full_name?.split(" ")[0] ?? "você";
  const avatar = user.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FileText className="h-5 w-5 text-primary" />
            SocialDoc
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/contrato"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Novo contrato
            </Link>
            {avatar && (
              <img src={avatar} alt={name} className="h-8 w-8 rounded-full border" />
            )}
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-10">
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
    </div>
  );
}
