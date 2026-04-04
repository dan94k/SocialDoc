import { create } from "zustand";
import type { ContractData, ContractClauses, DocType } from "@/types/contract";

interface ContractStore {
  data: ContractData;
  currentStep: number;
  setField: <K extends keyof ContractData>(key: K, value: ContractData[K]) => void;
  setClause: (key: keyof ContractClauses, value: boolean) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isStepValid: (step: number) => boolean;
  saveToSession: () => void;
  restoreFromSession: () => boolean;
}

const DEFAULT_DATA: ContractData = {
  freelancerName: "",
  freelancerDocType: null,
  freelancerDoc: "",
  clientName: "",
  clientDocType: null,
  clientDoc: "",
  platforms: [],
  monthlyPrice: 0,
  paymentDueDay: 5,
  clauses: {
    revisionLimit: true,
    approvalDeadline: true,
    outOfScopeExtras: true,
    cancellationPenalty: true,
    filesAfterPayment: true,
  },
  durationMonths: 6,
};

function isDocValid(docType: DocType | null, doc: string): boolean {
  if (docType === null) return false;
  if (docType === "nao-fornecer") return true;
  return doc.trim().length > 0;
}

export const useContractStore = create<ContractStore>((set, get) => ({
  data: { ...DEFAULT_DATA },
  currentStep: 0,

  setField: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),

  setClause: (key, value) =>
    set((state) => ({
      data: {
        ...state.data,
        clauses: { ...state.data.clauses, [key]: value },
      },
    })),

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

  isStepValid: (step: number) => {
    const { data } = get();
    switch (step) {
      case 0:
        return (
          data.freelancerName.trim().length > 0 &&
          isDocValid(data.freelancerDocType, data.freelancerDoc)
        );
      case 1:
        return (
          data.clientName.trim().length > 0 &&
          isDocValid(data.clientDocType, data.clientDoc)
        );
      case 2:
        return data.platforms.length > 0;
      case 3:
        return data.monthlyPrice > 0;
      case 4:
        return data.paymentDueDay >= 1 && data.paymentDueDay <= 31;
      case 5:
        return true;
      case 6:
        return data.durationMonths > 0;
      default:
        return true;
    }
  },

  saveToSession: () => {
    const { data } = get();
    sessionStorage.setItem("socialdoc-contract", JSON.stringify(data));
  },

  restoreFromSession: () => {
    const saved = sessionStorage.getItem("socialdoc-contract");
    if (saved) {
      set({ data: JSON.parse(saved) });
      return true;
    }
    return false;
  },
}));
