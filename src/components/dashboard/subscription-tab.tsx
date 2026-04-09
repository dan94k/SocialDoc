"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/utils";
import {
  Crown,
  CreditCard,
  AlertCircle,
  Loader2,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Receipt,
} from "lucide-react";
import Link from "next/link";

interface Subscription {
  status: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  cancelAtPeriodEnd?: boolean;
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
  showSubscribedBanner?: boolean;
}

export default function SubscriptionTab({ subscription, purchases, showSubscribedBanner }: Props) {
  const [loadingPortal, setLoadingPortal] = useState(false);

  const isActive = !!subscription;
  const isPastDue = subscription?.status === "past_due";
  const isCanceling = subscription?.cancelAtPeriodEnd === true;

  const periodDate = subscription?.current_period_end
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
    <div className="space-y-5">

      {/* Banner de sucesso */}
      {showSubscribedBanner && (
        <div
          className="rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{
            background: "rgba(212,255,0,0.1)",
            border: "1px solid rgba(212,255,0,0.25)",
          }}
        >
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "#d4ff00" }} />
          <p className="text-sm font-semibold" style={{ color: "#050b18" }}>
            🎉 Assinatura ativada com sucesso! Você já pode gerar contratos ilimitados.
          </p>
        </div>
      )}

      {/* Card do plano atual */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(5,11,24,0.07)",
          boxShadow: "0 2px 16px rgba(5,11,24,0.05)",
        }}
      >
        {/* Header do card */}
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid rgba(5,11,24,0.07)" }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "rgba(5,11,24,0.4)" }}
          >
            Seu plano atual
          </p>
        </div>

        <div className="px-6 py-5">
          {isActive ? (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isCanceling ? "rgba(5,11,24,0.06)" : "#050b18",
                    border: isCanceling ? "1px solid rgba(5,11,24,0.1)" : "none",
                  }}
                >
                  <Crown
                    className="h-5 w-5"
                    style={{ color: isCanceling ? "rgba(5,11,24,0.35)" : "#d4ff00" }}
                  />
                </div>
                <div>
                  <p
                    className="font-bold text-base"
                    style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
                  >
                    {isCanceling ? "Assinatura cancelada" : "Ilimitado Mensal"}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "rgba(5,11,24,0.5)" }}>
                    {isCanceling
                      ? periodDate
                        ? `Acesso válido até ${periodDate}`
                        : "Assinatura cancelada"
                      : `R$ 10,00/mês${periodDate ? ` · Renova em ${periodDate}` : ""}`}
                  </p>
                </div>
              </div>
              {!subscription?.isFallback && subscription?.stripe_customer_id && (
                <button
                  onClick={handlePortal}
                  disabled={loadingPortal}
                  className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100"
                  style={{
                    background: "rgba(5,11,24,0.06)",
                    color: "#050b18",
                    border: "1px solid rgba(5,11,24,0.1)",
                  }}
                >
                  {loadingPortal ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      {isCanceling ? "Reativar assinatura" : "Gerenciar assinatura"}
                    </>
                  )}
                </button>
              )}
            </div>
          ) : isPastDue ? (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(234,179,8,0.1)" }}
                >
                  <AlertCircle className="h-5 w-5" style={{ color: "#ca8a04" }} />
                </div>
                <div>
                  <p
                    className="font-bold text-base"
                    style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
                  >
                    Pagamento pendente
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "rgba(5,11,24,0.5)" }}>
                    Atualize seu pagamento para continuar usando.
                  </p>
                </div>
              </div>
              <button
                onClick={handlePortal}
                disabled={loadingPortal}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                style={{ background: "#050b18", color: "#ffffff" }}
              >
                {loadingPortal ? <Loader2 className="h-4 w-4 animate-spin" /> : "Regularizar"}
              </button>
            </div>
          ) : (
            /* Plano gratuito */
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(5,11,24,0.06)" }}
                >
                  <CreditCard className="h-5 w-5" style={{ color: "rgba(5,11,24,0.4)" }} />
                </div>
                <div>
                  <p
                    className="font-bold text-base"
                    style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
                  >
                    Plano Gratuito
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "rgba(5,11,24,0.5)" }}>
                    Assine por R$ 10/mês para contratos ilimitados sem faixa de avaliação.
                  </p>
                </div>
              </div>
              <Link
                href="/assinar"
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: "#d4ff00",
                  color: "#050b18",
                  boxShadow: "0 0 20px rgba(212,255,0,0.15)",
                }}
              >
                <Crown className="h-4 w-4" />
                Assinar agora
              </Link>
            </div>
          )}
        </div>

        {/* Upsell para plano free */}
        {!isActive && !isPastDue && (
          <div
            className="mx-6 mb-5 rounded-2xl p-4"
            style={{
              background: "#050b18",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#d4ff00" }}
            >
              O que você ganha assinando
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Contratos ilimitados",
                "Sem faixa de avaliação",
                "Cancele quando quiser",
                "R$ 10/mês apenas",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span style={{ color: "#d4ff00" }} className="text-xs">✓</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Histórico de gastos */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(5,11,24,0.07)",
          boxShadow: "0 2px 16px rgba(5,11,24,0.05)",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center gap-2"
          style={{ borderBottom: "1px solid rgba(5,11,24,0.07)" }}
        >
          <Receipt className="h-4 w-4" style={{ color: "rgba(5,11,24,0.4)" }} />
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "rgba(5,11,24,0.4)" }}
          >
            Histórico de gastos
          </p>
        </div>

        {purchases.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CreditCard
              className="h-8 w-8 mx-auto mb-3"
              style={{ color: "rgba(5,11,24,0.2)" }}
            />
            <p className="text-sm font-medium" style={{ color: "rgba(5,11,24,0.4)" }}>
              Nenhuma compra realizada ainda.
            </p>
          </div>
        ) : (
          <div>
            {purchases.map((purchase, i) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between px-6 py-4"
                style={{
                  borderBottom:
                    i < purchases.length - 1
                      ? "1px solid rgba(5,11,24,0.05)"
                      : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(5,11,24,0.05)" }}
                  >
                    <CreditCard className="h-3.5 w-3.5" style={{ color: "rgba(5,11,24,0.4)" }} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#050b18" }}
                    >
                      {purchase.type === "single" ? "Contrato único" : "Assinatura mensal"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(5,11,24,0.4)" }}>
                      {new Date(purchase.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="text-sm font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
                  >
                    {formatBRL(purchase.amount_brl / 100)}
                  </p>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: purchase.status === "paid" ? "#16a34a" : "#ca8a04",
                    }}
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
