"use client";

import { useContractStore } from "@/stores/contract-store";
import { STEP_TITLES, TOTAL_STEPS } from "@/lib/constants";
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
];

export default function FormShell() {
  const { currentStep, nextStep, prevStep, isStepValid } = useContractStore();
  const StepComponent = STEPS[currentStep];
  const isLast = currentStep === TOTAL_STEPS - 1;
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-4 py-10"
      style={{ background: "#f5f3ef", minHeight: "100vh" }}
    >
      <div className="w-full max-w-lg">

        {/* Progress header */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(5,11,24,0.4)" }}>
            {currentStep + 1} de {TOTAL_STEPS}
          </span>
          <span className="text-xs font-semibold" style={{ color: "rgba(5,11,24,0.5)" }}>
            {STEP_TITLES[currentStep]}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full rounded-full mb-8 overflow-hidden"
          style={{ height: "4px", background: "rgba(5,11,24,0.1)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "#050b18" }}
          />
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-7 md:p-8"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(5,11,24,0.07)",
            boxShadow: "0 4px 24px rgba(5,11,24,0.06)",
          }}
        >
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
                <button
                  onClick={prevStep}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-2xl py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(5,11,24,0.15)",
                    color: "rgba(5,11,24,0.6)",
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </button>
              )}
              <button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-2xl py-3 text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
                style={{ background: "#050b18", color: "#ffffff" }}
              >
                Continuar
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
