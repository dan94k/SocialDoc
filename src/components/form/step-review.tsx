"use client";

import { useContractStore } from "@/stores/contract-store";
import { CONTENT_TYPES, AUXILIARY_SERVICES } from "@/lib/constants";
import { formatBRL } from "@/lib/utils";
import { User, UserCheck, Monitor, FileText, CreditCard, Shield, Clock } from "lucide-react";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm py-1.5 border-b last:border-0">
      <span className="text-muted-foreground shrink-0">{label}</span>
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

export default function StepReview() {
  const { data } = useContractStore();
  const { clauses } = data;

  const contentTypeLabels = data.contentTypes.map((id) => {
    const ct = CONTENT_TYPES.find((c) => c.id === id);
    return ct ? ct.label : id;
  });

  const auxLabels = data.auxiliaryServices.map((id) => {
    const s = AUXILIARY_SERVICES.find((a) => a.id === id);
    return s ? s.label : id;
  });

  const activeClauses = [
    clauses.revision.enabled && "Revisões",
    clauses.approval.enabled && "Aprovação",
    clauses.scopeExtras.enabled && "Extras de escopo",
    clauses.cancellation.enabled && "Cancelamento",
    clauses.filesPayment.enabled && "Arquivos e pagamento",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Resumo do contrato</h2>
        <p className="text-sm text-muted-foreground">
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

      <Section icon={Monitor} title="Plataformas">
        <Row label="Plataformas" value={data.platforms.join(", ") || "—"} />
      </Section>

      <Section icon={FileText} title="Escopo">
        <Row
          label="Conteúdo"
          value={contentTypeLabels.length ? contentTypeLabels.join(", ") : "—"}
        />
        {auxLabels.length > 0 && (
          <Row label="Serviços extras" value={auxLabels.join(", ")} />
        )}
      </Section>

      <Section icon={CreditCard} title="Pagamento">
        <Row label="Valor mensal" value={formatBRL(data.monthlyPrice)} />
        <Row label="Vencimento" value={`Dia ${data.paymentDueDay} de cada mês`} />
        {data.pixKey && <Row label="Chave PIX" value={data.pixKey} />}
      </Section>

      {activeClauses.length > 0 && (
        <Section icon={Shield} title="Cláusulas ativas">
          <Row label="Incluídas" value={activeClauses.join(", ")} />
          {clauses.revision.enabled && (
            <Row
              label="Revisões"
              value={`${clauses.revision.maxRevisions} por entrega`}
            />
          )}
          {clauses.cancellation.enabled && (
            <Row
              label="Cancelamento"
              value={`${clauses.cancellation.noticeDays} dias de aviso · ${clauses.cancellation.penaltyPercent}% multa`}
            />
          )}
        </Section>
      )}

      <Section icon={Clock} title="Duração">
        <Row
          label="Vigência"
          value={`${data.durationMonths} ${data.durationMonths === 1 ? "mês" : "meses"}`}
        />
      </Section>
    </div>
  );
}
