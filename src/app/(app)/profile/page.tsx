import { getServerSession } from "@/server/permissions";
import { talentRepository } from "@/server/repositories/talent.repository";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CapabilityChip } from "@/components/shared/CapabilityChip";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/sign-in");

  const profile = await talentRepository.findById(session.user.id);

  if (!profile) {
    redirect("/onboarding/academic");
  }

  const { user, academicProfile, capabilities, ventureInterests, founderPreference, availability } = profile;

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-4xl mx-auto space-y-space-xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-md">
          <div className="flex items-start gap-space-lg">
            <Avatar name={user.name} image={user.image} size="xl" online />
            <div>
              <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">{user.name}</h1>
              {academicProfile && (
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  {academicProfile.programme} • {profile.level}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${profile.discoverability ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}>
                  {profile.discoverability ? "Discoverable" : "Hidden"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                  {profile.availabilityStatus}
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-outline-variant bg-surface-pure text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-all self-start"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </Link>
        </div>

        {/* Profile strength */}
        <div className="p-space-lg rounded-2xl bg-surface-pure shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold">Profile Strength</h2>
            <span className="font-headline-sm text-headline-sm text-teal-accent font-bold">{profile.profileStrength}%</span>
          </div>
          <Progress value={profile.profileStrength} variant="teal" size="md" />
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            {profile.profileStrength < 60
              ? "Add more capabilities and evidence to boost your match score."
              : profile.profileStrength < 90
              ? "Looking good! Add bio and capability evidence for stronger matches."
              : "Excellent profile — you're highly discoverable."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
          {/* Academic */}
          <div className="p-space-lg rounded-2xl bg-surface-pure shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-teal-accent">school</span>
                Academic Background
              </h2>
            </div>
            {academicProfile ? (
              <div className="space-y-2">
                {[
                  { label: "Faculty", value: academicProfile.faculty },
                  { label: "Programme", value: academicProfile.programme },
                  { label: "Department", value: academicProfile.department },
                  { label: "Level", value: profile.level },
                  { label: "Graduating", value: profile.expectedGraduationYear },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-surface-container-high last:border-0">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{row.label}</span>
                    <span className="font-body-md text-body-md text-navy-deep font-medium">{String(row.value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant">No academic details added.</p>
            )}
          </div>

          {/* Preferences */}
          <div className="p-space-lg rounded-2xl bg-surface-pure shadow-sm">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[18px] text-teal-accent">tune</span>
              Preferences
            </h2>
            {founderPreference ? (
              <div className="space-y-2">
                {[
                  { label: "Commitment", value: founderPreference.commitmentLevel },
                  { label: "Venture Goal", value: founderPreference.ventureGoal },
                  { label: "Role Interest", value: founderPreference.preferredRoleCategory },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-surface-container-high last:border-0">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{row.label}</span>
                    <span className="font-body-md text-body-md text-navy-deep font-medium">{String(row.value).replace(/_/g, " ")}</span>
                  </div>
                ))}
                {availability && (
                  <div className="flex items-center justify-between py-1.5">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Weekly Hours</span>
                    <span className="font-body-md text-body-md text-navy-deep font-medium">{availability.weeklyHoursBand} hrs</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant">No preferences set.</p>
            )}
          </div>
        </div>

        {/* Capabilities */}
        <div className="p-space-lg rounded-2xl bg-surface-pure shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-teal-accent">psychology</span>
              Capabilities ({capabilities.length})
            </h2>
            <Link href="/profile/edit" className="font-label-md text-label-md text-teal-accent hover:underline">Manage</Link>
          </div>
          {capabilities.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant">No capabilities added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {capabilities.map(c => (
                <CapabilityChip
                  key={c.id}
                  name={c.capability.name}
                  proficiency={c.proficiency as never}
                  size="md"
                />
              ))}
            </div>
          )}
        </div>

        {/* Sector interests */}
        <div className="p-space-lg rounded-2xl bg-surface-pure shadow-sm">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[18px] text-teal-accent">explore</span>
            Venture Interests ({ventureInterests.length})
          </h2>
          {ventureInterests.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant">No sectors selected yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ventureInterests.map(vi => (
                <Badge key={vi.id} variant="teal">{vi.sector.name}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
