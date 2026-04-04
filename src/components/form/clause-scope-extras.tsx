"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";

export default function ClauseScopeExtras() {
  const { data, setClauseField } = useContractStore();
  const clause = data.clauses.scopeExtras;

  return (
    <ClauseShell
      title="Extras fora do escopo"
      description="Demandas que vao alem do que foi combinado no contrato."
      insight="O cliente que fecha um pacote de Instagram muitas vezes comeca a pedir arte para flyer, video para TV, post para LinkedIn... Essa clausula deixa claro que qualquer coisa alem do combinado tem um preco — e precisa de aprovacao antes de voce executar."
      enabled={clause.enabled}
      onToggle={(v) => setClauseField("scopeExtras", "enabled", v)}
    />
  );
}
