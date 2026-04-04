"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";
import DocumentPicker from "./document-picker";
import type { DocType } from "@/types/contract";

export default function StepFreelancer() {
  const { data, setField } = useContractStore();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Seus dados</h2>
      <p className="text-muted-foreground">
        Informacoes que aparecerão no contrato como prestador de servicos.
      </p>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Nome completo</p>
        <Input
          placeholder="Ex: Maria Silva"
          value={data.freelancerName}
          onChange={(e) => setField("freelancerName", e.target.value)}
          autoFocus
        />
      </div>

      <DocumentPicker
        docType={data.freelancerDocType}
        doc={data.freelancerDoc}
        onDocTypeChange={(v: DocType) => setField("freelancerDocType", v)}
        onDocChange={(v) => setField("freelancerDoc", v)}
      />
    </div>
  );
}
