"use client";

import { useContractStore } from "@/stores/contract-store";
import { PACKAGE_ART_TYPES } from "@/lib/constants";
import ClauseNumberField from "./clause-number-field";
import { Package } from "lucide-react";

export default function StepPackageScope() {
  const { data, setField } = useContractStore();
  const selected = data.packageArtTypes ?? [];
  const total = data.packageTotalItems ?? 10;

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((t) => t !== id)
      : [...selected, id];
    setField("packageArtTypes", next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "rgba(5,11,24,0.07)" }}
        >
          <Package className="h-5 w-5" style={{ color: "#050b18" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#050b18" }}>Pacote de serviços</h2>
          <p className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>
            Que tipo de conteúdo está incluso neste pacote?
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>Tipos de arte / entregáveis</p>
        <div className="flex flex-wrap gap-2">
          {PACKAGE_ART_TYPES.map((type) => {
            const active = selected.includes(type.id);
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => toggle(type.id)}
                className="rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                style={
                  active
                    ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                    : { background: "transparent", color: "rgba(5,11,24,0.6)", border: "1px solid rgba(5,11,24,0.2)" }
                }
              >
                {type.label}
              </button>
            );
          })}
        </div>
        {selected.length === 0 && (
          <p className="text-xs" style={{ color: "rgba(5,11,24,0.4)" }}>
            Selecione ao menos um tipo de entregável.
          </p>
        )}
      </div>

      <ClauseNumberField
        label="Quantidade total de peças no pacote"
        value={total}
        onChange={(v) => setField("packageTotalItems", v)}
        min={1}
        suffix={total === 1 ? "peça" : "peças"}
      />
    </div>
  );
}
