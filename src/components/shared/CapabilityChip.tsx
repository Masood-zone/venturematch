import { cn } from "@/lib/utils";

import { MaterialSymbol } from "@/components/ui/material-symbol";
interface CapabilityChipProps {
  name: string;
  proficiency?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  removable?: boolean;
  onRemove?: () => void;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

const proficiencyColors = {
  BEGINNER: "bg-surface-container text-on-surface-variant",
  INTERMEDIATE: "bg-secondary-container/60 text-on-secondary-container",
  ADVANCED: "bg-secondary-container text-on-secondary-container",
  EXPERT: "bg-teal-accent text-on-primary",
};

const proficiencyDots = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

export function CapabilityChip({
  name,
  proficiency,
  removable,
  onRemove,
  selected,
  onClick,
  size = "md",
}: CapabilityChipProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full transition-all",
        size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-[13px]",
        "font-medium",
        proficiency ? proficiencyColors[proficiency] : "bg-surface-container-high text-on-surface-variant",
        selected && "bg-navy-deep text-on-primary",
        onClick && "cursor-pointer hover:opacity-80",
      )}
    >
      {proficiency && (
        <span className="flex gap-0.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-1 h-1 rounded-full",
                i < proficiencyDots[proficiency] ? "bg-current opacity-100" : "bg-current opacity-20"
              )}
            />
          ))}
        </span>
      )}
      {name}
      {removable && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          className="ml-0.5 hover:opacity-70 transition-opacity"
        >
          <MaterialSymbol icon="close" className="text-[14px]" />
        </button>
      )}
    </div>
  );
}
