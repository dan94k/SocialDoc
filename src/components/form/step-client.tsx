"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";
import DocumentPicker from "./document-picker";
import type { DocType } from "@/types/contract";

export default function StepClient() {
  const { data, setField } = useContractStore();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Dados do seu cliente</h2>
      <p className="text-muted-foreground">
        Nome completo ou razao social do cliente que contratara seus servicos.
      </p>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Nome completo ou razao social</p>
        <Input
          placeholder="Ex: Padaria do Joao LTDA"
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
