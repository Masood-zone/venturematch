"use client";
import { cn } from "@/lib/utils";

interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ items, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 p-1 bg-surface-container-low rounded-xl", className)}>
      {items.map(item => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-label-md text-label-md transition-all",
            active === item.key
              ? "bg-surface-pure text-navy-deep shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className={cn(
              "px-1.5 py-0.5 rounded-full font-label-sm text-label-sm text-[11px]",
              active === item.key ? "bg-navy-deep text-on-primary" : "bg-surface-container-high text-on-surface-variant"
            )}>
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
