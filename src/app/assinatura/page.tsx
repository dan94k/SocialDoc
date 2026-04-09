import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import SubscriptionTab from "@/components/dashboard/subscription-tab";
import { CreditCard } from "lucide-react";

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
    <main style={{ background: "#f5f3ef", minHeight: "100vh" }}>
      {/* Dark header band */}
      <div
        style={{
          background: "linear-gradient(135deg, #050b18 0%, #081020 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        >
          <div className="mx-auto max-w-5xl px-4 py-10 w-full">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(212,255,0,0.12)" }}
              >
                <CreditCard className="h-4 w-4" style={{ color: "#d4ff00" }} />
              </div>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#d4ff00" }}
              >
                Assinatura
              </p>
            </div>
            <h1
              className="text-3xl md:text-4xl font-extrabold"
              style={{ fontFamily: "var(--font-display)", color: "#ffffff" }}
            >
              Assinatura & Gastos
            </h1>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.42)" }}>
              Gerencie seu plano e veja o histórico de pagamentos.
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mx-auto max-w-5xl px-4 py-10 w-full">
        <SubscriptionTab
          subscription={subscription}
          purchases={purchases}
          showSubscribedBanner={showSubscribedBanner}
        />
      </div>
    </main>
  );
}
