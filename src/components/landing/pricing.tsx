"use client";

import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: null,
    description: "Para testar e conhecer",
    features: [
      "Contrato completo em PDF",
      "Todas as clausulas disponiveis",
      "Marca d'agua no documento",
    ],
    highlighted: false,
    cta: "Criar contrato gratis",
    href: "/contrato",
    icon: null,
  },
  {
    name: "Ilimitado Mensal",
    price: "R$ 10",
    period: "/mes",
    description: "Contratos sem limite",
    features: [
      "Contratos ilimitados sem marca d'agua",
      "Todas as clausulas disponiveis",
      "Cancele quando quiser",
      "Ideal para fechar contratos todo mes",
    ],
    highlighted: true,
    cta: "Assinar agora",
    href: "/assinar",
    icon: Crown,
  },
];

export default function Pricing() {
  return (
    <section className="px-4 py-20 bg-muted/30">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold">Simples e transparente</h2>
        <p className="mt-3 text-center text-muted-foreground">
          Comece gratis ou assine para gerar contratos profissionais sem limite.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-xl border p-6 space-y-4",
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "bg-background"
              )}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  {plan.icon && <plan.icon className="h-4 w-4 text-primary" />}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.highlighted && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={cn(
                  "block w-full text-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/80"
                    : "border border-border bg-background hover:bg-muted"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
