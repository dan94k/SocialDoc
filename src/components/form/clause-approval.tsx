"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";
import ClauseNumberField from "./clause-number-field";

export default function ClauseApproval() {
  const { data, setClauseField } = useContractStore();
  const clause = data.clauses.approval;

  return (
    <ClauseShell
      title="Prazo de aprovação"
      description="Tempo que o cliente tem para aprovar ou pedir alterações no material."
      insight="Sem essa cláusula, o cliente pode ficar semanas sem responder e depois dizer que não aprovou. Com ela, o silêncio vira aprovação automática — o que evita atrasos no seu cronograma de publicação."
      enabled={clause.enabled}
      onToggle={(v) => setClauseField("approval", "enabled", v)}
    >
      <ClauseNumberField
        label="Prazo para aprovação ou solicitação de revisão"
        value={clause.deadlineDays}
        onChange={(v) => setClauseField("approval", "deadlineDays", v)}
        min={1}
        suffix={clause.deadlineDays === 1 ? "dia útil" : "dias úteis"}
      />
      <p className="text-xs text-muted-foreground">
        Após esse prazo sem resposta, o material é considerado automaticamente aprovado.
      </p>
    </ClauseShell>
  );
}
