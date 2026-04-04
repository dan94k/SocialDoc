"use client";

import { useEffect } from "react";
import { useContractStore } from "@/stores/contract-store";
import FormShell from "@/components/form/form-shell";

export default function ContratoPage() {
  const { restoreFromSession, setStep } = useContractStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("paid")) {
      const restored = restoreFromSession();
      if (restored) {
        // Go directly to the download step (last step)
        setStep(7);
      }
    }
  }, [restoreFromSession, setStep]);

  return <FormShell />;
}
