import { cn } from "@/lib/utils";

const stageConfig: Record<string, { label: string; color: string }> = {
  IDEA: { label: "Idea", color: "bg-surface-container-high text-on-surface-variant" },
  VALIDATION: { label: "Validation", color: "bg-tertiary-fixed text-on-tertiary-container" },
  PROTOTYPE: { label: "Prototype", color: "bg-secondary-container text-on-secondary-container" },
  EARLY_LAUNCH: { label: "Early Launch", color: "bg-teal-accent/20 text-teal-accent" },
  OPERATE: { label: "Operating", color: "bg-navy-deep text-on-primary" },
};

interface VentureStageBadgeProps {
  stage: string;
  className?: string;
}

export function VentureStageBadge({ stage, className }: VentureStageBadgeProps) {
  const config = stageConfig[stage] ?? { label: stage, color: "bg-surface-container text-on-surface-variant" };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
