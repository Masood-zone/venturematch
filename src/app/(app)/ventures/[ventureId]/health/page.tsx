import { venturesRepository } from "@/server/repositories/ventures.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Venture Health" };

export default async function VentureHealthPage({ params }: { params: Promise<{ ventureId: string }> }) {
  const { ventureId } = await params;
  const venture = await venturesRepository.findById(ventureId);
  if (!venture) notFound();

  const snapshots = await venturesRepository.getHealthSnapshots(ventureId);
  const latest = snapshots[0];

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href={`/ventures/${ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
          </Link>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Venture Health</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{venture.name}</p>
          </div>
        </div>

        {latest ? (
          <>
            {/* Overall */}
            <div className="bg-navy-deep rounded-2xl p-space-xl text-on-primary">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-title-md text-title-md font-semibold">Overall Health Score</h2>
                <span className="font-display-lg text-display-lg font-bold text-teal-accent">{Math.round(latest.overallHealth)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-teal-accent transition-all" style={{ width: `${latest.overallHealth}%` }} />
              </div>
              <p className="font-label-sm text-label-sm text-on-primary/60 mt-2">
                Last updated: {new Date(latest.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>

            {/* Factor breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {[
                { label: "Milestone Progress", value: latest.milestoneProgress, icon: "flag", variant: "teal" as const },
                { label: "Capability Coverage", value: latest.capabilityCoverage, icon: "psychology", variant: "teal" as const },
                { label: "Participation Score", value: latest.participationScore, icon: "group", variant: "amber" as const },
                { label: "Founder Alignment", value: latest.founderAlignment, icon: "handshake", variant: "navy" as const },
              ].map(f => (
                <div key={f.label} className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MaterialSymbol icon={f.icon} className="text-[18px] text-teal-accent" />
                      <span className="font-title-md text-title-md text-navy-deep font-semibold">{f.label}</span>
                    </div>
                    <span className="font-headline-sm text-headline-sm font-bold text-navy-deep">{Math.round(f.value)}%</span>
                  </div>
                  <Progress value={f.value} variant={f.variant} size="md" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl text-center">
            <MaterialSymbol icon="favorite_border" className="text-[48px] text-on-surface-variant block mb-3" />
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold mb-2">No health data yet</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Run a health check to generate your first score.</p>
            <form action={`/api/v1/ventures/${ventureId}/health`} method="POST">
              <button type="submit" className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all">
                <MaterialSymbol icon="favorite" className="text-[18px]" />
                Run Health Check
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
