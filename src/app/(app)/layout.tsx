import { getServerSession } from "@/server/permissions";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shared/AppShell";
import { db } from "@/lib/db";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in");

  let subtitle: string | undefined;
  try {
    const profile = await db.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: { academicProfile: true },
    });
    if (profile?.academicProfile?.programme) {
      subtitle = [profile.academicProfile.programme, profile.level].filter(Boolean).join(" · ");
    }
  } catch {}

  return (
    <AppShell
      user={{ name: session.user.name, image: session.user.image, role: session.user.role ?? "student" }}
      profileSubtitle={subtitle}
    >
      {children}
    </AppShell>
  );
}
