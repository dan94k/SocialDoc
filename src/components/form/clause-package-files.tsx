"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";
import type { PackageClauses } from "@/types/contract";

export default function ClausePackageFiles() {
  const { data, setField } = useContractStore();
  const clauses = data.packageClauses!;
  const clause = clauses.filesPayment;

  const update = (field: keyof PackageClauses["filesPayment"], value: unknown) => {
    setField("packageClauses", {
      ...clauses,
      filesPayment: { ...clause, [field]: value },
    });
  };

  return (
    <ClauseShell
      title="Arquivos editáveis após pagamento"
      description="Os arquivos-fonte só são entregues após quitação do pagamento."
      insight="Manter os arquivos editáveis retidos até o pagamento completo é uma proteção comum e legítima. Evita que o cliente fique com o material sem pagar a segunda parcela."
      enabled={clause.enabled}
      onToggle={(v) => update("enabled", v)}
    />
  );
}
