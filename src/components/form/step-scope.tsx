"use client";

import { useContractStore } from "@/stores/contract-store";
import { CONTENT_TYPES, AUXILIARY_SERVICES } from "@/lib/constants";

export default function StepScope() {
  const { data, toggleContentType, toggleAuxiliaryService, setField } = useContractStore();

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
        >
          Escopo dos serviços
        </h2>
        <p className="text-sm mt-1.5" style={{ color: "rgba(5,11,24,0.5)" }}>
          O que você vai produzir para {data.clientName || "o cliente"}?
        </p>
      </div>

      {/* Tipos de conteúdo */}
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>Tipos de conteúdo</p>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((ct) => {
            const selected = data.contentTypes.includes(ct.id);
            return (
              <button
                key={ct.id}
                type="button"
                onClick={() => toggleContentType(ct.id)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                style={
                  selected
                    ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                    : { background: "transparent", color: "rgba(5,11,24,0.65)", border: "1px solid rgba(5,11,24,0.18)" }
                }
              >
                {ct.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantidade total de peças */}
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>Quantidade total de peças por mês</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setField("totalPieces", Math.max(1, data.totalPieces - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-medium transition-all duration-200 hover:scale-[1.05]"
            style={{ border: "1px solid rgba(5,11,24,0.15)", background: "transparent", color: "#050b18" }}
          >
            −
          </button>
          <span className="text-2xl font-bold min-w-[2.5rem] text-center" style={{ color: "#050b18", fontFamily: "var(--font-display)" }}>
            {data.totalPieces}
          </span>
          <button
            type="button"
            onClick={() => setField("totalPieces", data.totalPieces + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-medium transition-all duration-200 hover:scale-[1.05]"
            style={{ border: "1px solid rgba(5,11,24,0.15)", background: "transparent", color: "#050b18" }}
          >
            +
          </button>
          <span className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>peças / mês</span>
        </div>
      </div>

      {/* Serviços complementares */}
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>Serviços complementares</p>
        <div className="flex flex-wrap gap-2">
          {AUXILIARY_SERVICES.map((svc) => {
            const selected = data.auxiliaryServices.includes(svc.id);
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => toggleAuxiliaryService(svc.id)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                style={
                  selected
                    ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                    : { background: "transparent", color: "rgba(5,11,24,0.65)", border: "1px solid rgba(5,11,24,0.18)" }
                }
              >
                {svc.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
