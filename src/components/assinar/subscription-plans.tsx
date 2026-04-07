"use client";

import { useState } from "react";
import { Check, Crown, Loader2 } from "lucide-react";

interface Props {
  isSubscribed: boolean;
}

export default function SubscriptionPlans({ isSubscribed }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1TJIl5GgPPRZ86mX5eH0W45U",
          type: "subscription",
        }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch {
      alert("Erro ao iniciar pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 max-w-sm mx-auto">
      {/* Monthly subscription */}
      <div
        className="rounded-xl border-2 border-primary bg-primary/5 p-6 space-y-5 shadow-lg"
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
            onClick={handleCheckout}
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
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
