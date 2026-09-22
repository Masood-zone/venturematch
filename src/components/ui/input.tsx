import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, rightIcon, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="font-label-md text-label-md text-navy-deep">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none select-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full h-11 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm",
              "placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all",
              icon ? "pl-10 pr-3.5" : "px-3.5",
              rightIcon ? "pr-10" : "",
              error ? "ring-2 ring-error/50" : "",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-2.5 flex items-center">{rightIcon}</div>
          )}
        </div>
        {error && (
          <p className="font-body-md text-body-md text-error">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
