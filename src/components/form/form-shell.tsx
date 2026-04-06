"use client";

import { useContractStore } from "@/stores/contract-store";
import { STEP_TITLES, TOTAL_STEPS } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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
  StepFreelancer,       // 0
  StepClient,           // 1
  StepPlatforms,        // 2
  StepScope,            // 3
  StepPayment,          // 4
  ClauseRevision,       // 5
  ClauseApproval,       // 6
  ClauseScopeExtras,    // 7
  ClauseCancellation,   // 8
  ClauseFilesPayment,   // 9
  StepDuration,         // 10
  StepReview,           // 11
  StepDownload,         // 12
];

export default function FormShell() {
  const { currentStep, nextStep, prevStep, isStepValid } = useContractStore();
  const StepComponent = STEPS[currentStep];
  const isLast = currentStep === TOTAL_STEPS - 1;
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FileText className="h-5 w-5 text-primary" />
            SocialDoc
          </Link>
          <div className="flex items-center gap-3">
            {user?.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata?.full_name ?? "Avatar"}
                className="h-8 w-8 rounded-full border"
              />
            )}
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Form content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {currentStep + 1} de {TOTAL_STEPS}
          </span>
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
    </div>
  );
}
