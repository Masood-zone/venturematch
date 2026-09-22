import * as React from "react";

import { cn } from "@/lib/utils";

type MaterialSymbolProps = React.HTMLAttributes<HTMLSpanElement> & {
  icon: string;
  filled?: boolean;
};

export function MaterialSymbol({
  icon,
  filled,
  className,
  ...props
}: MaterialSymbolProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined select-none leading-none",
        filled && "filled",
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      {icon}
    </span>
  );
}
