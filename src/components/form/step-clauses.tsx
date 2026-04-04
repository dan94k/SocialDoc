"use client";

import { useContractStore } from "@/stores/contract-store";
import { CLAUSES } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import type { ContractClauses } from "@/types/contract";

export default function StepClauses() {
  const { data, setClause } = useContractStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Clausulas do contrato</h2>
      <p className="text-muted-foreground">
        Todas vem marcadas por padrao. Desmarque as que nao quiser incluir.
      </p>
      <div className="space-y-3">
        {CLAUSES.map((clause) => (
          <label
            key={clause.id}
            className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <Checkbox
              checked={data.clauses[clause.id as keyof ContractClauses]}
              onCheckedChange={(checked) =>
                setClause(clause.id, checked as boolean)
              }
              className="mt-0.5"
            />
            <div>
              <p className="font-medium">{clause.label}</p>
              <p className="text-sm text-muted-foreground">{clause.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
