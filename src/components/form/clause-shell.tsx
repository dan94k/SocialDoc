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
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Insight box */}
      <div className="flex gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p>{insight}</p>
      </div>

      {/* Enable toggle */}
      <div className="flex gap-2">
        {[true, false].map((val) => (
          <button
            key={String(val)}
            type="button"
            onClick={() => onToggle(val)}
            className={cn(
              "flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors",
              enabled === val
                ? val
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-destructive bg-destructive/10 text-destructive"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            {val ? "Sim, incluir" : "Não incluir"}
          </button>
        ))}
      </div>

      {/* Custom fields — only shown when enabled */}
      {enabled && children && (
        <div className="space-y-4 rounded-lg border p-4">{children}</div>
      )}
    </div>
  );
}
