import { Button } from "@/components/ui/button";

import { MaterialSymbol } from "@/components/ui/material-symbol";
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-error-container flex items-center justify-center mb-4">
        <MaterialSymbol icon="error" className="text-[32px] text-on-error-container" />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-navy-deep mb-2">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          <MaterialSymbol icon="refresh" className="text-[18px]" />
          Try Again
        </Button>
      )}
    </div>
  );
}
