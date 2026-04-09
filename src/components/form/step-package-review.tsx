"use client";

import { useContractStore } from "@/stores/contract-store";
import { PACKAGE_ART_TYPES } from "@/lib/constants";
import { formatBRL } from "@/lib/utils";
import { User, UserCheck, Package, CreditCard, CalendarClock, Shield } from "lucide-react";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm py-1.5 border-b last:border-0">
      <span className="shrink-0" style={{ color: "rgba(5,11,24,0.5)" }}>{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-4 space-y-1"
      style={{ border: "1px solid rgba(5,11,24,0.09)", background: "rgba(5,11,24,0.01)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" style={{ color: "rgba(5,11,24,0.4)" }} />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      {children}
    </div>
  );
}

function docLabel(type: string | null, doc: string) {
  if (type === "nao-fornecer") return "Não fornecido";
  if (!type || !doc) return "—";
  return `${type.toUpperCase()}: ${doc}`;
}

const PAYMENT_LABELS: Record<string, string> = {
  split: "50% no início + 50% na entrega",
  upfront: "100% antes de começar",
  onDelivery: "100% na entrega",
};

export default function StepPackageReview() {
  const { data } = useContractStore();
  const clauses = data.packageClauses!;

  const artTypeLabels = (data.packageArtTypes ?? []).map((id) => {
    const t = PACKAGE_ART_TYPES.find((a) => a.id === id);
    return t ? t.label : id;
  });

  const activeClauses = [
    clauses.revision.enabled && "Revisões",
    clauses.cancellation.enabled && "Cancelamento",
    clauses.filesPayment.enabled && "Arquivos editáveis",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#050b18" }}>Resumo do contrato</h2>
        <p className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>
          Confira os dados antes de gerar o PDF.
        </p>
      </div>

      <Section icon={User} title="Prestador de serviços">
        <Row label="Nome" value={data.freelancerName || "—"} />
        <Row label="Documento" value={docLabel(data.freelancerDocType, data.freelancerDoc)} />
      </Section>

      <Section icon={UserCheck} title="Cliente">
        <Row label="Nome" value={data.clientName || "—"} />
        <Row label="Documento" value={docLabel(data.clientDocType, data.clientDoc)} />
      </Section>

      <Section icon={Package} title="Pacote de serviços">
        <Row label="Tipos de arte" value={artTypeLabels.length ? artTypeLabels.join(", ") : "—"} />
        <Row label="Quantidade total" value={`${data.packageTotalItems ?? 10} peças`} />
      </Section>

      <Section icon={CalendarClock} title="Prazo de entrega">
        <Row
          label="Entrega em"
          value={`${data.packageDeliveryDays ?? 14} dias úteis`}
        />
      </Section>

      <Section icon={CreditCard} title="Pagamento">
        <Row label="Valor total" value={formatBRL(data.packagePrice ?? 0)} />
        <Row label="Forma" value={PAYMENT_LABELS[data.packagePaymentType ?? "split"] ?? "—"} />
        {data.packagePixKey && <Row label="Chave PIX" value={data.packagePixKey} />}
      </Section>

      {activeClauses.length > 0 && (
        <Section icon={Shield} title="Cláusulas ativas">
          <Row label="Incluídas" value={activeClauses.join(", ")} />
          {clauses.revision.enabled && (
            <Row
              label="Revisões"
              value={`${clauses.revision.maxRevisions} por peça · ${clauses.revision.requestDays} dias para solicitar`}
            />
          )}
          {clauses.cancellation.enabled && (
            <Row label="Cancelamento" value={`${clauses.cancellation.penaltyPercent}% do valor total`} />
          )}
        </Section>
      )}
    </div>
  );
}
