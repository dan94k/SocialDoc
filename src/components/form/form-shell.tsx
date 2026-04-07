"use client";

import { useContractStore } from "@/stores/contract-store";
import { STEP_TITLES, TOTAL_STEPS } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import StepFreelancer from "./step-freelancer";
import StepClient from "./step-client";
import StepPlatforms from "./step-platforms";
import StepScope from "./step-scope";
import StepPayment from "./step-payment";
import ClauseRevision from "./clause-revision";
import ClauseApproval from "./clause-approval";
import ClauseScopeExtras from "./clause-scope-extras";
import ClauseCancellation from "./clause-cancellation";
import ClauseFilesPayment from "./clause-files-payment";
import StepDuration from "./step-duration";
import StepReview from "./step-review";
import StepDownload from "./step-download";

const STEPS = [
  StepFreelancer,    // 0
  StepClient,        // 1
  StepPlatforms,     // 2
  StepScope,         // 3
  StepPayment,       // 4
  ClauseRevision,    // 5
  ClauseApproval,    // 6
  ClauseScopeExtras, // 7
  ClauseCancellation,// 8
  ClauseFilesPayment,// 9
  StepDuration,      // 10
  StepReview,        // 11
  StepDownload,      // 12
];

export default function FormShell() {
  const { currentStep, nextStep, prevStep, isStepValid } = useContractStore();
  const StepComponent = STEPS[currentStep];
  const isLast = currentStep === TOTAL_STEPS - 1;
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{currentStep + 1} de {TOTAL_STEPS}</span>
          <span>{STEP_TITLES[currentStep]}</span>
        </div>
        <Progress value={progress} className="mb-8 h-2" />

        {/* Step content */}
        <div
          key={currentStep}
          className="animate-in fade-in slide-in-from-right-4 duration-200"
        >
          <StepComponent />
        </div>

        {/* Navigation */}
        {!isLast && (
          <div className="mt-8 flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep} className="flex-1">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar
              </Button>
            )}
            <Button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className="flex-1"
            >
              Continuar
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
