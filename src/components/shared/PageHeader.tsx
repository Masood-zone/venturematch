import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  back?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, back, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-space-md", className)}>
      <div>
        {back && <div className="mb-2">{back}</div>}
        <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">{title}</h1>
        {subtitle && (
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-space-md self-start md:self-auto">{action}</div>}
    </div>
  );
}
