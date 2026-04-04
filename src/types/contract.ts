export type DocType = "CPF" | "CNPJ" | "nao-fornecer";

export interface ContractClauses {
  revisionLimit: boolean;
  approvalDeadline: boolean;
  outOfScopeExtras: boolean;
  cancellationPenalty: boolean;
  filesAfterPayment: boolean;
}

export interface ContractData {
  freelancerName: string;
  freelancerDocType: DocType | null;
  freelancerDoc: string;
  clientName: string;
  clientDocType: DocType | null;
  clientDoc: string;
  platforms: string[];
  monthlyPrice: number;
  paymentDueDay: number;
  clauses: ContractClauses;
  durationMonths: number;
}
