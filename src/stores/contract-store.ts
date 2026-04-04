import { create } from "zustand";
import type { ContractData, DocType } from "@/types/contract";

interface ContractStore {
  data: ContractData;
  currentStep: number;
  setField: <K extends keyof ContractData>(key: K, value: ContractData[K]) => void;
  setClauseField: <C extends keyof ContractData["clauses"]>(
    clause: C,
    field: keyof ContractData["clauses"][C],
    value: ContractData["clauses"][C][keyof ContractData["clauses"][C]]
  ) => void;
  toggleContentType: (typeId: string) => void;
  toggleAuxiliaryService: (serviceId: string) => void;
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
  contentTypes: [],
  totalPieces: 20,
  auxiliaryServices: [],
  monthlyPrice: 0,
  paymentDueDay: 5,
  pixKey: null,
  clauses: {
    revision: {
      enabled: true,
      maxRevisions: 2,
      adjustmentDays: 2,
      chargeExtra: true,
      extraValue: 0,
    },
    approval: {
      enabled: true,
      deadlineDays: 2,
    },
    scopeExtras: {
      enabled: true,
    },
    cancellation: {
      enabled: true,
      noticeDays: 30,
      penaltyPercent: 20,
    },
    filesPayment: {
      enabled: true,
    },
  },
  durationMonths: 6,
};

function isDocValid(docType: DocType | null, doc: string): boolean {
  if (docType === null) return false;
  if (docType === "nao-fornecer") return true;
  return doc.trim().length > 0;
}

export const useContractStore = create<ContractStore>((set, get) => ({
  data: { ...DEFAULT_DATA, clauses: { ...DEFAULT_DATA.clauses } },
  currentStep: 0,

  setField: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),

  setClauseField: (clause, field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        clauses: {
          ...state.data.clauses,
          [clause]: { ...state.data.clauses[clause], [field]: value },
        },
      },
    })),

  toggleContentType: (typeId) =>
    set((state) => {
      const current = state.data.contentTypes;
      const next = current.includes(typeId)
        ? current.filter((t) => t !== typeId)
        : [...current, typeId];
      return { data: { ...state.data, contentTypes: next } };
    }),

  toggleAuxiliaryService: (serviceId) =>
    set((state) => {
      const current = state.data.auxiliaryServices;
      const next = current.includes(serviceId)
        ? current.filter((s) => s !== serviceId)
        : [...current, serviceId];
      return { data: { ...state.data, auxiliaryServices: next } };
    }),

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

  isStepValid: (step: number) => {
    const { data } = get();
    switch (step) {
      case 0:
        return data.freelancerName.trim().length > 0 && isDocValid(data.freelancerDocType, data.freelancerDoc);
      case 1:
        return data.clientName.trim().length > 0 && isDocValid(data.clientDocType, data.clientDoc);
      case 2:
        return data.platforms.length > 0;
      case 3: // scope — always valid
        return true;
      case 4:
        return data.monthlyPrice > 0 && data.paymentDueDay >= 1 && data.paymentDueDay <= 31;
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return true;
      case 10:
        return data.durationMonths > 0;
      default:
        return true;
    }
  },

  saveToSession: () => {
    sessionStorage.setItem("socialdoc-contract", JSON.stringify(get().data));
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
