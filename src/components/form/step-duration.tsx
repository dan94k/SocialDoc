"use client";

import { useContractStore } from "@/stores/contract-store";
import { cn } from "@/lib/utils";

const OPTIONS = [3, 6, 12];

export default function StepDuration() {
  const { data, setField } = useContractStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Duração do contrato</h2>
      <p className="text-muted-foreground">
        Por quantos meses o contrato terá vigência?
      </p>
      <div className="flex gap-3">
        {OPTIONS.map((months) => (
          <button
            key={months}
            onClick={() => setField("durationMonths", months)}
            className={cn(
              "flex-1 rounded-lg border p-4 text-center font-medium transition-colors",
              data.durationMonths === months
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            {months} meses
          </button>
        ))}
      </div>
    </div>
  );
}
