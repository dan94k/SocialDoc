import type { SupabaseClient } from "@supabase/supabase-js";

export interface SubscriptionInfo {
  isActive: boolean;
  status: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  /** true quando vem da tabela purchases como fallback (sem customer portal disponível) */
  isFallback: boolean;
}

/**
 * Verifica se o usuário tem assinatura ativa.
 * Primeiro consulta a tabela `subscriptions`. Se estiver vazia (webhook falhou),
 * faz fallback para a tabela `purchases` como garantia.
 */
export async function getSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<SubscriptionInfo> {
  // 1. Fonte primária: tabela subscriptions
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, stripe_customer_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (sub) {
    return {
      isActive: true,
      status: sub.status,
      current_period_end: sub.current_period_end,
      stripe_customer_id: sub.stripe_customer_id,
      isFallback: false,
    };
  }

  // 2. Fallback: tabela purchases (caso webhook não tenha chegado)
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("type", "subscription")
    .eq("status", "paid")
    .maybeSingle();

  if (purchase) {
    return {
      isActive: true,
      status: "active",
      current_period_end: null,
      stripe_customer_id: null,
      isFallback: true,
    };
  }

  return {
    isActive: false,
    status: null,
    current_period_end: null,
    stripe_customer_id: null,
    isFallback: false,
  };
}
