import { getServerSession } from "@/server/permissions";
import { db } from "@/lib/db";
import Link from "next/link";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Matches" };

export default async function MatchesPage() {
  const session = await getServerSession();
  if (!session?.user) return null;

  const matches = await db.matchRecommendation.findMany({
    where: { candidateUserId: session.user.id, status: "ACTIVE" },
    include: {
      venture: {
        include: {
          owner: { select: { id: true, name: true, image: true } },
          primarySector: true,
          capabilityRequirements: { include: { capability: true }, take: 3 },
          members: { where: { status: "ACTIVE" }, select: { userId: true } },
        },
      },
      factorScores: true,
    },
    orderBy: { overallScore: "desc" },
  });

  const strongMatches = matches.filter(m => m.overallScore >= 85);
  const goodMatches = matches.filter(m => m.overallScore >= 70 && m.overallScore < 85);
  const potentialMatches = matches.filter(m => m.overallScore < 70);

  function MatchCard({ rec }: { rec: typeof matches[0] }) {
    return (
      <Link
        href={`/matches/${rec.id}`}
        className="group flex flex-col bg-surface-pure rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
      >
        <div className="p-space-lg flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-navy-deep flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[22px]">rocket_launch</span>
            </div>
            <MatchScoreBadge score={rec.overallScore} size="md" />
          </div>
          <h3 className="font-title-md text-title-md text-navy-deep font-semibold group-hover:text-teal-accent transition-colors">{rec.venture.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {rec.venture.primarySector && <span className="font-label-sm text-label-sm text-on-surface-variant">{rec.venture.primarySector.name}</span>}
            <VentureStageBadge stage={rec.venture.stage} />
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">by {rec.venture.owner.name}</p>
          {rec.venture.capabilityRequirements.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {rec.venture.capabilityRequirements.map(r => (
                <span key={r.id} className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">{r.capability.name}</span>
              ))}
            </div>
          )}
        </div>
        <div className="px-space-lg pb-space-md flex items-center justify-between border-t border-surface-container-high pt-3">
          <span className="font-label-sm text-label-sm text-on-surface-variant">{rec.venture.members.length} team member{rec.venture.members.length !== 1 ? "s" : ""}</span>
          <span className="font-label-md text-label-md text-teal-accent font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
            View <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-5xl mx-auto space-y-space-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">My Matches</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">{matches.length} ventures matched to your Talent DNA</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-pure shadow-sm">
            {[
              { label: "Strong", count: strongMatches.length, color: "text-teal-accent" },
              { label: "Good", count: goodMatches.length, color: "text-amber-warm" },
              { label: "Potential", count: potentialMatches.length, color: "text-on-surface-variant" },
            ].map(b => (
              <div key={b.label} className="text-center px-3">
                <p className={`font-headline-sm text-headline-sm font-bold ${b.color}`}>{b.count}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        {matches.length === 0 ? (
          <EmptyState icon="auto_awesome" title="No matches yet" description="Complete your onboarding and our algorithm will find ventures that need your skills." />
        ) : (
          <>
            {strongMatches.length > 0 && (
              <section className="space-y-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-teal-accent">verified</span>
                  <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Strong Matches (85%+)</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {strongMatches.map(r => <MatchCard key={r.id} rec={r} />)}
                </div>
              </section>
            )}
            {goodMatches.length > 0 && (
              <section className="space-y-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-amber-warm">star</span>
                  <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Good Matches (70–84%)</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {goodMatches.map(r => <MatchCard key={r.id} rec={r} />)}
                </div>
              </section>
            )}
            {potentialMatches.length > 0 && (
              <section className="space-y-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">explore</span>
                  <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Potential Matches</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {potentialMatches.map(r => <MatchCard key={r.id} rec={r} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
