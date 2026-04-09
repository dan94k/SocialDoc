/**
 * Shared utilities for PDF generation.
 * Used by generic-contract-document.tsx and individual contract configs.
 */

export function numExt(n: number): string {
  const map: Record<number, string> = {
    1: "um", 2: "dois", 3: "três", 4: "quatro", 5: "cinco",
    6: "seis", 7: "sete", 8: "oito", 9: "nove", 10: "dez",
    14: "quatorze", 15: "quinze", 20: "vinte", 30: "trinta",
    45: "quarenta e cinco", 60: "sessenta", 90: "noventa",
  };
  return map[n] ? `${n} (${map[n]})` : String(n);
}

export function formatBRLPdf(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDatePdf(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

/**
 * Navigate a dot-notation path in an object.
 * e.g. resolvePath(data, "clauses.revision") returns data.clauses.revision
 */
export function resolvePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce((acc, key) => (acc as Record<string, unknown>)?.[key], obj);
}

/**
 * Interpolate {{fieldName}} placeholders in a template string
 * using values from a flat object.
 */
export function interpolate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = data[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}
