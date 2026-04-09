"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";
import DocumentPicker from "./document-picker";
import type { DocType } from "@/types/contract";

export default function StepClient() {
  const { data, setField } = useContractStore();

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
        >
          Dados do seu cliente
        </h2>
        <p className="text-sm mt-1.5" style={{ color: "rgba(5,11,24,0.5)" }}>
          Nome completo ou razão social do cliente que contratará seus serviços.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>Nome completo ou razão social</p>
        <Input
          placeholder="Ex: Padaria do João LTDA"
          value={data.clientName}
          onChange={(e) => setField("clientName", e.target.value)}
          autoFocus
        />
      </div>

      <DocumentPicker
        docType={data.clientDocType}
        doc={data.clientDoc}
        onDocTypeChange={(v: DocType) => setField("clientDocType", v)}
        onDocChange={(v) => setField("clientDoc", v)}
      />
    </div>
  );
}
