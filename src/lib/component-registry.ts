import type { StepComponentRegistry, PdfComponentRegistry } from "@/types/contract-config";

import StepFreelancer from "@/components/form/step-freelancer";
import StepClient from "@/components/form/step-client";
import StepPlatforms from "@/components/form/step-platforms";
import StepScope from "@/components/form/step-scope";
import StepPayment from "@/components/form/step-payment";
import ClauseRevision from "@/components/form/clause-revision";
import ClauseApproval from "@/components/form/clause-approval";
import ClauseScopeExtras from "@/components/form/clause-scope-extras";
import ClauseCancellation from "@/components/form/clause-cancellation";
import ClauseFilesPayment from "@/components/form/clause-files-payment";
import StepDuration from "@/components/form/step-duration";
import StepReview from "@/components/form/step-review";
import StepDownload from "@/components/form/step-download";
import ContractDocument from "@/components/pdf/contract-document";

export const STEP_REGISTRY: StepComponentRegistry = {
  StepFreelancer,
  StepClient,
  StepPlatforms,
  StepScope,
  StepPayment,
  ClauseRevision,
  ClauseApproval,
  ClauseScopeExtras,
  ClauseCancellation,
  ClauseFilesPayment,
  StepDuration,
  StepReview,
  StepDownload,
};

export const PDF_REGISTRY: PdfComponentRegistry = {
  SocialMediaContract: ContractDocument,
};
