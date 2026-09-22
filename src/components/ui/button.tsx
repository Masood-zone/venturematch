"use client";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, asChild, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-label-md text-label-md rounded-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/40";

    const variants = {
      primary: "bg-navy-deep text-on-primary hover:bg-on-primary-fixed shadow-sm hover:shadow-md",
      secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed",
      ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
      danger: "bg-error text-on-error hover:bg-error/90",
      outline: "border border-outline-variant bg-surface-pure text-on-surface hover:bg-surface-container-low",
    };

    const sizes = {
      sm: "h-8 px-3 text-[13px]",
      md: "h-11 px-4",
      lg: "h-12 px-6 text-[15px]",
    };

    const classes = cn(base, variants[variant], sizes[size], className);
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading && (
          <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";
