"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";
import ClauseNumberField from "./clause-number-field";
import { Input } from "@/components/ui/input";
import type { PackageClauses } from "@/types/contract";

export default function ClausePackageRevision() {
  const { data, setField } = useContractStore();
  const clauses = data.packageClauses!;
  const clause = clauses.revision;

  const update = (field: keyof PackageClauses["revision"], value: unknown) => {
    setField("packageClauses", {
      ...clauses,
      revision: { ...clause, [field]: value },
    });
  };

  return (
    <ClauseShell
      title="Limite de revisões"
      description="Quantas vezes o cliente pode pedir alterações após a entrega?"
      insight="Em pacotes pontuais revisões ilimitadas podem consumir muito tempo. Deixar claro o número de rodadas de ajuste protege você e alinha a expectativa do cliente desde o início."
      enabled={clause.enabled}
      onToggle={(v) => update("enabled", v)}
    >
      <ClauseNumberField
        label="Máximo de revisões por peça"
        value={clause.maxRevisions}
        onChange={(v) => update("maxRevisions", v)}
        min={1}
        suffix={clause.maxRevisions === 1 ? "revisão" : "revisões"}
      />

      <ClauseNumberField
        label="Prazo para o cliente enviar o pedido de ajuste"
        value={clause.requestDays}
        onChange={(v) => update("requestDays", v)}
        min={1}
        suffix={clause.requestDays === 1 ? "dia útil após entrega" : "dias úteis após entrega"}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>Cobrar por revisão extra?</p>
        <div className="flex gap-2">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => update("chargeExtra", val)}
              className="flex-1 rounded-2xl py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
              style={
                clause.chargeExtra === val
                  ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                  : { background: "transparent", color: "rgba(5,11,24,0.6)", border: "1px solid rgba(5,11,24,0.15)" }
              }
            >
              {val ? "Sim" : "Não"}
            </button>
          ))}
        </div>
      </div>

      {clause.chargeExtra && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "#050b18" }}>Valor por revisão extra</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "rgba(5,11,24,0.4)" }}>
              R$
            </span>
            <Input
              type="number"
              min={0}
              step={10}
              placeholder="50"
              value={clause.extraValue || ""}
              onChange={(e) => update("extraValue", Number(e.target.value))}
              className="pl-9"
            />
          </div>
        </div>
      )}
    </ClauseShell>
  );
}
