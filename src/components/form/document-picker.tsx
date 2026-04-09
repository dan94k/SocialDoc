"use client";

import type { DocType } from "@/types/contract";
import { Input } from "@/components/ui/input";

const DOC_OPTIONS: { value: DocType; label: string }[] = [
  { value: "CPF", label: "CPF" },
  { value: "CNPJ", label: "CNPJ" },
  { value: "nao-fornecer", label: "Não fornecer" },
];

const DOC_PLACEHOLDER: Record<string, string> = {
  CPF: "000.000.000-00",
  CNPJ: "00.000.000/0001-00",
};

interface Props {
  docType: DocType | null;
  doc: string;
  onDocTypeChange: (v: DocType) => void;
  onDocChange: (v: string) => void;
}

export default function DocumentPicker({ docType, doc, onDocTypeChange, onDocChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium" style={{ color: "#050b18" }}>Documento</p>
      <div className="flex gap-2">
        {DOC_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onDocTypeChange(opt.value)}
            className="flex-1 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
            style={
              docType === opt.value
                ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                : { background: "transparent", color: "rgba(5,11,24,0.6)", border: "1px solid rgba(5,11,24,0.15)" }
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {(docType === "CPF" || docType === "CNPJ") && (
        <Input
          placeholder={DOC_PLACEHOLDER[docType]}
          value={doc}
          onChange={(e) => onDocChange(e.target.value)}
          autoFocus
        />
      )}
    </div>
  );
}
