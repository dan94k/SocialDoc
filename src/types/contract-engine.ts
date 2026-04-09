import type { ContractData } from "./contract";

// ─────────────────────────────────────────────────────────────────────────────
// FIELD DEFINITIONS — 8 types cover all existing UI patterns
// ─────────────────────────────────────────────────────────────────────────────

export interface TextField {
  type: "text";
  field: keyof ContractData;
  label: string;
  placeholder?: string;
  autoFocus?: boolean;
  /** Render this field only when the predicate returns true */
  renderWhen?: (data: ContractData) => boolean;
}

export interface NumberField {
  type: "number";
  field: keyof ContractData;
  label: string;
  min?: number;
  suffix?: string | ((value: number) => string);
  prefix?: string;
}

export interface MoneyField {
  type: "money";
  field: keyof ContractData;
  label: string;
  placeholder?: string;
  step?: number;
  /** Render this field only when the predicate returns true */
  renderWhen?: (data: ContractData) => boolean;
}

export interface MultiselectField {
  type: "multiselect";
  field: keyof ContractData;
  label: string;
  options: { id: string; label: string }[];
  emptyHint?: string;
}

export interface SelectField {
  type: "select";
  field: keyof ContractData;
  label: string;
  /** Use "__null__" as value to represent null */
  options: { value: string | number | boolean; label: string }[];
}

export interface SelectDescribedField {
  type: "select-described";
  field: keyof ContractData;
  label: string;
  options: { value: string; label: string; description: string }[];
}

export interface DocumentField {
  type: "document";
  docTypeField: keyof ContractData;
  docField: keyof ContractData;
  label: string;
}

export interface ClauseSubField {
  type: Exclude<FieldDef["type"], "clause" | "document">;
  /** Key within the clause object (relative, not keyof ContractData) */
  field: string;
  label: string;
  placeholder?: string;
  min?: number;
  suffix?: string | ((value: number) => string);
  step?: number;
  options?: { value: string | number | boolean; label: string; description?: string }[];
  /** Only render this sub-field when another sub-field equals a given value */
  showWhen?: { field: string; equals: unknown };
}

export interface ClauseField {
  type: "clause";
  /**
   * Dot-notation path in ContractData.
   * e.g. "clauses.revision" or "packageClauses.revision"
   */
  clausePath: string;
  title: string;
  description: string;
  insight: string;
  subFields: ClauseSubField[];
}

export type FieldDef =
  | TextField
  | NumberField
  | MoneyField
  | MultiselectField
  | SelectField
  | SelectDescribedField
  | DocumentField
  | ClauseField;

// ─────────────────────────────────────────────────────────────────────────────
// STEP DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface GenericStepConfig {
  key: string;
  title: string;
  heading?: string;
  subheading?: string | ((data: ContractData) => string);
  validate: (data: ContractData) => boolean;
  fields: FieldDef[];
  /** Built-in step types rendered by the engine directly */
  builtIn?: "review" | "download";
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF SECTION DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface PartiesSection {
  type: "parties";
  sectionTitle: string;
}

export interface StaticTextSection {
  type: "static-text";
  sectionTitle: string;
  /** Plain text with optional {{field}} interpolation */
  text?: string;
  /** Overrides text when provided — for complex dynamic content */
  textFn?: (data: ContractData) => string;
  /** Additional paragraphs rendered after the main text */
  additionalParagraphsFn?: (data: ContractData) => string[];
}

export interface PdfClauseDef {
  key: string;
  title: string;
  textFn: (data: ContractData) => string;
}

export interface ClausesSectionDef {
  type: "clauses-section";
  sectionTitle: string;
  /**
   * Dot-notation path to the clauses object in ContractData.
   * e.g. "clauses" or "packageClauses"
   */
  clausesPath: string;
  clauses: PdfClauseDef[];
}

export type PdfSectionDef = PartiesSection | StaticTextSection | ClausesSectionDef;

export interface GenericPdfConfig {
  title: string;
  sections: PdfSectionDef[];
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP-LEVEL CONTRACT TYPE CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export interface GenericContractTypeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  steps: GenericStepConfig[];
  pdf: GenericPdfConfig;
  defaults?: Partial<ContractData>;
}
