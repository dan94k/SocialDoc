export type DocType = "CPF" | "CNPJ" | "nao-fornecer";

export interface RevisionClause {
  enabled: boolean;
  maxRevisions: number;
  adjustmentDays: number;
  chargeExtra: boolean;
  extraValue: number;
}

export interface ApprovalClause {
  enabled: boolean;
  deadlineDays: number;
}

export interface ScopeExtrasClause {
  enabled: boolean;
}

export interface CancellationClause {
  enabled: boolean;
  noticeDays: number;
  penaltyPercent: number;
}

export interface FilesPaymentClause {
  enabled: boolean;
}

export interface ContractClauses {
  revision: RevisionClause;
  approval: ApprovalClause;
  scopeExtras: ScopeExtrasClause;
  cancellation: CancellationClause;
  filesPayment: FilesPaymentClause;
}

export interface ContractData {
  freelancerName: string;
  freelancerDocType: DocType | null;
  freelancerDoc: string;
  clientName: string;
  clientDocType: DocType | null;
  clientDoc: string;
  platforms: string[];
  contentTypes: string[];
  totalPieces: number;
  auxiliaryServices: string[];
  monthlyPrice: number;
  paymentDueDay: number;
  pixKey: string | null;
  clauses: ContractClauses;
  durationMonths: number;
}
