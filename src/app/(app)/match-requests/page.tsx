import { getServerSession } from "@/server/permissions";
import { db } from "@/lib/db";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatRelativeTime } from "@/lib/utils";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Match Requests" };

export default async function MatchRequestsPage() {
  const session = await getServerSession();
  if (!session?.user) return null;

  // Pending invitations where user is recipient
  const invitations = await db.ventureInvitation.findMany({
    where: { recipientUserId: session.user.id, status: "PENDING" },
    include: {
      venture: { include: { owner: { select: { id: true, name: true, image: true } }, primarySector: true } },
      sender: { select: { id: true, name: true, image: true } },
      recommendation: { include: { factorScores: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Match Requests</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Ventures that want to work with you.</p>
          </div>
          {invitations.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber-warm/20 text-amber-warm font-label-md text-label-md font-semibold">
              {invitations.length} pending
            </span>
          )}
        </div>

        {invitations.length === 0 ? (
          <EmptyState icon="mail" title="No pending requests" description="When ventures invite you to join, requests will appear here." />
        ) : (
          <div className="space-y-3">
            {invitations.map(inv => (
              <div key={inv.id} className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                <div className="flex items-start gap-space-md flex-wrap">
                  <div className="w-12 h-12 rounded-2xl bg-navy-deep flex items-center justify-center flex-shrink-0">
                    <MaterialSymbol icon="rocket_launch" className="text-on-primary text-[22px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="font-title-md text-title-md text-navy-deep font-semibold">{inv.venture.name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {inv.venture.primarySector && <span className="font-label-sm text-label-sm text-on-surface-variant">{inv.venture.primarySector.name}</span>}
                          <VentureStageBadge stage={inv.venture.stage} />
                        </div>
                      </div>
                      {inv.recommendation && <MatchScoreBadge score={inv.recommendation.overallScore} size="md" />}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar name={inv.sender.name} image={inv.sender.image} size="xs" />
                      <span className="font-label-sm text-label-sm text-on-surface-variant">from {inv.sender.name} · {formatRelativeTime(inv.createdAt)}</span>
                    </div>
                    {inv.message && (
                      <div className="mt-3 p-3 rounded-xl bg-surface-subtle">
                        <p className="font-body-md text-body-md text-on-surface italic">&ldquo;{inv.message}&rdquo;</p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/invitations/${inv.id}`}
                        className="inline-flex items-center gap-2 h-10 px-4 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all"
                      >
                        <MaterialSymbol icon="open_in_new" className="text-[18px]" />
                        Review Invitation
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
