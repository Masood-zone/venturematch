"use client";
import { useRouter } from "next/navigation";
import { OnboardingProgress } from "@/components/shared/OnboardingProgress";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export default function TalentDNAPage() {
  const router = useRouter();

  async function handleContinue() {
    await fetch("/api/v1/profile/onboarding/complete", { method: "POST" });
    router.push("/onboarding/complete");
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-space-md">
      <OnboardingProgress current={5} />

      <div className="bg-surface-pure rounded-2xl shadow-md p-space-lg lg:p-space-xl">
        <div className="text-center mb-space-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary-container mb-space-md shadow-sm">
            <MaterialSymbol icon="psychology" className="text-[32px] text-on-secondary-container" />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep font-bold tracking-tight mb-2">Your Talent DNA</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">
            Based on your inputs, we&apos;ve built your initial Talent DNA profile. This powers your match score and venture recommendations.
          </p>
        </div>

        {/* DNA summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-xl">
          {[
            { icon: "psychology", label: "Capabilities", desc: "Your skills have been mapped to the capability taxonomy", color: "text-teal-accent" },
            { icon: "explore", label: "Venture Interests", desc: "Sector preferences captured for match alignment", color: "text-navy-deep" },
            { icon: "tune", label: "Working Style", desc: "Your collaboration preferences recorded", color: "text-amber-warm" },
            { icon: "schedule", label: "Availability", desc: "Weekly hours and commitment level set", color: "text-teal-accent" },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-surface-subtle">
              <div className="w-9 h-9 rounded-lg bg-surface-pure flex items-center justify-center flex-shrink-0 shadow-sm">
                <MaterialSymbol icon={item.icon} className={`text-[20px] ${item.color}`} />
              </div>
              <div>
                <span className="font-title-md text-title-md text-navy-deep font-semibold">{item.label}</span>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">{item.desc}</p>
              </div>
              <MaterialSymbol icon="check_circle" className="text-teal-accent text-[20px] ml-auto flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Match score preview */}
        <div className="p-space-lg rounded-2xl bg-navy-deep text-on-primary mb-space-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="font-title-md text-title-md font-semibold">Initial Profile Strength</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-teal-accent">
              <MaterialSymbol icon="verified" className="text-[16px]" />
              <span className="font-label-sm text-label-sm font-bold">Ready for Matching</span>
            </div>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-teal-accent transition-all duration-1000" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-label-sm text-label-sm text-on-primary/60">Complete your profile after launch</span>
            <span className="font-title-md text-title-md text-teal-accent font-bold">75%</span>
          </div>
        </div>

        {/* Info note */}
        <div className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-3 mb-space-xl">
          <MaterialSymbol icon="info" className="text-[20px] text-teal-accent flex-shrink-0 mt-0.5" />
          <p className="font-body-md text-body-md text-on-surface-variant">
            Your Talent DNA improves over time as you add capability evidence, complete trials, and receive endorsements from co-founders.
          </p>
        </div>

        <div className="flex items-center justify-between pt-space-md border-t border-surface-container-high">
          <button onClick={() => router.back()} className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-navy-deep">
            <MaterialSymbol icon="arrow_back" className="text-[18px]" /> Back
          </button>
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-2 h-11 px-6 bg-teal-accent hover:bg-secondary text-on-primary font-label-md text-label-md rounded-xl shadow-sm transition-all"
          >
            Complete Setup <MaterialSymbol icon="check" className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
