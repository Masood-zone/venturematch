import { getServerSession } from "@/server/permissions";
import { talentRepository } from "@/server/repositories/talent.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { CapabilityChip } from "@/components/shared/CapabilityChip";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
  const { userId } = await params;
  const profile = await talentRepository.findById(userId);
  return { title: profile?.user.name ?? "Student Profile" };
}

export default async function StudentProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const session = await getServerSession();
  const { userId } = await params;
  const profile = await talentRepository.findById(userId);
  if (!profile || !profile.discoverability) notFound();

  const isOwnProfile = session?.user.id === userId;

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        {/* Back */}
        <Link href="/discover/people" className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">
          <MaterialSymbol icon="arrow_back" className="text-[18px]" /> Back to Discover
        </Link>

        {/* Profile card */}
        <div className="bg-surface-pure rounded-2xl shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-br from-navy-deep via-navy-deep/90 to-teal-accent/30 relative">
            <div className="absolute bottom-0 left-space-xl translate-y-1/2">
              <Avatar name={profile.user.name} image={profile.user.image} size="xl" online />
            </div>
          </div>
          <div className="px-space-xl pt-12 pb-space-lg">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-headline-md text-headline-md text-navy-deep font-bold">{profile.user.name}</h1>
                {profile.academicProfile && (
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    {profile.academicProfile.programme} • Level {profile.level}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                    {profile.availabilityStatus}
                  </span>
                  {profile.availability && (
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {profile.availability.weeklyHoursBand} hrs/week
                    </span>
                  )}
                </div>
              </div>
              {!isOwnProfile && (
                <form action={`/api/v1/messages/start`} method="POST">
                  <Link
                    href={`/messages?start=${userId}`}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-navy-deep text-on-primary font-label-md text-label-md shadow-sm hover:bg-on-primary-fixed transition-all"
                  >
                    <MaterialSymbol icon="chat" className="text-[18px]" />
                    Message
                  </Link>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Capabilities */}
        {profile.capabilities.length > 0 && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2 mb-4">
              <MaterialSymbol icon="psychology" className="text-[18px] text-teal-accent" />
              Capabilities
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.capabilities.map(c => (
                <CapabilityChip key={c.id} name={c.capability.name} proficiency={c.proficiency as never} />
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {profile.ventureInterests.length > 0 && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2 mb-4">
              <MaterialSymbol icon="explore" className="text-[18px] text-teal-accent" />
              Venture Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.ventureInterests.map(vi => (
                <Badge key={vi.id} variant="teal">{vi.sector.name}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Preferences */}
        {profile.founderPreference && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2 mb-4">
              <MaterialSymbol icon="tune" className="text-[18px] text-teal-accent" />
              Working Style
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Commitment", value: profile.founderPreference.commitmentLevel.replace(/_/g, " ") },
                { label: "Goal", value: profile.founderPreference.ventureGoal ?? "—" },
                { label: "Hours/week", value: profile.availability?.weeklyHoursBand ? `${profile.availability.weeklyHoursBand} hrs` : "—" },
              ].map(row => (
                <div key={row.label} className="p-3 rounded-xl bg-surface-subtle">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{row.label}</p>
                  <p className="font-title-md text-title-md text-navy-deep font-semibold mt-1">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
