import type { ContractTypeConfig } from "@/types/contract-config";
import type { DocType } from "@/types/contract";

function isDocValid(docType: DocType | null, doc: string): boolean {
  if (docType === null) return false;
  if (docType === "nao-fornecer") return true;
  return doc.trim().length > 0;
}

export const socialMediaMonthlyConfig: ContractTypeConfig = {
  id: "social-media-monthly",
  name: "Serviço Mensal de Social Media",
  description: "Contrato de prestação de serviços recorrentes de social media para pessoas físicas ou jurídicas.",
  icon: "LayoutDashboard",
  pdfComponentKey: "SocialMediaContract",
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
      key: "platforms",
      componentKey: "StepPlatforms",
      title: "Plataformas",
      validate: (d) => d.platforms.length > 0,
    },
    {
      key: "scope",
      componentKey: "StepScope",
      title: "Escopo dos serviços",
      validate: () => true,
    },
    {
      key: "payment",
      componentKey: "StepPayment",
      title: "Pagamento",
      validate: (d) =>
        d.monthlyPrice > 0 && d.paymentDueDay >= 1 && d.paymentDueDay <= 31,
    },
    {
      key: "clause-revision",
      componentKey: "ClauseRevision",
      title: "Cláusula: Revisões",
      validate: () => true,
    },
    {
      key: "clause-approval",
      componentKey: "ClauseApproval",
      title: "Cláusula: Aprovação",
      validate: () => true,
    },
    {
      key: "clause-scope-extras",
      componentKey: "ClauseScopeExtras",
      title: "Cláusula: Extras",
      validate: () => true,
    },
    {
      key: "clause-cancellation",
      componentKey: "ClauseCancellation",
      title: "Cláusula: Cancelamento",
      validate: () => true,
    },
    {
      key: "clause-files",
      componentKey: "ClauseFilesPayment",
      title: "Cláusula: Arquivos",
      validate: () => true,
    },
    {
      key: "duration",
      componentKey: "StepDuration",
      title: "Duração",
      validate: (d) => d.durationMonths > 0,
    },
    {
      key: "review",
      componentKey: "StepReview",
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
