import { MaterialSymbol } from "@/components/ui/material-symbol";
interface AuthShellProps {
  children: React.ReactNode;
  subtitle?: string;
}

export function AuthShell({ children, subtitle = "Onboarding" }: AuthShellProps) {
  return (
    <div className="bg-surface-subtle font-body-md text-on-surface antialiased selection:bg-teal-accent selection:text-on-primary min-h-screen flex flex-col justify-between">
      {/* Top bar */}
      <div className="w-full py-space-md px-gutter flex justify-center items-center">
        <div className="flex items-center gap-space-sm">
          <div className="w-7 h-7 rounded-lg bg-navy-deep flex items-center justify-center">
            <MaterialSymbol icon="rocket_launch" className="text-on-primary text-[16px]" />
          </div>
          <span className="font-title-md text-title-md text-navy-deep">VentureMatch</span>
          <span className="font-label-sm text-label-sm text-teal-accent uppercase tracking-wider font-bold">{subtitle}</span>
        </div>
      </div>

      {/* Content */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-gutter py-space-lg">
        {children}
      </main>

      {/* Footer */}
      <div className="w-full py-space-md px-gutter flex justify-center">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          © {new Date().getFullYear()} VentureMatch. All rights reserved.
        </p>
      </div>
    </div>
  );
}
