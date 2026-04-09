import type { ContractTypeConfig } from "@/types/contract-config";
import type { DocType } from "@/types/contract";

function isDocValid(docType: DocType | null, doc: string): boolean {
  if (docType === null) return false;
  if (docType === "nao-fornecer") return true;
  return doc.trim().length > 0;
}

export const packageArtsConfig: ContractTypeConfig = {
  id: "package-arts",
  name: "Pacote de Artes Avulsas",
  description: "Contrato para projetos pontuais: um pacote fechado de peças com prazo, valor e condições definidos.",
  icon: "Package",
  pdfComponentKey: "PackageArtsContract",
  steps: [
    {
      key: "freelancer",
      componentKey: "StepFreelancer",
      title: "Seus dados",
      validate: (d) =>
        d.freelancerName.trim().length > 0 &&
        isDocValid(d.freelancerDocType, d.freelancerDoc),
    },
    {
      key: "client",
      componentKey: "StepClient",
      title: "Dados do cliente",
      validate: (d) =>
        d.clientName.trim().length > 0 &&
        isDocValid(d.clientDocType, d.clientDoc),
    },
    {
      key: "package-scope",
      componentKey: "StepPackageScope",
      title: "Pacote de serviços",
      validate: (d) => (d.packageArtTypes?.length ?? 0) > 0 && (d.packageTotalItems ?? 0) > 0,
    },
    {
      key: "package-payment",
      componentKey: "StepPackagePayment",
      title: "Pagamento",
      validate: (d) => (d.packagePrice ?? 0) > 0,
    },
    {
      key: "package-deadline",
      componentKey: "StepPackageDeadline",
      title: "Prazo de entrega",
      validate: (d) => (d.packageDeliveryDays ?? 0) > 0,
    },
    {
      key: "clause-package-revision",
      componentKey: "ClausePackageRevision",
      title: "Cláusula: Revisões",
      validate: () => true,
    },
    {
      key: "clause-package-cancellation",
      componentKey: "ClausePackageCancellation",
      title: "Cláusula: Cancelamento",
      validate: () => true,
    },
    {
      key: "clause-package-files",
      componentKey: "ClausePackageFiles",
      title: "Cláusula: Arquivos",
      validate: () => true,
    },
    {
      key: "package-review",
      componentKey: "StepPackageReview",
      title: "Resumo",
      validate: () => true,
    },
    {
      key: "download",
      componentKey: "StepDownload",
      title: "Seu contrato",
      validate: () => true,
    },
  ],
};
