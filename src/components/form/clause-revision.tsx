"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";
import ClauseNumberField from "./clause-number-field";
import { Input } from "@/components/ui/input";

export default function ClauseRevision() {
  const { data, setClauseField } = useContractStore();
  const clause = data.clauses.revision;

  return (
    <ClauseShell
      title="Limite de revisoes"
      description="Quantas vezes o cliente pode pedir alteracoes em cada peca?"
      insight="Sem esse limite, o cliente pode pedir infinitas revisoes sem pagar nada a mais. Na pratica voce raramente vai cobrar — mas ter no contrato ja faz o cliente pensar duas vezes antes de pedir a decima mudanca."
      enabled={clause.enabled}
      onToggle={(v) => setClauseField("revision", "enabled", v)}
    >
      <ClauseNumberField
        label="Maximo de revisoes por peca"
        value={clause.maxRevisions}
        onChange={(v) => setClauseField("revision", "maxRevisions", v)}
        min={1}
        suffix={clause.maxRevisions === 1 ? "revisao" : "revisoes"}
      />

      <ClauseNumberField
        label="Prazo para o cliente enviar o pedido de ajuste"
        value={clause.adjustmentDays}
        onChange={(v) => setClauseField("revision", "adjustmentDays", v)}
        min={1}
        suffix={clause.adjustmentDays === 1 ? "dia util" : "dias uteis"}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Cobrar por revisao extra?</p>
        <div className="flex gap-2">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setClauseField("revision", "chargeExtra", val)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                clause.chargeExtra === val
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              {val ? "Sim" : "Nao"}
            </button>
          ))}
        </div>
      </div>

      {clause.chargeExtra && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Valor por revisao extra</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              R$
            </span>
            <Input
              type="number"
              min={0}
              step={10}
              placeholder="100"
              value={clause.extraValue || ""}
              onChange={(e) => setClauseField("revision", "extraValue", Number(e.target.value))}
              className="pl-9"
            />
          </div>
        </div>
      )}
    </ClauseShell>
  );
}
