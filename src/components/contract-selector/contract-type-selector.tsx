"use client";

import type { ComponentType } from "react";
import { ChevronRight, LayoutDashboard, Package } from "lucide-react";
import { CONTRACT_TYPES } from "@/lib/contracts";
import type { LucideProps } from "lucide-react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  LayoutDashboard,
  Package,
};

interface Props {
  onSelect: (typeId: string) => void;
}

export default function ContractTypeSelector({ onSelect }: Props) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-start px-4 pt-16 pb-16"
      style={{ background: "#f5f3ef", minHeight: "100vh" }}
    >
      <div className="w-full max-w-5xl">

        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "#050b18", fontFamily: "var(--font-display)" }}
          >
            Novo Contrato
          </h1>
          <p className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>
            Escolha o tipo de contrato que deseja criar
          </p>
        </div>

        {/* Contract type cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {CONTRACT_TYPES.map((type) => {
            const Icon = ICON_MAP[type.icon] ?? LayoutDashboard;
            const stepCount = type.steps.length;

            return (
              <button
                key={type.id}
                onClick={() => onSelect(type.id)}
                className="text-left rounded-3xl p-7 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(5,11,24,0.07)",
                  boxShadow: "0 4px 24px rgba(5,11,24,0.06)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Icon */}
                    <div
                      className="inline-flex items-center justify-center rounded-2xl mb-4"
                      style={{
                        width: 44,
                        height: 44,
                        background: "#d4ff00",
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: "#050b18" }} />
                    </div>

                    {/* Name */}
                    <h2
                      className="text-lg font-bold mb-1"
                      style={{ color: "#050b18" }}
                    >
                      {type.name}
                    </h2>

                    {/* Description */}
                    <p
                      className="text-sm mb-4 leading-relaxed"
                      style={{ color: "rgba(5,11,24,0.55)" }}
                    >
                      {type.description}
                    </p>

                    {/* Step count badge */}
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: "rgba(5,11,24,0.06)",
                        color: "rgba(5,11,24,0.5)",
                      }}
                    >
                      {stepCount} etapas
                    </span>
                  </div>

                  {/* Arrow */}
                  <div
                    className="inline-flex items-center justify-center rounded-2xl flex-shrink-0 mt-1"
                    style={{
                      width: 36,
                      height: 36,
                      background: "#050b18",
                    }}
                  >
                    <ChevronRight className="h-4 w-4" style={{ color: "#ffffff" }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
