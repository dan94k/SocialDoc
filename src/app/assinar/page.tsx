import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText } from "lucide-react";
import SubscriptionPlans from "@/components/assinar/subscription-plans";
import SignOutButton from "@/components/dashboard/sign-out-button";

export default async function AssinarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  const isSubscribed = !!subscription;
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
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            {avatar && (
              <img src={avatar} alt="Avatar" className="h-8 w-8 rounded-full border" />
            )}
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Escolha seu plano</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Gere contratos profissionais para proteger seu trabalho como social media freelancer.
          </p>
        </div>

        <SubscriptionPlans isSubscribed={isSubscribed} />
      </main>
    </div>
  );
}
