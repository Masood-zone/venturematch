"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

import { MaterialSymbol } from "@/components/ui/material-symbol";
type Task = {
  id: string; title: string; purpose?: string; status: string;
  progressCurrent: number; progressTarget: number; dueAt?: string;
  assignee?: { id: string; name: string; image?: string };
  evidence: { id: string; type: string; textValue?: string }[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-surface-container-high text-on-surface-variant",
  IN_PROGRESS: "bg-secondary-container text-on-secondary-container",
  SUBMITTED: "bg-amber-warm/20 text-amber-warm",
  COMPLETED: "bg-teal-accent text-on-primary",
};

export default function TrialTasksPage() {
  const { trialId } = useParams<{ trialId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/trials/${trialId}`)
      .then(r => r.json())
      .then(d => { setTasks(d?.tasks ?? []); setLoading(false); });
  }, [trialId]);

  async function updateStatus(taskId: string, status: string) {
    await fetch(`/api/v1/trials/${trialId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trialId, title: "update", status }),
    });
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <MaterialSymbol icon="progress_activity" className="text-[40px] text-teal-accent animate-spin" />
    </div>
  );

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href={`/trials/${trialId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
          </Link>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Trial Tasks</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{tasks.length} tasks assigned</p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl text-center">
            <MaterialSymbol icon="task_alt" className="text-[48px] text-on-surface-variant block mb-3" />
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold mb-2">No tasks yet</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">The venture owner will add tasks for the trial period.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-title-md text-title-md text-navy-deep font-semibold">{task.title}</h3>
                    {task.purpose && <p className="font-body-md text-body-md text-on-surface-variant mt-1">{task.purpose}</p>}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm flex-shrink-0 ${STATUS_COLORS[task.status] ?? "bg-surface-container text-on-surface-variant"}`}>
                    {task.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  {task.assignee && (
                    <div className="flex items-center gap-2">
                      <Avatar name={task.assignee.name} size="xs" />
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{task.assignee.name}</span>
                    </div>
                  )}
                  {task.dueAt && (
                    <div className="flex items-center gap-1">
                      <MaterialSymbol icon="calendar_today" className="text-[14px] text-on-surface-variant" />
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Due {formatDate(task.dueAt)}</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Progress</span>
                    <span className="font-label-sm text-label-sm text-navy-deep font-bold">
                      {Math.round((task.progressCurrent / Math.max(1, task.progressTarget)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-accent transition-all"
                      style={{ width: `${Math.round((task.progressCurrent / Math.max(1, task.progressTarget)) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Status actions */}
                {task.status !== "COMPLETED" && (
                  <div className="flex gap-2 flex-wrap">
                    {task.status === "PENDING" && (
                      <button
                        onClick={() => updateStatus(task.id, "IN_PROGRESS")}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-navy-deep text-on-primary font-label-sm text-label-sm hover:bg-on-primary-fixed transition-all"
                      >
                        <MaterialSymbol icon="play_arrow" className="text-[14px]" />
                        Start
                      </button>
                    )}
                    {task.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => updateStatus(task.id, "SUBMITTED")}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-teal-accent text-on-primary font-label-sm text-label-sm hover:bg-secondary transition-all"
                      >
                        <MaterialSymbol icon="upload" className="text-[14px]" />
                        Submit
                      </button>
                    )}
                  </div>
                )}

                {/* Evidence */}
                {task.evidence.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-surface-container-high">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Evidence ({task.evidence.length})</p>
                    <div className="space-y-1">
                      {task.evidence.map(e => (
                        <div key={e.id} className="flex items-center gap-2 p-2 rounded-lg bg-surface-subtle">
                          <MaterialSymbol icon="attach_file" className="text-[16px] text-teal-accent" />
                          <span className="font-label-sm text-label-sm text-navy-deep">{e.type}</span>
                          {e.textValue && <span className="font-body-md text-body-md text-on-surface-variant truncate">{e.textValue}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
