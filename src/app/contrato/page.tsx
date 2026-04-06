"use client";

import { useEffect } from "react";
import { useContractStore } from "@/stores/contract-store";
import FormShell from "@/components/form/form-shell";

export default function ContratoPage() {
  const { restoreFromSession, setStep } = useContractStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("session_id")) {
      const restored = restoreFromSession();
      if (restored) {
        setStep(11); // StepDownload is the last step (index 11)
      }
    }
  }, [restoreFromSession, setStep]);

  return <FormShell />;
}
