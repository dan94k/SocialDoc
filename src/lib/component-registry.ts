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
import StepPackageScope from "@/components/form/step-package-scope";
import StepPackagePayment from "@/components/form/step-package-payment";
import StepPackageDeadline from "@/components/form/step-package-deadline";
import ClausePackageRevision from "@/components/form/clause-package-revision";
import ClausePackageCancellation from "@/components/form/clause-package-cancellation";
import ClausePackageFiles from "@/components/form/clause-package-files";
import StepPackageReview from "@/components/form/step-package-review";
import ContractDocument from "@/components/pdf/contract-document";
import ContractDocumentPackage from "@/components/pdf/contract-document-package";

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
  StepPackageScope,
  StepPackagePayment,
  StepPackageDeadline,
  ClausePackageRevision,
  ClausePackageCancellation,
  ClausePackageFiles,
  StepPackageReview,
};

export const PDF_REGISTRY: PdfComponentRegistry = {
  SocialMediaContract: ContractDocument,
  PackageArtsContract: ContractDocumentPackage,
};
