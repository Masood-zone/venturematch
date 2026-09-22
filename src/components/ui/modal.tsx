"use client";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

import { MaterialSymbol } from "@/components/ui/material-symbol";
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full bg-surface-pure rounded-2xl shadow-xl", sizes[size])}>
        {title && (
          <div className="flex items-center justify-between px-space-lg py-4 border-b border-surface-container-high">
            <h2 className="font-headline-sm text-headline-sm text-navy-deep">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <MaterialSymbol icon="close" className="text-[20px] text-on-surface-variant" />
            </button>
          </div>
        )}
        <div className="p-space-lg">{children}</div>
      </div>
    </div>
  );
}
