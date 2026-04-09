"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";
import ClauseNumberField from "./clause-number-field";
import type { PackageClauses } from "@/types/contract";

export default function ClausePackageCancellation() {
  const { data, setField } = useContractStore();
  const clauses = data.packageClauses!;
  const clause = clauses.cancellation;

  const update = (field: keyof PackageClauses["cancellation"], value: unknown) => {
    setField("packageClauses", {
      ...clauses,
      cancellation: { ...clause, [field]: value },
    });
  };

  return (
    <ClauseShell
      title="Cancelamento"
      description="O que acontece se o projeto for cancelado após o início?"
      insight="Em pacotes pontuais, parte do trabalho já pode estar feita quando o cliente cancela. Definir uma multa protege o seu tempo investido e desencoraja cancelamentos de última hora."
      enabled={clause.enabled}
      onToggle={(v) => update("enabled", v)}
    >
      <ClauseNumberField
        label="Multa por cancelamento após início"
        value={clause.penaltyPercent}
        onChange={(v) => update("penaltyPercent", Math.min(100, v))}
        min={1}
        suffix="% do valor total"
      />

      <p className="text-xs" style={{ color: "rgba(5,11,24,0.5)" }}>
        O material já produzido até a data do cancelamento permanece com o CONTRATANTE.
      </p>
    </ClauseShell>
  );
}
