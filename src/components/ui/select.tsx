import { cn } from "@/lib/utils";
import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="font-label-md text-label-md text-navy-deep">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full h-11 px-3.5 pr-10 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm appearance-none",
              "focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all cursor-pointer",
              error ? "ring-2 ring-error/50" : "",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
            expand_more
          </span>
        </div>
        {error && <p className="font-body-md text-body-md text-error">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
