"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";

export default function StepClient() {
  const { data, setField } = useContractStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Nome do seu cliente</h2>
      <p className="text-muted-foreground">
        Nome completo ou razao social do cliente que contratara seus servicos.
      </p>
      <Input
        placeholder="Ex: Padaria do Joao LTDA"
        value={data.clientName}
        onChange={(e) => setField("clientName", e.target.value)}
        autoFocus
      />
    </div>
  );
}
