import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "teal" | "amber" | "navy" | "error" | "surface" | "secondary";
  className?: string;
}

export function Badge({ children, variant = "surface", className }: BadgeProps) {
  const variants = {
    teal: "bg-secondary-container text-on-secondary-container",
    amber: "bg-tertiary-fixed text-on-tertiary-container",
    navy: "bg-primary-container text-on-primary",
    error: "bg-error-container text-on-error-container",
    surface: "bg-surface-container-high text-on-surface-variant",
    secondary: "bg-secondary-container text-on-secondary-container",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
