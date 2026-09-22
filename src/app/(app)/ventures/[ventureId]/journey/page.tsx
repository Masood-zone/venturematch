import { venturesRepository } from "@/server/repositories/ventures.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Venture Journey" };

const STAGE_ORDER = ["IDEA", "VALIDATION", "PROTOTYPE", "EARLY_LAUNCH", "OPERATE"];
const statusColor: Record<string, string> = {
  PLANNED: "bg-surface-container-high text-on-surface-variant",
  IN_PROGRESS: "bg-secondary-container text-on-secondary-container",
  COMPLETED: "bg-teal-accent text-on-primary",
  OVERDUE: "bg-error-container text-on-error-container",
};

export default async function VentureJourneyPage({ params }: { params: Promise<{ ventureId: string }> }) {
  const { ventureId } = await params;
  const venture = await venturesRepository.findById(ventureId);
  if (!venture) notFound();

  const milestones = await venturesRepository.getMilestones(ventureId);

  const milestonesByStage = STAGE_ORDER.reduce<Record<string, typeof milestones>>((acc, s) => {
    acc[s] = milestones.filter(m => m.stage === s);
    return acc;
  }, {});

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-4xl mx-auto space-y-space-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-3">
            <Link href={`/ventures/${ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
              <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
            </Link>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Venture Journey</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">{venture.name} · {milestones.length} milestones</p>
            </div>
          </div>
          <Link
            href={`/ventures/${ventureId}/contributions`}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-outline-variant hover:border-navy-deep text-on-surface font-label-md text-label-md transition-all self-start"
          >
            <MaterialSymbol icon="construction" className="text-[18px] text-teal-accent" />
            Log Contribution
          </Link>
        </div>

        {milestones.length === 0 ? (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl text-center">
            <MaterialSymbol icon="map" className="text-[48px] text-on-surface-variant block mb-3" />
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold mb-2">No milestones yet</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Add milestones to track your venture&apos;s progress through each stage.</p>
          </div>
        ) : (
          STAGE_ORDER.map(stage => {
            const items = milestonesByStage[stage];
            const isCurrentStage = stage === venture.stage;
            if (items.length === 0 && !isCurrentStage) return null;
            return (
              <div key={stage} className={`rounded-2xl shadow-sm p-space-lg ${isCurrentStage ? "bg-surface-pure ring-2 ring-teal-accent/30" : "bg-surface-pure"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCurrentStage ? "bg-teal-accent text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                    <MaterialSymbol icon="flag" className="text-[16px]" />
                  </div>
                  <h2 className="font-title-md text-title-md text-navy-deep font-semibold">{stage.replace(/_/g, " ")}</h2>
                  {isCurrentStage && <span className="px-2 py-0.5 rounded-full bg-teal-accent text-on-primary font-label-sm text-label-sm ml-auto">Current Stage</span>}
                </div>
                {items.length === 0 ? (
                  <p className="font-body-md text-body-md text-on-surface-variant">No milestones for this stage.</p>
                ) : (
                  <div className="space-y-3">
                    {items.map(m => (
                      <div key={m.id} className="p-space-md rounded-xl bg-surface-subtle">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-title-md text-title-md text-navy-deep font-semibold">{m.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm flex-shrink-0 ${statusColor[m.status]}`}>{m.status}</span>
                        </div>
                        {m.objective && <p className="font-body-md text-body-md text-on-surface-variant mb-3">{m.objective}</p>}
                        <div className="flex items-center justify-between gap-4">
                          <Progress value={m.progressCurrent} max={m.progressTarget || 100} variant="teal" className="flex-1" />
                          <span className="font-label-sm text-label-sm text-on-surface-variant flex-shrink-0">
                            {Math.round((m.progressCurrent / Math.max(1, m.progressTarget)) * 100)}%
                          </span>
                        </div>
                        {m.dueAt && <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Due: {formatDate(m.dueAt)}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
