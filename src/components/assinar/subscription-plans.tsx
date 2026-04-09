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
      <div
        className="rounded-3xl p-6 space-y-5"
        style={{
          background: "#050b18",
          boxShadow: "0 20px 60px rgba(5,11,24,0.2), 0 0 0 1px rgba(212,255,0,0.12)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(212,255,0,0.12)" }}
            >
              <Crown className="h-4 w-4" style={{ color: "#d4ff00" }} />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: "#ffffff" }}>
                Ilimitado Mensal
              </h3>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                Contratos sem limite
              </p>
            </div>
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{ background: "#d4ff00", color: "#050b18" }}
          >
            Popular
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span
            className="text-4xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "#d4ff00" }}
          >
            R$ 10
          </span>
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>/mês</span>
        </div>

        {/* Features */}
        <ul className="space-y-2.5">
          {[
            "Contratos ilimitados sem faixa de avaliação",
            "Cancele quando quiser",
            "Todas as cláusulas disponíveis",
            "Ideal para quem fecha contratos todo mês",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm">
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(212,255,0,0.15)" }}
              >
                <Check className="h-2.5 w-2.5" style={{ color: "#d4ff00" }} />
              </span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {isSubscribed ? (
          <div
            className="w-full rounded-2xl px-4 py-3 text-center text-sm font-semibold"
            style={{
              background: "rgba(212,255,0,0.1)",
              border: "1px solid rgba(212,255,0,0.25)",
              color: "#d4ff00",
            }}
          >
            ✓ Assinatura ativa
          </div>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
            style={{ background: "#d4ff00", color: "#050b18" }}
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
