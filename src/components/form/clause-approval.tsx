"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";
import ClauseNumberField from "./clause-number-field";

export default function ClauseApproval() {
  const { data, setClauseField } = useContractStore();
  const clause = data.clauses.approval;

  return (
    <ClauseShell
      title="Prazo de aprovacao"
      description="Tempo que o cliente tem para aprovar ou pedir alteracoes no material."
      insight="Sem essa clausula, o cliente pode ficar semanas sem responder e depois dizer que nao aprovou. Com ela, o silencio vira aprovacao automatica — o que evita atrasos no seu cronograma de publicacao."
      enabled={clause.enabled}
      onToggle={(v) => setClauseField("approval", "enabled", v)}
    >
      <ClauseNumberField
        label="Prazo para aprovacao ou solicitacao de revisao"
        value={clause.deadlineDays}
        onChange={(v) => setClauseField("approval", "deadlineDays", v)}
        min={1}
        suffix={clause.deadlineDays === 1 ? "dia util" : "dias uteis"}
      />
      <p className="text-xs text-muted-foreground">
        Apos esse prazo sem resposta, o material e considerado automaticamente aprovado.
      </p>
    </ClauseShell>
  );
}
