import { getServerSession } from "@/server/permissions";
import { venturesRepository } from "@/server/repositories/ventures.repository";
import { matchingRepository } from "@/server/repositories/matching.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { CapabilityChip } from "@/components/shared/CapabilityChip";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ ventureId: string }> }): Promise<Metadata> {
  const { ventureId } = await params;
  const venture = await venturesRepository.findById(ventureId);
  return { title: venture?.name ?? "Venture" };
}

export default async function DiscoverVentureDetailPage({ params }: { params: Promise<{ ventureId: string }> }) {
  const session = await getServerSession();
  const { ventureId } = await params;

  const venture = await venturesRepository.findById(ventureId);
  if (!venture || venture.status !== "ACTIVE") notFound();

  // Check if there's a match recommendation
  const recommendation = session?.user
    ? await matchingRepository.findRecommendation(ventureId, session.user.id)
    : null;

  const isOwner = session?.user.id === venture.ownerId;
  const isMember = venture.members.some(m => m.userId === session?.user?.id && m.status === "ACTIVE");

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-4xl mx-auto space-y-space-xl">
        <Link href="/discover/ventures" className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Discover
        </Link>

        {/* Hero card */}
        <div className="bg-surface-pure rounded-2xl shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-navy-deep to-teal-accent/30" />
          <div className="p-space-xl -mt-6">
            <div className="flex items-start gap-space-lg flex-wrap">
              <div className="w-16 h-16 rounded-2xl bg-navy-deep flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="material-symbols-outlined text-on-primary text-[28px]">rocket_launch</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h1 className="font-headline-md text-headline-md text-navy-deep font-bold">{venture.name}</h1>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <VentureStageBadge stage={venture.stage} />
                      {venture.primarySector && <span className="font-label-sm text-label-sm text-on-surface-variant">{venture.primarySector.name}</span>}
                    </div>
                  </div>
                  {recommendation && (
                    <MatchScoreBadge score={recommendation.overallScore} size="lg" showLabel />
                  )}
                </div>

                {venture.shortPitch && (
                  <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 leading-relaxed">{venture.shortPitch}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            {!isOwner && !isMember && (
              <div className="flex items-center gap-3 mt-space-lg pt-space-lg border-t border-surface-container-high">
                <Link
                  href={`/invitations/new?ventureId=${ventureId}`}
                  className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Express Interest
                </Link>
                <Link
                  href={`/messages?start=${venture.ownerId}`}
                  className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border-2 border-outline-variant hover:border-navy-deep text-on-surface font-label-md text-label-md transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] text-teal-accent">chat</span>
                  Message Founder
                </Link>
              </div>
            )}
            {isOwner && (
              <div className="mt-space-lg pt-space-lg border-t border-surface-container-high">
                <Link href={`/ventures/${venture.id}`} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md transition-all hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-[18px] text-teal-accent">settings</span>
                  Manage Venture
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
          {/* Details */}
          <div className="space-y-space-lg">
            {venture.problem && (
              <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                <h2 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[18px] text-teal-accent">search</span>
                  Problem
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{venture.problem}</p>
              </div>
            )}
            {venture.solution && (
              <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                <h2 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[18px] text-teal-accent">lightbulb</span>
                  Solution
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{venture.solution}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-space-lg">
            {/* Team */}
            <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
              <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Team ({venture.members.length})</h2>
              <div className="space-y-3">
                {venture.members.filter(m => m.status === "ACTIVE").map(m => (
                  <div key={m.userId} className="flex items-center gap-3">
                    <Avatar name={m.user?.name} size="sm" />
                    <div>
                      <p className="font-label-md text-label-md text-navy-deep font-semibold">{m.user?.name}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{m.membershipType}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required capabilities */}
            {venture.capabilityRequirements.length > 0 && (
              <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Looking For</h2>
                <div className="flex flex-wrap gap-2">
                  {venture.capabilityRequirements.map(r => (
                    <CapabilityChip key={r.id} name={r.capability.name} />
                  ))}
                </div>
              </div>
            )}

            {/* Commitment */}
            <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
              <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Commitment Expected</h2>
              <p className="font-body-md text-body-md text-on-surface">{venture.expectedCommitment.replace(/_/g, " ")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
