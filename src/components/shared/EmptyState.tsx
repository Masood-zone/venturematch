import { cn } from "@/lib/utils";

import { MaterialSymbol } from "@/components/ui/material-symbol";
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon = "search_off", title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-6", className)}>
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
        <MaterialSymbol icon={icon} className="text-[32px] text-on-surface-variant" />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-navy-deep mb-2">{title}</h3>
      {description && (
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
