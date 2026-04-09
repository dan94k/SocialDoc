"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";

export default function ClauseFilesPayment() {
  const { data, setClauseField } = useContractStore();
  const clause = data.clauses.filesPayment;

  return (
    <ClauseShell
      title="Arquivos editáveis após pagamento"
      description="Os arquivos em formato aberto (PSD, AI, Figma...) só são entregues após quitação."
      insight="Entregar os editáveis antes do pagamento é como entregar o produto antes de receber. Com essa cláusula o cliente sabe desde o início que os arquivos finais só vêm com a conta paga — isso elimina quase completamente os calotes no último mês."
      enabled={clause.enabled}
      onToggle={(v) => setClauseField("filesPayment", "enabled", v)}
    />
  );
}
