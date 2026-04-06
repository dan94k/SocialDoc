"use client";

import { useState } from "react";
import { Check, Crown, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContractStore } from "@/stores/contract-store";

interface Props {
  isSubscribed: boolean;
}

export default function SubscriptionPlans({ isSubscribed }: Props) {
  const [loading, setLoading] = useState<"single" | "subscription" | null>(null);
  const saveToSession = useContractStore((s) => s.saveToSession);

  const handleCheckout = async (type: "single" | "subscription") => {
    setLoading(type);
    try {
      const priceId =
        type === "single"
          ? "price_1TJIlVGgPPRZ86mX8NBj3mL0"
          : "price_1TJIl5GgPPRZ86mX5eH0W45U";

      if (type === "single") {
        saveToSession();
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, type }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch {
      alert("Erro ao iniciar pagamento. Tente novamente.");
      setLoading(null);
    }
  };

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
      {/* Single contract */}
      <div className="rounded-xl border bg-background p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Contrato Único</h3>
            <p className="text-sm text-muted-foreground">Pague só quando precisar</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">R$ 5</span>
          <span className="text-muted-foreground text-sm">por contrato</span>
        </div>

        <ul className="space-y-2">
          {[
            "PDF profissional sem marca d'água",
            "Pronto para enviar ao cliente",
            "Todas as cláusulas disponíveis",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleCheckout("single")}
          disabled={loading !== null}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading === "single" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Pagar R$ 5,00"
          )}
        </button>
      </div>

      {/* Monthly subscription */}
      <div
        className={cn(
          "rounded-xl border-2 border-primary bg-primary/5 p-6 space-y-5 shadow-lg",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Ilimitado Mensal</h3>
              <p className="text-sm text-muted-foreground">Contratos sem limite</p>
            </div>
          </div>
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            Popular
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">R$ 10</span>
          <span className="text-muted-foreground text-sm">/mês</span>
        </div>

        <ul className="space-y-2">
          {[
            "Contratos ilimitados sem marca d'água",
            "Cancele quando quiser",
            "Todas as cláusulas disponíveis",
            "Ideal para quem fecha contratos todo mês",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {isSubscribed ? (
          <div className="w-full rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-center text-sm font-medium text-green-800">
            Assinatura ativa
          </div>
        ) : (
          <button
            onClick={() => handleCheckout("subscription")}
            disabled={loading !== null}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading === "subscription" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Assinar por R$ 10/mês"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
