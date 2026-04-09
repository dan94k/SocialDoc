"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck, Info } from "lucide-react";

interface Props {
  title: string;
  description: string;
  insight: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
}

export default function ClauseShell({
  title,
  description,
  insight,
  enabled,
  onToggle,
  children,
}: Props) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "rgba(5,11,24,0.07)" }}
        >
          <ShieldCheck className="h-5 w-5" style={{ color: "#050b18" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#050b18" }}>{title}</h2>
          <p className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>{description}</p>
        </div>
      </div>

      {/* Insight box */}
      <div
        className="flex gap-2 rounded-2xl p-3 text-sm"
        style={{
          background: "rgba(5,11,24,0.04)",
          border: "1px solid rgba(5,11,24,0.08)",
        }}
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "rgba(5,11,24,0.45)" }} />
        <p style={{ color: "rgba(5,11,24,0.6)" }}>{insight}</p>
      </div>

      {/* Enable toggle */}
      <div className="flex gap-2">
        {[true, false].map((val) => (
          <button
            key={String(val)}
            type="button"
            onClick={() => onToggle(val)}
            className="flex-1 rounded-2xl border py-2.5 text-sm font-medium transition-all duration-200"
            style={
              enabled === val
                ? val
                  ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                  : { background: "rgba(5,11,24,0.06)", color: "#050b18", border: "1px solid rgba(5,11,24,0.15)" }
                : { background: "transparent", color: "rgba(5,11,24,0.5)", border: "1px solid rgba(5,11,24,0.12)" }
            }
          >
            {val ? "Sim, incluir" : "Não incluir"}
          </button>
        ))}
      </div>

      {/* Custom fields — only shown when enabled */}
      {enabled && children && (
        <div
          className="space-y-4 rounded-2xl p-4"
          style={{ border: "1px solid rgba(5,11,24,0.1)", background: "rgba(5,11,24,0.02)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
