import { cn } from "@/lib/utils";
import { getMatchLabel } from "@/lib/utils";

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function MatchScoreBadge({ score, size = "md", showLabel, className }: MatchScoreBadgeProps) {
  const { label, color } = getMatchLabel(score);

  const colorMap: Record<string, string> = {
    teal: "bg-secondary-container text-on-secondary-container",
    amber: "bg-tertiary-fixed text-on-tertiary-container",
    navy: "bg-surface-container-high text-on-surface-variant",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-[13px] px-2.5 py-1",
    lg: "text-[16px] px-3 py-1.5",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "rounded-full font-semibold inline-flex items-center gap-1",
          colorMap[color],
          sizes[size]
        )}
      >
        <span className="material-symbols-outlined text-[14px]">verified</span>
        {score}%
      </span>
      {showLabel && (
        <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
      )}
    </div>
  );
}
