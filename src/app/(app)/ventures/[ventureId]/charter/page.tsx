import { venturesRepository } from "@/server/repositories/ventures.repository";
import { getServerSession } from "@/server/permissions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Team Charter" };

export default async function VentureCharterPage({ params }: { params: Promise<{ ventureId: string }> }) {
  const session = await getServerSession();
  const { ventureId } = await params;
  const venture = await venturesRepository.findById(ventureId);
  if (!venture) notFound();

  const charter = await venturesRepository.getCharter(ventureId);
  const isOwner = session?.user.id === venture.ownerId;

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/ventures/${ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
            </Link>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Team Charter</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">{venture.name}</p>
            </div>
          </div>
          {charter && <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm ${charter.status === "ACTIVE" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}>{charter.status}</span>}
        </div>

        {!charter ? (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant block mb-3">description</span>
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold mb-2">No Team Charter yet</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">A Team Charter documents roles, commitments, and working agreements for the founding team.</p>
          </div>
        ) : (
          <div className="space-y-space-lg">
            {/* Agreement fields */}
            <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
              <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Working Agreements</h2>
              <div className="space-y-3">
                {[
                  { label: "Meeting Frequency", value: charter.meetingFrequency, icon: "calendar_today" },
                  { label: "Communication Method", value: charter.communicationMethod, icon: "chat" },
                  { label: "Decision Method", value: charter.decisionMethod, icon: "how_to_vote" },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle">
                    <span className="material-symbols-outlined text-[18px] text-teal-accent">{row.icon}</span>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{row.label}</p>
                      <p className="font-body-md text-body-md text-navy-deep">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {charter.expectationsText && (
                <div className="mt-4 p-3 rounded-xl bg-surface-subtle">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Expectations</p>
                  <p className="font-body-md text-body-md text-on-surface">{charter.expectationsText}</p>
                </div>
              )}
            </div>

            {/* Members */}
            {charter.members.length > 0 && (
              <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Charter Members</h2>
                <div className="space-y-3">
                  {charter.members.map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle">
                      <Avatar name={m.user.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-label-md text-label-md text-navy-deep font-semibold">{m.user.name}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{m.roleTitle ?? "Team Member"}</p>
                      </div>
                      {m.weeklyCommitmentHours && (
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{m.weeklyCommitmentHours} hrs/week</span>
                      )}
                      {m.confirmedAt && (
                        <span className="material-symbols-outlined text-[18px] text-teal-accent">verified</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Objectives */}
            {charter.objectives.length > 0 && (
              <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Team Objectives</h2>
                <ol className="space-y-2">
                  {charter.objectives.map((obj, i) => (
                    <li key={obj.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle">
                      <span className="w-7 h-7 rounded-full bg-navy-deep text-on-primary flex items-center justify-center font-label-sm text-label-sm font-bold flex-shrink-0">{i + 1}</span>
                      <span className="font-body-md text-body-md text-on-surface">{obj.title}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
