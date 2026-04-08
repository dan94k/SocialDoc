import { ClipboardList, ShieldCheck, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Preencha seus dados",
    description:
      "Responda algumas perguntas simples sobre você e seu cliente. Nome, serviço, valor e prazo.",
    accent: "#d4ff00",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Escolha as cláusulas",
    description:
      "Selecione as proteções que fazem sentido para o seu serviço: pagamento, revisões, cancelamento e mais.",
    accent: "#d4ff00",
  },
  {
    number: "03",
    icon: Download,
    title: "Baixe o PDF",
    description:
      "Contrato profissional formatado e pronto para enviar pelo WhatsApp ou assinar digitalmente.",
    accent: "#d4ff00",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="px-4 py-24"
      style={{ background: "#f5f3ef" }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5"
            style={{
              background: "#050b18",
              color: "#d4ff00",
              letterSpacing: "0.12em",
            }}
          >
            Como funciona
          </div>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
          >
            Três passos.
            <br />
            <span style={{ color: "#050b18", opacity: 0.45 }}>
              Contrato pronto.
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative rounded-3xl p-8 group transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(5,11,24,0.08)",
                boxShadow: "0 2px 20px rgba(5,11,24,0.05)",
              }}
            >
              {/* Large number */}
              <div
                className="text-7xl font-black leading-none mb-6 select-none"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(5,11,24,0.06)",
                  lineHeight: 1,
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "#050b18" }}
              >
                <step.icon className="h-5 w-5" style={{ color: "#d4ff00" }} />
              </div>

              {/* Text */}
              <h3
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(5,11,24,0.55)" }}
              >
                {step.description}
              </p>

              {/* Connector line (only between cards on desktop) */}
              {i < steps.length - 1 && (
                <div
                  className="absolute top-[4.5rem] -right-4 w-8 h-px hidden md:block"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg, #050b18 0, #050b18 4px, transparent 4px, transparent 8px)",
                    opacity: 0.2,
                    zIndex: 10,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
