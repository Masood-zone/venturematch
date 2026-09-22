import { getServerSession } from "@/server/permissions";
import { db } from "@/lib/db";
import Link from "next/link";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatRelativeTime } from "@/lib/utils";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Opportunities" };

export default async function OpportunitiesPage() {
  const session = await getServerSession();
  if (!session?.user) return null;

  const invitations = await db.ventureInvitation.findMany({
    where: { recipientUserId: session.user.id },
    include: {
      venture: { include: { primarySector: true, owner: { select: { name: true } } } },
      sender: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColor: Record<string, string> = {
    PENDING: "bg-amber-warm/20 text-amber-warm",
    INTERESTED: "bg-secondary-container text-on-secondary-container",
    DECLINED: "bg-surface-container-high text-on-surface-variant",
    WITHDRAWN: "bg-surface-container-high text-on-surface-variant",
    TRIAL_PROPOSED: "bg-navy-deep text-on-primary",
  };

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Opportunities</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">All venture invitations you&apos;ve received.</p>
        </div>

        {invitations.length === 0 ? (
          <EmptyState icon="mail" title="No opportunities yet" description="When venture founders invite you to collaborate, they'll appear here." />
        ) : (
          <div className="space-y-3">
            {invitations.map(inv => (
              <Link
                key={inv.id}
                href={`/invitations/${inv.id}`}
                className="flex items-center gap-space-md bg-surface-pure rounded-2xl shadow-sm p-space-lg hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-navy-deep flex items-center justify-center flex-shrink-0">
                  <MaterialSymbol icon="rocket_launch" className="text-on-primary text-[22px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-title-md text-title-md text-navy-deep font-semibold group-hover:text-teal-accent transition-colors truncate">{inv.venture.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {inv.venture.primarySector && <span className="font-label-sm text-label-sm text-on-surface-variant">{inv.venture.primarySector.name}</span>}
                    <VentureStageBadge stage={inv.venture.stage} />
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">from {inv.sender.name} · {formatRelativeTime(inv.createdAt)}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm flex-shrink-0 ${statusColor[inv.status] ?? "bg-surface-container text-on-surface-variant"}`}>
                  {inv.status}
                </span>
                <MaterialSymbol icon="chevron_right" className="text-[20px] text-on-surface-variant group-hover:text-teal-accent transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
