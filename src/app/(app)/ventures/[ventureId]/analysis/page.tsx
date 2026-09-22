import { venturesRepository } from "@/server/repositories/ventures.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Venture Analysis" };

export default async function VentureAnalysisPage({ params }: { params: Promise<{ ventureId: string }> }) {
  const { ventureId } = await params;
  const venture = await venturesRepository.findById(ventureId);
  if (!venture) notFound();

  const milestones = await venturesRepository.getMilestones(ventureId);
  const contributions = await venturesRepository.getContributions(ventureId);
  const snapshots = await venturesRepository.getHealthSnapshots(ventureId);

  const completedMilestones = milestones.filter(m => m.status === "COMPLETED").length;
  const teamSize = venture.members.filter(m => m.status === "ACTIVE").length;
  const capGapCount = venture.capabilityRequirements.length;

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-4xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href={`/ventures/${ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
          </Link>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Venture Analysis</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{venture.name}</p>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
          {[
            { label: "Team Size", value: teamSize, icon: "group", color: "text-navy-deep" },
            { label: "Milestones", value: `${completedMilestones}/${milestones.length}`, icon: "flag", color: "text-teal-accent" },
            { label: "Contributions", value: contributions.length, icon: "construction", color: "text-amber-warm" },
            { label: "Capability Gaps", value: capGapCount, icon: "search", color: "text-navy-deep" },
          ].map(m => (
            <div key={m.label} className="p-space-lg rounded-2xl bg-surface-pure shadow-sm flex items-center justify-between">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{m.label}</p>
                <p className={`font-display-lg text-display-lg font-bold mt-1 ${m.color}`}>{m.value}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                <MaterialSymbol icon={m.icon} className={`text-[24px] ${m.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Health trend */}
        {snapshots.length > 0 && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Health Trend</h2>
            <div className="flex items-end gap-2 h-24">
              {snapshots.slice(0, 12).reverse().map((s) => (
                <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-teal-accent/80 transition-all"
                    style={{ height: `${(s.overallHealth / 100) * 80}px` }}
                  />
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">
                    {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage progress */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Stage Progress</h2>
          {["IDEA", "VALIDATION", "PROTOTYPE", "EARLY_LAUNCH", "OPERATE"].map((stage, idx) => {
            const stageIndex = ["IDEA", "VALIDATION", "PROTOTYPE", "EARLY_LAUNCH", "OPERATE"].indexOf(venture.stage);
            const done = idx < stageIndex;
            const current = idx === stageIndex;
            return (
              <div key={stage} className={`flex items-center gap-3 p-3 rounded-xl mb-2 ${current ? "bg-secondary-container/30 border border-teal-accent/30" : "bg-surface-subtle"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-teal-accent text-on-primary" : current ? "bg-navy-deep text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                  {done ? <MaterialSymbol icon="check" className="text-[14px]" /> : <span className="font-label-sm text-label-sm font-bold">{idx + 1}</span>}
                </div>
                <span className={`font-label-md text-label-md ${current ? "text-navy-deep font-semibold" : done ? "text-teal-accent" : "text-on-surface-variant"}`}>{stage.replace(/_/g, " ")}</span>
                {current && <span className="ml-auto font-label-sm text-label-sm text-teal-accent font-semibold">Current</span>}
              </div>
            );
          })}
        </div>

        {/* Capability requirements */}
        {venture.capabilityRequirements.length > 0 && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Capability Coverage Analysis</h2>
            <div className="space-y-3">
              {venture.capabilityRequirements.map(r => (
                <div key={r.id} className="flex items-center gap-3">
                  <span className="font-body-md text-body-md text-navy-deep w-40 truncate flex-shrink-0">{r.capability.name}</span>
                  <div className="flex-1">
                    <Progress value={r.importanceScore * 10} variant="teal" size="sm" />
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant w-16 text-right flex-shrink-0">{r.priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
