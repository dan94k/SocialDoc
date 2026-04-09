import type { StepComponentRegistry, PdfComponentRegistry } from "@/types/contract-config";

import StepDownload from "@/components/form/step-download";
import ContractDocument from "@/components/pdf/contract-document";

export const STEP_REGISTRY: StepComponentRegistry = {
  StepDownload,
};

export const PDF_REGISTRY: PdfComponentRegistry = {
  SocialMediaContract: ContractDocument,
};
