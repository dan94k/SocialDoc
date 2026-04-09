import { create } from "zustand";
import type { ContractData } from "@/types/contract";
import { getContractType } from "@/lib/contracts";

interface ContractStore {
  data: ContractData;
  currentStep: number;
  selectedContractTypeId: string | null;
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
  setContractType: (id: string) => void;
  resetContract: () => void;
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

export const useContractStore = create<ContractStore>((set, get) => ({
  data: { ...DEFAULT_DATA, clauses: { ...DEFAULT_DATA.clauses } },
  currentStep: 0,
  selectedContractTypeId: null,

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
    const { data, selectedContractTypeId } = get();
    if (!selectedContractTypeId) return false;
    const config = getContractType(selectedContractTypeId);
    if (!config || step >= config.steps.length) return true;
    return config.steps[step].validate(data);
  },

  setContractType: (id) =>
    set({
      selectedContractTypeId: id,
      currentStep: 0,
      data: { ...DEFAULT_DATA, clauses: { ...DEFAULT_DATA.clauses } },
    }),

  resetContract: () =>
    set({
      selectedContractTypeId: null,
      currentStep: 0,
      data: { ...DEFAULT_DATA, clauses: { ...DEFAULT_DATA.clauses } },
    }),

  saveToSession: () => {
    const { data, selectedContractTypeId } = get();
    sessionStorage.setItem(
      "socialdoc-contract",
      JSON.stringify({ data, selectedContractTypeId })
    );
  },

  restoreFromSession: () => {
    const saved = sessionStorage.getItem("socialdoc-contract");
    if (saved) {
      const parsed = JSON.parse(saved);
      set({
        data: parsed.data,
        selectedContractTypeId: parsed.selectedContractTypeId ?? null,
      });
      return true;
    }
    return false;
  },
}));
