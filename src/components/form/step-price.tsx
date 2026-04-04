"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";

export default function StepPrice() {
  const { data, setField } = useContractStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Qual o valor mensal?</h2>
      <p className="text-muted-foreground">
        Valor em reais que o cliente pagara por mes pelos seus servicos.
      </p>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
          R$
        </span>
        <Input
          type="number"
          min={0}
          step={50}
          placeholder="1500"
          value={data.monthlyPrice || ""}
          onChange={(e) => setField("monthlyPrice", Number(e.target.value))}
          className="pl-10"
          autoFocus
        />
      </div>
    </div>
  );
}
