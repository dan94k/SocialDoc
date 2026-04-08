"use client";

import Link from "next/link";
import { Check, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: null,
    description: "Para testar e conhecer",
    features: [
      "Contrato completo em PDF",
      "Todas as cláusulas disponíveis",
      "Marca d'água no documento",
    ],
    highlighted: false,
    cta: "Começar grátis",
    href: "/contrato",
    icon: null,
    badge: null,
  },
  {
    name: "Ilimitado Mensal",
    price: "R$ 10",
    period: "/mês",
    description: "Contratos sem limite, sem marca d'água",
    features: [
      "Contratos ilimitados sem marca d'água",
      "Todas as cláusulas disponíveis",
      "Cancele quando quiser",
      "Ideal para fechar contratos todo mês",
    ],
    highlighted: true,
    cta: "Assinar agora",
    href: "/assinar",
    icon: Crown,
    badge: "Mais popular",
  },
];

export default function Pricing() {
  return (
    <section className="px-4 py-24" style={{ background: "#f5f3ef" }}>
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "#050b18", color: "#d4ff00" }}
          >
            Preços
          </div>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4"
            style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
          >
            Simples e transparente.
          </h2>
          <p
            className="text-base max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(5,11,24,0.5)" }}
          >
            Comece grátis e proteja seu primeiro contrato hoje. Assine para
            trabalhar sem limites.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-2 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl p-7 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1"
              style={
                plan.highlighted
                  ? {
                      background: "#050b18",
                      boxShadow:
                        "0 20px 60px rgba(5,11,24,0.25), 0 0 0 1px rgba(212,255,0,0.15)",
                    }
                  : {
                      background: "#ffffff",
                      border: "1px solid rgba(5,11,24,0.08)",
                      boxShadow: "0 2px 20px rgba(5,11,24,0.05)",
                    }
              }
            >
              {/* Plan name + badge */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {plan.icon && (
                    <plan.icon
                      className="h-4 w-4"
                      style={{ color: plan.highlighted ? "#d4ff00" : "#050b18" }}
                    />
                  )}
                  <span
                    className="text-base font-bold"
                    style={{ color: plan.highlighted ? "#ffffff" : "#050b18" }}
                  >
                    {plan.name}
                  </span>
                  {plan.badge && (
                    <span
                      className="ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{ background: "#d4ff00", color: "#050b18" }}
                    >
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p
                  className="text-sm"
                  style={{
                    color: plan.highlighted
                      ? "rgba(255,255,255,0.45)"
                      : "rgba(5,11,24,0.45)",
                  }}
                >
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span
                  className="text-4xl font-black"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: plan.highlighted ? "#d4ff00" : "#050b18",
                  }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: plan.highlighted
                        ? "rgba(212,255,0,0.6)"
                        : "rgba(5,11,24,0.4)",
                    }}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <span
                      className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        background: plan.highlighted
                          ? "rgba(212,255,0,0.15)"
                          : "rgba(5,11,24,0.08)",
                      }}
                    >
                      <Check
                        className="h-2.5 w-2.5"
                        style={{ color: plan.highlighted ? "#d4ff00" : "#050b18" }}
                      />
                    </span>
                    <span
                      style={{
                        color: plan.highlighted
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(5,11,24,0.65)",
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className="block w-full text-center rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={
                  plan.highlighted
                    ? {
                        background: "#d4ff00",
                        color: "#050b18",
                        boxShadow: "0 0 24px rgba(212,255,0,0.2)",
                      }
                    : {
                        background: "#050b18",
                        color: "#ffffff",
                      }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Reassurance line */}
        <p
          className="text-center text-sm mt-8"
          style={{ color: "rgba(5,11,24,0.35)" }}
        >
          Sem compromisso. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
}
