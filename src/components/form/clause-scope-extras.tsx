"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";

export default function ClauseScopeExtras() {
  const { data, setClauseField } = useContractStore();
  const clause = data.clauses.scopeExtras;

  return (
    <ClauseShell
      title="Extras fora do escopo"
      description="Demandas que vão além do que foi combinado no contrato."
      insight="O cliente que fecha um pacote de Instagram muitas vezes começa a pedir arte para flyer, vídeo para TV, post para LinkedIn... Essa cláusula deixa claro que qualquer coisa além do combinado tem um preço — e precisa de aprovação antes de você executar."
      enabled={clause.enabled}
      onToggle={(v) => setClauseField("scopeExtras", "enabled", v)}
    />
  );
}
