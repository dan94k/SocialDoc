"use client";

import { useContractStore } from "@/stores/contract-store";
import type { GenericContractTypeConfig, FieldDef } from "@/types/contract-engine";
import type { ContractData } from "@/types/contract";
import { formatBRL } from "@/lib/utils";
import { resolvePath } from "@/lib/pdf-utils";
import { ClipboardList, Shield } from "lucide-react";

interface Props {
  config: GenericContractTypeConfig;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm py-1.5 border-b last:border-0" style={{ borderColor: "rgba(5,11,24,0.07)" }}>
      <span className="shrink-0" style={{ color: "rgba(5,11,24,0.5)" }}>{label}</span>
      <span className="font-medium text-right" style={{ color: "#050b18" }}>{value}</span>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-4 space-y-1"
      style={{ border: "1px solid rgba(5,11,24,0.09)", background: "rgba(5,11,24,0.01)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" style={{ color: "rgba(5,11,24,0.4)" }} />
        <span className="text-sm font-semibold" style={{ color: "#050b18" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function formatFieldValue(field: FieldDef, data: ContractData): string | null {
  if (field.type === "text") {
    const v = data[field.field] as string;
    return v?.trim() ? v : null;
  }
  if (field.type === "number") {
    const v = data[field.field] as number;
    if (!v) return null;
    const suffix = typeof field.suffix === "function" ? field.suffix(v) : (field.suffix ?? "");
    return `${v} ${suffix}`.trim();
  }
  if (field.type === "money") {
    const v = data[field.field] as number;
    return v ? formatBRL(v) : null;
  }
  if (field.type === "multiselect") {
    const selected = (data[field.field] as string[]) ?? [];
    if (!selected.length) return null;
    return selected
      .map((id) => field.options.find((o) => o.id === id)?.label ?? id)
      .join(", ");
  }
  if (field.type === "select") {
    const v = data[field.field];
    if (v === null || v === undefined) return null;
    return field.options.find((o) => o.value === v)?.label ?? String(v);
  }
  if (field.type === "select-described") {
    const v = data[field.field] as string;
    return field.options.find((o) => o.value === v)?.label ?? v;
  }
  if (field.type === "document") {
    const docType = data[field.docTypeField] as string | null;
    const doc = data[field.docField] as string;
    if (!docType) return null;
    if (docType === "nao-fornecer") return "Não fornecido";
    return `${docType}: ${doc}`;
  }
  if (field.type === "clause") {
    const clauseObj = resolvePath(data, field.clausePath) as { enabled: boolean } | undefined;
    return clauseObj?.enabled ? "Incluída" : "Não incluída";
  }
  return null;
}

export default function GenericReview({ config }: Props) {
  const { data } = useContractStore();

  // Group steps into sections (skip built-ins)
  const contentSteps = config.steps.filter(
    (s) => !s.builtIn && s.fields.length > 0
  );

  // Separate clause steps from regular steps
  const regularSteps = contentSteps.filter(
    (s) => !s.fields.some((f) => f.type === "clause")
  );
  const clauseSteps = contentSteps.filter((s) =>
    s.fields.some((f) => f.type === "clause")
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
        >
          Resumo do contrato
        </h2>
        <p className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>
          Confira os dados antes de gerar o PDF.
        </p>
      </div>

      {/* Regular steps */}
      {regularSteps.map((step) => {
        const rows: { label: string; value: string }[] = [];

        for (const field of step.fields) {
          if (field.type === "document") {
            const value = formatFieldValue(field, data);
            if (value) rows.push({ label: field.label, value });
            continue;
          }
          if (field.type === "text" || field.type === "number" || field.type === "money" || field.type === "multiselect" || field.type === "select" || field.type === "select-described") {
            const value = formatFieldValue(field, data);
            if (value) rows.push({ label: field.label, value });
          }
        }

        if (!rows.length) return null;

        return (
          <Section key={step.key} icon={ClipboardList} title={step.title}>
            {rows.map((row) => (
              <Row key={row.label} label={row.label} value={row.value} />
            ))}
          </Section>
        );
      })}

      {/* Clauses */}
      {clauseSteps.length > 0 && (
        <Section icon={Shield} title="Cláusulas">
          {clauseSteps.map((step) => {
            const clauseField = step.fields.find((f) => f.type === "clause");
            if (!clauseField || clauseField.type !== "clause") return null;
            const clauseObj = resolvePath(data, clauseField.clausePath) as { enabled: boolean } | undefined;
            const enabled = clauseObj?.enabled ?? false;
            return (
              <Row
                key={step.key}
                label={clauseField.title}
                value={enabled ? "Incluída" : "Não incluída"}
              />
            );
          })}
        </Section>
      )}
    </div>
  );
}
