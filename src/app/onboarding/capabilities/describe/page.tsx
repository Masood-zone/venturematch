"use client";
import { useRouter } from "next/navigation";
import { OnboardingProgress } from "@/components/shared/OnboardingProgress";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export default function CapabilitiesDescribePage() {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-space-md">
      <OnboardingProgress current={2} />
      <div className="bg-surface-pure rounded-2xl shadow-md p-space-lg lg:p-space-xl">
        <div className="flex items-start justify-between mb-space-lg">
          <div>
            <span className="font-label-sm text-label-sm text-teal-accent font-bold uppercase tracking-wider">Step 2 of 5 — Details</span>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight mt-1">Describe your top capabilities</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Add context to your selected skills so ventures can better understand your experience level.
            </p>
          </div>
          <MaterialSymbol icon="edit_note" className="text-[28px] text-teal-accent" />
        </div>

        <div className="p-space-lg rounded-xl bg-surface-subtle text-center">
          <MaterialSymbol icon="psychology" className="text-[40px] text-on-surface-variant mb-3 block" />
          <p className="font-body-md text-body-md text-on-surface-variant">
            You&apos;ll add capability evidence and descriptions in your full profile after completing onboarding.
          </p>
        </div>

        <div className="flex items-center justify-between pt-space-lg border-t border-surface-container-high mt-space-lg">
          <button onClick={() => router.back()} className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-navy-deep">
            <MaterialSymbol icon="arrow_back" className="text-[18px]" /> Back
          </button>
          <button
            onClick={() => router.push("/onboarding/interests")}
            className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all"
          >
            Continue <MaterialSymbol icon="arrow_forward" className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
