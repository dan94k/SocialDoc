"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseNumberField from "./clause-number-field";
import { CalendarClock } from "lucide-react";

export default function StepPackageDeadline() {
  const { data, setField } = useContractStore();
  const days = data.packageDeliveryDays ?? 14;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "rgba(5,11,24,0.07)" }}
        >
          <CalendarClock className="h-5 w-5" style={{ color: "#050b18" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#050b18" }}>Prazo de entrega</h2>
          <p className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>
            Em quantos dias úteis o pacote será entregue?
          </p>
        </div>
      </div>

      <ClauseNumberField
        label="Prazo contado a partir do recebimento do briefing"
        value={days}
        onChange={(v) => setField("packageDeliveryDays", v)}
        min={1}
        suffix={days === 1 ? "dia útil" : "dias úteis"}
      />

      <div
        className="rounded-2xl p-3 text-sm"
        style={{
          background: "rgba(5,11,24,0.04)",
          border: "1px solid rgba(5,11,24,0.08)",
          color: "rgba(5,11,24,0.6)",
        }}
      >
        O prazo começa a contar a partir da data de assinatura do contrato e do recebimento do briefing completo pelo CONTRATANTE.
      </div>
    </div>
  );
}
