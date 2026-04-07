import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubscriptionPlans from "@/components/assinar/subscription-plans";
import { getSubscription } from "@/lib/subscription";

export default async function AssinarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const subscriptionInfo = await getSubscription(supabase, user.id);
  const isSubscribed = subscriptionInfo.isActive;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 w-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Escolha seu plano</h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Gere contratos profissionais para proteger seu trabalho como social media freelancer.
        </p>
      </div>

      <SubscriptionPlans isSubscribed={isSubscribed} />
    </main>
  );
}
