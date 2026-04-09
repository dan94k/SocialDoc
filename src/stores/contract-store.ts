import { create } from "zustand";
import type { ContractData } from "@/types/contract";
import { getContractType } from "@/lib/contracts";

interface ContractStore {
  data: ContractData;
  currentStep: number;
  selectedContractTypeId: string | null;
  setField: <K extends keyof ContractData>(key: K, value: ContractData[K]) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isStepValid: (step: number) => boolean;
  setContractType: (id: string) => void;
  resetContract: () => void;
  setNestedField: (path: string, value: unknown) => void;
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
  packageArtTypes: [],
  packageTotalItems: 10,
  packageDeliveryDays: 14,
  packagePrice: 0,
  packagePaymentType: "split" as const,
  packagePixKey: null,
  packageClauses: {
    revision: {
      enabled: true,
      maxRevisions: 2,
      requestDays: 3,
      chargeExtra: false,
      extraValue: 0,
    },
    cancellation: {
      enabled: true,
      penaltyPercent: 50,
    },
    filesPayment: {
      enabled: true,
    },
  },
};

export const useContractStore = create<ContractStore>((set, get) => ({
  data: { ...DEFAULT_DATA, clauses: { ...DEFAULT_DATA.clauses } },
  currentStep: 0,
  selectedContractTypeId: null,

  setField: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),

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

  setNestedField: (path, value) =>
    set((state) => {
      const keys = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = { ...state.data };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = data;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return { data };
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
