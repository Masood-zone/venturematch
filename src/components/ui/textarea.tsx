import { cn } from "@/lib/utils";
import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="font-label-md text-label-md text-navy-deep">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3.5 py-3 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm",
            "placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all resize-none",
            error ? "ring-2 ring-error/50" : "",
            className
          )}
          {...props}
        />
        {error && <p className="font-body-md text-body-md text-error">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
