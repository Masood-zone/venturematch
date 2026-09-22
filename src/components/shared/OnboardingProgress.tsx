import { cn } from "@/lib/utils";

import { MaterialSymbol } from "@/components/ui/material-symbol";
const STEPS = [
  { num: 1, label: "Academic", path: "/onboarding/academic" },
  { num: 2, label: "Capabilities", path: "/onboarding/capabilities" },
  { num: 3, label: "Interests", path: "/onboarding/interests" },
  { num: 4, label: "Preferences", path: "/onboarding/preferences" },
  { num: 5, label: "Talent DNA", path: "/onboarding/talent-dna" },
  { num: 6, label: "Complete", path: "/onboarding/complete" },
];

interface OnboardingProgressProps {
  current: number;
}

export function OnboardingProgress({ current }: OnboardingProgressProps) {
  return (
    <div className="flex items-center gap-1 mb-space-xl">
      {STEPS.map((step, idx) => {
        const done = step.num < current;
        const active = step.num === current;
        return (
          <div key={step.num} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full font-label-sm text-label-sm font-bold shadow-sm transition-all",
                  done && "bg-teal-accent text-on-primary",
                  active && "bg-navy-deep text-on-primary ring-2 ring-navy-deep/30",
                  !done && !active && "bg-surface-container-high text-outline"
                )}
              >
                {done ? (
                  <MaterialSymbol icon="check" className="text-[14px]" />
                ) : (
                  step.num
                )}
              </span>
              <span className={cn(
                "font-label-sm text-label-sm hidden sm:block",
                active ? "text-navy-deep font-semibold" : done ? "text-teal-accent" : "text-outline"
              )}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                "w-8 lg:w-12 h-0.5 rounded-full mb-4 mx-1 transition-colors",
                done ? "bg-teal-accent" : "bg-outline-variant/60"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
