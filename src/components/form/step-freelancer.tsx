"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";
import DocumentPicker from "./document-picker";
import type { DocType } from "@/types/contract";

export default function StepFreelancer() {
  const { data, setField } = useContractStore();

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
        >
          Seus dados
        </h2>
        <p className="text-sm mt-1.5" style={{ color: "rgba(5,11,24,0.5)" }}>
          Informações que aparecerão no contrato como prestador de serviços.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>Nome completo</p>
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
