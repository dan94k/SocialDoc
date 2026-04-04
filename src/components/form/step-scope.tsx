"use client";

import { useContractStore } from "@/stores/contract-store";
import { CONTENT_TYPES, AUXILIARY_SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function StepScope() {
  const { data, toggleContentType, toggleAuxiliaryService, setField } = useContractStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Escopo dos servicos</h2>
        <p className="text-sm text-muted-foreground mt-1">
          O que voce vai produzir para {data.clientName || "o cliente"}?
        </p>
      </div>

      {/* Tipos de conteudo */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Tipos de conteudo</p>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((ct) => {
            const selected = data.contentTypes.includes(ct.id);
            return (
              <button
                key={ct.id}
                type="button"
                onClick={() => toggleContentType(ct.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent"
                )}
              >
                {ct.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantidade total de pecas */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Quantidade total de pecas por mes</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setField("totalPieces", Math.max(1, data.totalPieces - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border text-lg hover:bg-accent"
          >
            −
          </button>
          <span className="text-2xl font-bold min-w-[2.5rem] text-center">
            {data.totalPieces}
          </span>
          <button
            type="button"
            onClick={() => setField("totalPieces", data.totalPieces + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border text-lg hover:bg-accent"
          >
            +
          </button>
          <span className="text-sm text-muted-foreground">pecas / mes</span>
        </div>
      </div>

      {/* Servicos complementares */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Servicos complementares</p>
        <div className="flex flex-wrap gap-2">
          {AUXILIARY_SERVICES.map((svc) => {
            const selected = data.auxiliaryServices.includes(svc.id);
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => toggleAuxiliaryService(svc.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent"
                )}
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
