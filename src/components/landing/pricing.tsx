import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    description: "Para testar e conhecer",
    features: [
      "Contrato completo em PDF",
      "Todas as clausulas disponiveis",
      "Marca d'agua no documento",
    ],
    highlighted: false,
    cta: "Criar contrato gratis",
  },
  {
    name: "Profissional",
    price: "R$ 5",
    description: "Contrato limpo e profissional",
    features: [
      "Contrato completo em PDF",
      "Todas as clausulas disponiveis",
      "Sem marca d'agua",
      "Pronto para enviar ao cliente",
    ],
    highlighted: true,
    cta: "Criar contrato profissional",
  },
];

export default function Pricing() {
  return (
    <section className="px-4 py-20 bg-muted/30">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold">Simples e transparente</h2>
        <p className="mt-3 text-center text-muted-foreground">
          Sem mensalidade, sem surpresas. Pague apenas quando precisar.
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
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="text-3xl font-bold">{plan.price}</div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contrato"
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
