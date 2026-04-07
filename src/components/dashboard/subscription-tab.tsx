"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/utils";
import { Crown, CreditCard, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Subscription {
  status: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  isFallback?: boolean;
}

interface Purchase {
  id: string;
  created_at: string;
  type: "single" | "subscription";
  amount_brl: number;
  status: string;
}

interface Props {
  subscription: Subscription | null;
  purchases: Purchase[];
}

export default function SubscriptionTab({ subscription, purchases }: Props) {
  const [loadingPortal, setLoadingPortal] = useState(false);

  const isActive = subscription?.status === "active";
  const isPastDue = subscription?.status === "past_due";

  const renewDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  const handlePortal = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch {
      alert("Erro ao abrir o portal. Tente novamente.");
      setLoadingPortal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan status card */}
      <div className="rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold text-base">Seu plano atual</h3>

        {isActive ? (
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Assinante Ilimitado</p>
                <p className="text-sm text-muted-foreground">
                  R$ 10,00/mês{renewDate ? ` · Renova em ${renewDate}` : ""}
                </p>
              </div>
            </div>
            {!subscription?.isFallback && subscription?.stripe_customer_id && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePortal}
                disabled={loadingPortal}
              >
                {loadingPortal ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    Gerenciar assinatura
                  </>
                )}
              </Button>
            )}
          </div>
        ) : isPastDue ? (
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-500/10 p-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="font-semibold">Pagamento pendente</p>
                <p className="text-sm text-muted-foreground">
                  Atualize seu pagamento para continuar usando.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handlePortal} disabled={loadingPortal}>
              {loadingPortal ? <Loader2 className="h-4 w-4 animate-spin" /> : "Regularizar"}
            </Button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">Plano Gratuito</p>
                <p className="text-sm text-muted-foreground">
                  Pague R$ 5 por contrato ou assine por R$ 10/mês.
                </p>
              </div>
            </div>
            <Link
              href="/assinar"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              <Crown className="h-4 w-4" />
              Assinar agora
            </Link>
          </div>
        )}
      </div>

      {/* Spending history */}
      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/30">
          <h3 className="font-semibold text-sm">Histórico de gastos</h3>
        </div>

        {purchases.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhuma compra realizada ainda.
          </div>
        ) : (
          <div className="divide-y">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium">
                      {purchase.type === "single"
                        ? "Contrato único"
                        : "Assinatura mensal"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(purchase.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatBRL(purchase.amount_brl / 100)}</p>
                  <span
                    className={`text-xs font-medium ${
                      purchase.status === "paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {purchase.status === "paid" ? "Pago" : "Pendente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
