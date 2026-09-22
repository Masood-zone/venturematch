import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  variant?: "teal" | "amber" | "navy";
  size?: "sm" | "md";
  className?: string;
  showLabel?: boolean;
}

export function Progress({ value, max = 100, variant = "teal", size = "sm", className, showLabel }: ProgressProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colors = {
    teal: "bg-teal-accent",
    amber: "bg-amber-warm",
    navy: "bg-navy-deep",
  };
  const heights = { sm: "h-1.5", md: "h-2.5" };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full rounded-full bg-surface-container-high overflow-hidden", heights[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", colors[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{pct}%</p>
      )}
    </div>
  );
}
