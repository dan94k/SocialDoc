export interface ContractClauses {
  revisionLimit: boolean;
  approvalDeadline: boolean;
  outOfScopeExtras: boolean;
  cancellationPenalty: boolean;
  filesAfterPayment: boolean;
}

export interface ContractData {
  freelancerName: string;
  clientName: string;
  platforms: string[];
  monthlyPrice: number;
  paymentDueDay: number;
  clauses: ContractClauses;
  durationMonths: number;
}
