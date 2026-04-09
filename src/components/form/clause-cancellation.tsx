"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";
import ClauseNumberField from "./clause-number-field";

export default function ClauseCancellation() {
  const { data, setClauseField } = useContractStore();
  const clause = data.clauses.cancellation;

  return (
    <ClauseShell
      title="Multa por cancelamento"
      description="Penalidade caso o cliente encerre o contrato sem aviso prévio suficiente."
      insight="Quando o cliente cancela do nada, você perde uma renda fixa que já estava no seu planejamento. A multa não é para punir — é para garantir tempo mínimo de reposição dessa receita. Na maioria dos casos o cliente dá o aviso só por causa dela."
      enabled={clause.enabled}
      onToggle={(v) => setClauseField("cancellation", "enabled", v)}
    >
      <ClauseNumberField
        label="Aviso prévio mínimo para cancelamento"
        value={clause.noticeDays}
        onChange={(v) => setClauseField("cancellation", "noticeDays", v)}
        min={1}
        suffix={clause.noticeDays === 1 ? "dia" : "dias"}
      />

      <ClauseNumberField
        label="Percentual da multa sobre o valor mensal"
        value={clause.penaltyPercent}
        onChange={(v) => setClauseField("cancellation", "penaltyPercent", v)}
        min={1}
        suffix="%"
      />

      <p className="text-xs text-muted-foreground">
        Multa aplicada quando o aviso for dado com menos de {clause.noticeDays}{" "}
        {clause.noticeDays === 1 ? "dia" : "dias"} de antecedência.
      </p>
    </ClauseShell>
  );
}
