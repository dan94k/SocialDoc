import { ClipboardList, ShieldCheck, Download } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Preencha seus dados",
    description: "Responda algumas perguntas simples sobre voce e seu cliente.",
  },
  {
    icon: ShieldCheck,
    title: "Escolha as clausulas",
    description: "Selecione as protecoes que fazem sentido para o seu servico.",
  },
  {
    icon: Download,
    title: "Baixe o PDF",
    description: "Contrato profissional pronto para enviar ao seu cliente.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 py-20 bg-muted/30">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold">Como funciona</h2>
        <p className="mt-3 text-center text-muted-foreground">
          Tres passos simples para proteger seu trabalho.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
