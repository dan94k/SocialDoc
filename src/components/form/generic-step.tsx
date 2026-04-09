"use client";

import { useContractStore } from "@/stores/contract-store";
import type {
  FieldDef,
  GenericStepConfig,
  ClauseSubField,
} from "@/types/contract-engine";
import type { ContractData } from "@/types/contract";
import { Input } from "@/components/ui/input";
import ClauseShell from "./clause-shell";
import ClauseNumberField from "./clause-number-field";
import { resolvePath } from "@/lib/pdf-utils";
import { Info } from "lucide-react";

interface Props {
  step: GenericStepConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getSuffix(suffix: string | ((v: number) => string) | undefined, value: number): string | undefined {
  if (!suffix) return undefined;
  return typeof suffix === "function" ? suffix(value) : suffix;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-field renderer (inside a clause)
// ─────────────────────────────────────────────────────────────────────────────

function SubFieldRenderer({
  subField,
  clauseObj,
  onSubChange,
}: {
  subField: ClauseSubField;
  clauseObj: Record<string, unknown>;
  onSubChange: (field: string, value: unknown) => void;
}) {
  const value = clauseObj[subField.field];

  // Check showWhen
  if (
    subField.showWhen &&
    clauseObj[subField.showWhen.field] !== subField.showWhen.equals
  ) {
    return null;
  }

  if (subField.type === "number") {
    const numVal = (value as number) ?? 0;
    const suffixText = getSuffix(subField.suffix as string | ((v: number) => string) | undefined, numVal);
    return (
      <ClauseNumberField
        label={subField.label}
        value={numVal}
        onChange={(v) => onSubChange(subField.field, v)}
        min={subField.min}
        suffix={suffixText}
      />
    );
  }

  if (subField.type === "money") {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: "#050b18" }}>
          {subField.label}
        </label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold"
            style={{ color: "rgba(5,11,24,0.4)" }}
          >
            R$
          </span>
          <Input
            type="number"
            min={0}
            step={subField.step ?? 10}
            placeholder={subField.placeholder ?? "0"}
            value={(value as number) || ""}
            onChange={(e) => onSubChange(subField.field, Number(e.target.value))}
            className="pl-9"
          />
        </div>
      </div>
    );
  }

  if (subField.type === "select") {
    const opts = subField.options ?? [];
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>
          {subField.label}
        </p>
        <div className="flex gap-2 flex-wrap">
          {opts.map((opt) => {
            const isActive = value === opt.value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => onSubChange(subField.field, opt.value)}
                className="flex-1 rounded-2xl py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
                style={
                  isActive
                    ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                    : { background: "transparent", color: "rgba(5,11,24,0.6)", border: "1px solid rgba(5,11,24,0.15)" }
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (subField.type === "text") {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: "#050b18" }}>
          {subField.label}
        </label>
        <Input
          placeholder={subField.placeholder}
          value={(value as string) || ""}
          onChange={(e) => onSubChange(subField.field, e.target.value)}
        />
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual field renderers
// ─────────────────────────────────────────────────────────────────────────────

function FieldRenderer({
  field,
  data,
  setField,
  setNestedField,
}: {
  field: FieldDef;
  data: ContractData;
  setField: <K extends keyof ContractData>(key: K, value: ContractData[K]) => void;
  setNestedField: (path: string, value: unknown) => void;
}) {
  // ── text ──────────────────────────────────────────────────────────────────
  if (field.type === "text") {
    if (field.renderWhen && !field.renderWhen(data)) return null;
    const value = (data[field.field] as string) ?? "";
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: "#050b18" }}>
          {field.label}
        </label>
        <Input
          autoFocus={field.autoFocus}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => setField(field.field, e.target.value as ContractData[typeof field.field])}
        />
      </div>
    );
  }

  // ── number ────────────────────────────────────────────────────────────────
  if (field.type === "number") {
    const value = (data[field.field] as number) ?? 0;
    const suffixText = typeof field.suffix === "function" ? field.suffix(value) : field.suffix;
    return (
      <ClauseNumberField
        label={field.label}
        value={value}
        onChange={(v) => setField(field.field, v as ContractData[typeof field.field])}
        min={field.min}
        suffix={suffixText}
        prefix={field.prefix}
      />
    );
  }

  // ── money ─────────────────────────────────────────────────────────────────
  if (field.type === "money") {
    if (field.renderWhen && !field.renderWhen(data)) return null;
    const value = (data[field.field] as number) ?? 0;
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: "#050b18" }}>
          {field.label}
        </label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold"
            style={{ color: "rgba(5,11,24,0.4)" }}
          >
            R$
          </span>
          <Input
            type="number"
            min={0}
            step={field.step ?? 50}
            placeholder={field.placeholder ?? "0"}
            value={value || ""}
            onChange={(e) =>
              setField(field.field, Number(e.target.value) as ContractData[typeof field.field])
            }
            className="pl-9"
          />
        </div>
      </div>
    );
  }

  // ── multiselect ───────────────────────────────────────────────────────────
  if (field.type === "multiselect") {
    const selected = (data[field.field] as string[]) ?? [];
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>
          {field.label}
        </p>
        <div className="flex flex-wrap gap-2">
          {field.options.map((opt) => {
            const active = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  const next = active
                    ? selected.filter((id) => id !== opt.id)
                    : [...selected, opt.id];
                  setField(field.field, next as ContractData[typeof field.field]);
                }}
                className="rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                style={
                  active
                    ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                    : { background: "transparent", color: "rgba(5,11,24,0.6)", border: "1px solid rgba(5,11,24,0.2)" }
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {selected.length === 0 && field.emptyHint && (
          <p className="text-xs" style={{ color: "rgba(5,11,24,0.4)" }}>
            {field.emptyHint}
          </p>
        )}
      </div>
    );
  }

  // ── select ────────────────────────────────────────────────────────────────
  if (field.type === "select") {
    const rawValue = data[field.field];
    const currentValue = rawValue === null ? "__null__" : rawValue;
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>
          {field.label}
        </p>
        <div className="flex gap-2 flex-wrap">
          {field.options.map((opt) => {
            const isActive = currentValue === opt.value || (opt.value === "__null__" && rawValue === null);
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  const next = opt.value === "__null__" ? null : opt.value;
                  setField(field.field, next as ContractData[typeof field.field]);
                }}
                className="flex-1 rounded-2xl py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
                style={
                  isActive
                    ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                    : { background: "transparent", color: "rgba(5,11,24,0.6)", border: "1px solid rgba(5,11,24,0.15)" }
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── select-described ──────────────────────────────────────────────────────
  if (field.type === "select-described") {
    const value = data[field.field] as string;
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>
          {field.label}
        </p>
        <div className="flex flex-col gap-2">
          {field.options.map((opt) => {
            const active = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setField(field.field, opt.value as ContractData[typeof field.field])}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-200 hover:scale-[1.01]"
                style={
                  active
                    ? { background: "#050b18", border: "1px solid #050b18" }
                    : { background: "transparent", border: "1px solid rgba(5,11,24,0.15)" }
                }
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: active ? "#ffffff" : "#050b18" }}>
                    {opt.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: active ? "rgba(255,255,255,0.55)" : "rgba(5,11,24,0.45)" }}>
                    {opt.description}
                  </p>
                </div>
                <div
                  className="h-4 w-4 rounded-full border-2 flex-shrink-0"
                  style={{
                    borderColor: active ? "#d4ff00" : "rgba(5,11,24,0.25)",
                    background: active ? "#d4ff00" : "transparent",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── document ──────────────────────────────────────────────────────────────
  if (field.type === "document") {
    const docType = data[field.docTypeField] as string | null;
    const doc = (data[field.docField] as string) ?? "";
    const options = ["CPF", "CNPJ", "Não fornecer"] as const;
    const docTypeMap: Record<string, string> = {
      CPF: "CPF",
      CNPJ: "CNPJ",
      "Não fornecer": "nao-fornecer",
    };
    const reverseMap: Record<string, string> = {
      CPF: "CPF",
      CNPJ: "CNPJ",
      "nao-fornecer": "Não fornecer",
    };
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>
          {field.label}
        </p>
        <div className="flex gap-2">
          {options.map((opt) => {
            const isActive = docType === docTypeMap[opt];
            return (
              <button
                key={opt}
                type="button"
                onClick={() =>
                  setField(field.docTypeField, docTypeMap[opt] as ContractData[typeof field.docTypeField])
                }
                className="flex-1 rounded-2xl py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
                style={
                  isActive
                    ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                    : { background: "transparent", color: "rgba(5,11,24,0.6)", border: "1px solid rgba(5,11,24,0.15)" }
                }
              >
                {docType && reverseMap[docType] === opt ? opt : opt}
              </button>
            );
          })}
        </div>
        {docType && docType !== "nao-fornecer" && (
          <Input
            placeholder={docType === "CPF" ? "000.000.000-00" : "00.000.000/0001-00"}
            value={doc}
            onChange={(e) =>
              setField(field.docField, e.target.value as ContractData[typeof field.docField])
            }
          />
        )}
      </div>
    );
  }

  // ── clause ────────────────────────────────────────────────────────────────
  if (field.type === "clause") {
    const clauseObj = resolvePath(data, field.clausePath) as Record<string, unknown>;
    const enabled = clauseObj?.enabled as boolean ?? false;

    const onSubChange = (subKey: string, value: unknown) => {
      setNestedField(`${field.clausePath}.${subKey}`, value);
    };

    return (
      <ClauseShell
        title={field.title}
        description={field.description}
        insight={field.insight}
        enabled={enabled}
        onToggle={(v) => setNestedField(`${field.clausePath}.enabled`, v)}
      >
        {field.subFields.map((subField, i) => (
          <SubFieldRenderer
            key={i}
            subField={subField}
            clauseObj={clauseObj}
            onSubChange={onSubChange}
          />
        ))}
      </ClauseShell>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main GenericStep component
// ─────────────────────────────────────────────────────────────────────────────

export default function GenericStep({ step }: Props) {
  const { data, setField, setNestedField } = useContractStore();
  const subheading =
    typeof step.subheading === "function" ? step.subheading(data) : step.subheading;

  return (
    <div className="space-y-5">
      {step.heading && (
        <div className="space-y-1">
          <h2 className="text-xl font-bold" style={{ color: "#050b18" }}>
            {step.heading}
          </h2>
          {subheading && (
            <p className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>
              {subheading}
            </p>
          )}
        </div>
      )}

      {step.fields.map((field, i) => (
        <FieldRenderer
          key={i}
          field={field}
          data={data}
          setField={setField}
          setNestedField={setNestedField}
        />
      ))}
    </div>
  );
}
