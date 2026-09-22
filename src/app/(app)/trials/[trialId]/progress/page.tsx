import { trialsRepository } from "@/server/repositories/trials.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trial Progress" };

export default async function TrialProgressPage({ params }: { params: Promise<{ trialId: string }> }) {
  const { trialId } = await params;
  const trial = await trialsRepository.getTrial(trialId);
  if (!trial) notFound();

  const completedTasks = trial.tasks.filter(t => t.status === "COMPLETED").length;
  const totalTasks = trial.tasks.length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href={`/trials/${trialId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Trial Progress</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{trial.venture.name}</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-navy-deep rounded-2xl p-space-xl text-on-primary">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-title-md text-title-md font-semibold">Overall Task Completion</h2>
            <span className="font-display-lg text-display-lg font-bold text-teal-accent">{overallProgress}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full rounded-full bg-teal-accent transition-all duration-700" style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="font-label-sm text-label-sm text-on-primary/60 mt-2">{completedTasks} of {totalTasks} tasks completed</p>
        </div>

        {/* Per-participant breakdown */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Participant Contributions</h2>
          <div className="space-y-4">
            {trial.participants.map(p => {
              const assignedTasks = trial.tasks.filter(t => t.assigneeUserId === p.userId);
              const completedByUser = assignedTasks.filter(t => t.status === "COMPLETED").length;
              const pct = assignedTasks.length > 0 ? Math.round((completedByUser / assignedTasks.length) * 100) : 0;
              return (
                <div key={p.userId}>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar name={p.user.name} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-navy-deep font-semibold">{p.user.name}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{completedByUser}/{assignedTasks.length} tasks</span>
                      </div>
                    </div>
                    <span className="font-label-md text-label-md text-teal-accent font-bold">{pct}%</span>
                  </div>
                  <Progress value={pct} variant="teal" size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Task status breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
          {[
            { label: "Pending", status: "PENDING", color: "text-on-surface-variant", bg: "bg-surface-container-high" },
            { label: "In Progress", status: "IN_PROGRESS", color: "text-on-secondary-container", bg: "bg-secondary-container" },
            { label: "Submitted", status: "SUBMITTED", color: "text-amber-warm", bg: "bg-amber-warm/20" },
            { label: "Completed", status: "COMPLETED", color: "text-on-primary", bg: "bg-teal-accent" },
          ].map(s => {
            const count = trial.tasks.filter(t => t.status === s.status).length;
            return (
              <div key={s.status} className="bg-surface-pure rounded-2xl shadow-sm p-space-md text-center">
                <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                  <span className={`font-headline-sm text-headline-sm font-bold ${s.color}`}>{count}</span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
