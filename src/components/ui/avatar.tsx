import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name?: string;
  image?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-[12px]",
  md: "w-10 h-10 text-[14px]",
  lg: "w-12 h-12 text-[16px]",
  xl: "w-16 h-16 text-[20px]",
};

export function Avatar({ name, image, size = "md", online, className }: AvatarProps) {
  return (
    <div className={cn("relative flex-shrink-0", className)}>
      <div className={cn("rounded-full bg-navy-deep flex items-center justify-center overflow-hidden", sizeMap[size])}>
        {image ? (
          <img src={image} alt={name ?? ""} className="w-full h-full object-cover" />
        ) : (
          <span className="text-on-primary font-semibold">
            {name ? getInitials(name) : <span className="material-symbols-outlined text-[16px]">person</span>}
          </span>
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-teal-accent ring-2 ring-surface-pure" />
      )}
    </div>
  );
}
