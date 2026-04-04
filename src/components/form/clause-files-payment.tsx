"use client";

import { useContractStore } from "@/stores/contract-store";
import ClauseShell from "./clause-shell";

export default function ClauseFilesPayment() {
  const { data, setClauseField } = useContractStore();
  const clause = data.clauses.filesPayment;

  return (
    <ClauseShell
      title="Arquivos editaveis apos pagamento"
      description="Os arquivos em formato aberto (PSD, AI, Figma...) so sao entregues apos quitacao."
      insight="Entregar os editaveis antes do pagamento e como entregar o produto antes de receber. Com essa clausula o cliente sabe desde o inicio que os arquivos finais so vem com a conta paga — isso elimina quase completamente os calotes no ultimo mes."
      enabled={clause.enabled}
      onToggle={(v) => setClauseField("filesPayment", "enabled", v)}
    />
  );
}
