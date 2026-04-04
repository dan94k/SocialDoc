"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";

export default function StepFreelancer() {
  const { data, setField } = useContractStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Qual e o seu nome?</h2>
      <p className="text-muted-foreground">
        Nome completo que aparecera no contrato como prestador de servicos.
      </p>
      <Input
        placeholder="Ex: Maria Silva"
        value={data.freelancerName}
        onChange={(e) => setField("freelancerName", e.target.value)}
        autoFocus
      />
    </div>
  );
}
