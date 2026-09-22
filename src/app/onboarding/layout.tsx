import { AuthShell } from "@/components/shared/AuthShell";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell subtitle="Setup">{children}</AuthShell>;
}
