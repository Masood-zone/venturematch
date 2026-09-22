import { venturesRepository } from "@/server/repositories/ventures.repository";
import { matchingRepository } from "@/server/repositories/matching.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Recruit" };

export default async function VentureRecruitPage({ params }: { params: Promise<{ ventureId: string }> }) {
  const { ventureId } = await params;
  const venture = await venturesRepository.findById(ventureId);
  if (!venture) notFound();

  const recs = await matchingRepository.getRecommendationsForVenture(ventureId, 10);
  const pendingInvites = await matchingRepository.getInvitationsForVenture(ventureId);

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-4xl mx-auto space-y-space-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-3">
            <Link href={`/ventures/${ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
              <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
            </Link>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Recruit</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Find and invite the right co-founders.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/ventures/${ventureId}/recommendations`}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-teal-accent text-on-primary font-label-md text-label-md shadow-sm hover:bg-secondary transition-all"
            >
              <MaterialSymbol icon="auto_awesome" className="text-[18px]" />
              Run Matching
            </Link>
            <Link
              href={`/invitations/new?ventureId=${ventureId}`}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-navy-deep text-on-primary font-label-md text-label-md shadow-sm hover:bg-on-primary-fixed transition-all"
            >
              <MaterialSymbol icon="send" className="text-[18px]" />
              Direct Invite
            </Link>
          </div>
        </div>

        {/* Pending invitations */}
        {pendingInvites.length > 0 && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Pending Invitations ({pendingInvites.length})</h2>
            <div className="space-y-3">
              {pendingInvites.map(inv => (
                <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle">
                  <Avatar name={inv.recipient.name} image={inv.recipient.image} size="sm" />
                  <div className="flex-1">
                    <p className="font-label-md text-label-md text-navy-deep font-semibold">{inv.recipient.name}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{inv.proposedRole ?? "Co-founder"}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${
                    inv.status === "INTERESTED" ? "bg-secondary-container text-on-secondary-container" :
                    inv.status === "PENDING" ? "bg-amber-warm/20 text-amber-warm" :
                    "bg-surface-container-high text-on-surface-variant"
                  }`}>{inv.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top recommendations */}
        {recs.length === 0 ? (
          <EmptyState
            icon="person_search"
            title="No recommendations yet"
            description="Run the matching algorithm first to generate co-founder recommendations based on your capability gaps."
            action={
              <Link href={`/ventures/${ventureId}/recommendations`} className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm">
                <MaterialSymbol icon="auto_awesome" className="text-[18px]" />
                Run Matching
              </Link>
            }
          />
        ) : (
          <div className="space-y-space-md">
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Top Matches for Your Gaps</h2>
            <div className="space-y-3">
              {recs.map(rec => (
                <div key={rec.id} className="bg-surface-pure rounded-2xl shadow-sm p-space-lg flex items-start gap-space-md flex-wrap">
                  <Avatar name={rec.candidate.name} image={rec.candidate.image} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-title-md text-title-md text-navy-deep font-semibold">{rec.candidate.name}</h3>
                      <MatchScoreBadge score={rec.overallScore} size="md" />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/invitations/new?ventureId=${ventureId}&recipientId=${rec.candidateUserId}&recommendationId=${rec.id}`}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-navy-deep text-on-primary font-label-sm text-label-sm shadow-sm hover:bg-on-primary-fixed transition-all"
                      >
                        <MaterialSymbol icon="send" className="text-[16px]" />
                        Invite
                      </Link>
                      <Link
                        href={`/students/${rec.candidateUserId}`}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-all"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
