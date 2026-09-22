import { getServerSession } from "@/server/permissions";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { CapabilityChip } from "@/components/shared/CapabilityChip";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Match Detail" };

const FACTOR_LABELS: Record<string, { label: string; icon: string; weight: number }> = {
  capability: { label: "Capability Coverage", icon: "psychology", weight: 35 },
  interest: { label: "Sector Interest", icon: "explore", weight: 20 },
  commitment: { label: "Commitment Match", icon: "schedule", weight: 15 },
  availability: { label: "Availability", icon: "calendar_today", weight: 10 },
  goal: { label: "Goal Alignment", icon: "flag", weight: 10 },
  workingStyle: { label: "Working Style", icon: "tune", weight: 5 },
  evidence: { label: "Skill Evidence", icon: "verified", weight: 5 },
};

export default async function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
  const session = await getServerSession();
  const { matchId } = await params;

  const rec = await db.matchRecommendation.findUnique({
    where: { id: matchId },
    include: {
      venture: {
        include: {
          owner: { select: { id: true, name: true, image: true } },
          primarySector: true,
          members: { where: { status: "ACTIVE" }, include: { user: { select: { id: true, name: true, image: true } } } },
          capabilityRequirements: { include: { capability: true } },
        },
      },
      factorScores: true,
    },
  });

  if (!rec) notFound();

  const userId = session?.user?.id;
  const existingInvite = userId ? await db.ventureInvitation.findFirst({
    where: { ventureId: rec.ventureId, recipientUserId: userId, status: { in: ["PENDING", "INTERESTED", "TRIAL_PROPOSED"] } },
  }) : null;

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-4xl mx-auto space-y-space-xl">
        <Link href="/matches" className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">
          <MaterialSymbol icon="arrow_back" className="text-[18px]" /> My Matches
        </Link>

        {/* Match header */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl">
          <div className="flex items-start gap-space-lg flex-wrap">
            <div className="w-16 h-16 rounded-2xl bg-navy-deep flex items-center justify-center flex-shrink-0 shadow-sm">
              <MaterialSymbol icon="rocket_launch" className="text-on-primary text-[28px]" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="font-headline-md text-headline-md text-navy-deep font-bold">{rec.venture.name}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {rec.venture.primarySector && <span className="font-label-sm text-label-sm text-on-surface-variant">{rec.venture.primarySector.name}</span>}
                    <VentureStageBadge stage={rec.venture.stage} />
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Founded by {rec.venture.owner.name}</p>
                </div>
                <MatchScoreBadge score={rec.overallScore} size="lg" showLabel />
              </div>
              {!existingInvite && (
                <div className="flex gap-3 mt-space-lg pt-space-md border-t border-surface-container-high">
                  <Link
                    href={`/invitations/new?ventureId=${rec.ventureId}&recommendationId=${rec.id}`}
                    className="inline-flex items-center gap-2 h-11 px-5 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all"
                  >
                    <MaterialSymbol icon="send" className="text-[18px]" />
                    Express Interest
                  </Link>
                  <Link
                    href={`/messages?start=${rec.venture.ownerId}`}
                    className="inline-flex items-center gap-2 h-11 px-4 border-2 border-outline-variant hover:border-navy-deep text-on-surface font-label-md text-label-md rounded-xl transition-all"
                  >
                    <MaterialSymbol icon="chat" className="text-[18px] text-teal-accent" />
                    Message Founder
                  </Link>
                </div>
              )}
              {existingInvite && (
                <div className="mt-space-md pt-space-md border-t border-surface-container-high flex items-center gap-2">
                  <MaterialSymbol icon="check_circle" className="text-[18px] text-teal-accent" />
                  <span className="font-body-md text-body-md text-on-surface-variant">Invitation status: <strong className="text-teal-accent">{existingInvite.status}</strong></span>
                  <Link href={`/invitations/${existingInvite.id}`} className="ml-2 font-label-md text-label-md text-teal-accent hover:underline">View →</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
          {/* Factor breakdown */}
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Match Score Breakdown</h2>
            <div className="space-y-4">
              {rec.factorScores.map(fs => {
                const meta = FACTOR_LABELS[fs.factor] ?? { label: fs.factor, icon: "data_usage", weight: 0 };
                return (
                  <div key={fs.factor}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <MaterialSymbol icon={meta.icon} className="text-[16px] text-teal-accent" />
                        <span className="font-label-md text-label-md text-navy-deep">{meta.label}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">({meta.weight}%)</span>
                      </div>
                      <span className="font-label-md text-label-md text-navy-deep font-semibold">{Math.round(fs.rawScore)}%</span>
                    </div>
                    <Progress value={fs.rawScore} variant={fs.rawScore >= 80 ? "teal" : fs.rawScore >= 60 ? "amber" : "navy"} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Venture details sidebar */}
          <div className="space-y-space-lg">
            <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
              <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Looking For</h2>
              <div className="flex flex-wrap gap-2">
                {rec.venture.capabilityRequirements.map(r => <CapabilityChip key={r.id} name={r.capability.name} />)}
              </div>
            </div>
            <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
              <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Current Team</h2>
              <div className="space-y-2">
                {rec.venture.members.map(m => (
                  <div key={m.userId} className="flex items-center gap-2">
                    <Avatar name={m.user?.name} size="sm" />
                    <span className="font-body-md text-body-md text-navy-deep">{m.user?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
