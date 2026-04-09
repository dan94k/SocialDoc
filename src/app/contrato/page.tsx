"use client";

import { useEffect } from "react";
import { useContractStore } from "@/stores/contract-store";
import FormShell from "@/components/form/form-shell";
import ContractTypeSelector from "@/components/contract-selector/contract-type-selector";
import { getContractType } from "@/lib/contracts";

export default function ContratoPage() {
  const { selectedContractTypeId, setContractType, restoreFromSession, setStep } = useContractStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("session_id")) {
      const restored = restoreFromSession();
      if (restored) {
        const { selectedContractTypeId: typeId } = useContractStore.getState();
        const config = typeId ? getContractType(typeId) : null;
        if (config) setStep(config.steps.length - 1);
      }
    }
  }, [restoreFromSession, setStep]);

  if (!selectedContractTypeId) {
    return <ContractTypeSelector onSelect={(id) => setContractType(id)} />;
  }

  return <FormShell />;
}
