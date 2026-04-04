"use client";

import type { DocType } from "@/types/contract";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DOC_OPTIONS: { value: DocType; label: string }[] = [
  { value: "CPF", label: "CPF" },
  { value: "CNPJ", label: "CNPJ" },
  { value: "nao-fornecer", label: "Nao fornecer" },
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
      <p className="text-sm font-medium text-foreground">Documento</p>
      <div className="flex gap-2">
        {DOC_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onDocTypeChange(opt.value)}
            className={cn(
              "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              docType === opt.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent"
            )}
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
