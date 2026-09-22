import { getServerSession } from "@/server/permissions";
import { trialsRepository } from "@/server/repositories/trials.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Founder Trial" };

export default async function TrialDetailPage({ params }: { params: Promise<{ trialId: string }> }) {
  const session = await getServerSession();
  const { trialId } = await params;
  const trial = await trialsRepository.getTrial(trialId);
  if (!trial) notFound();

  const isOwner = session?.user.id === trial.venture.ownerId;
  const isParticipant = trial.participants.some(p => p.userId === session?.user.id);
  const hasReviewed = trial.reviews.some(r => r.reviewerUserId === session?.user.id);
  const completedTasks = trial.tasks.filter(t => t.status === "COMPLETED").length;
  const totalTasks = trial.tasks.length;

  const statusConfig: Record<string, { color: string; label: string }> = {
    PENDING: { color: "bg-surface-container-high text-on-surface-variant", label: "Pending" },
    ACTIVE: { color: "bg-secondary-container text-on-secondary-container", label: "Active" },
    UNDER_REVIEW: { color: "bg-amber-warm/20 text-amber-warm", label: "Under Review" },
    COMPLETED: { color: "bg-primary-container text-on-primary", label: "Completed" },
    CANCELLED: { color: "bg-error-container text-on-error-container", label: "Cancelled" },
  };
  const statusInfo = statusConfig[trial.status] ?? statusConfig.PENDING;

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-4xl mx-auto space-y-space-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-3">
            <Link href={`/ventures/${trial.ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
            </Link>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Founder Trial</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">{trial.venture.name} · {trial.durationDays} days</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full font-label-md text-label-md font-semibold self-start ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>

        {/* Trial overview */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-lg">
            {[
              { label: "Duration", value: `${trial.durationDays} days`, icon: "schedule" },
              { label: "Tasks", value: `${completedTasks}/${totalTasks}`, icon: "task_alt" },
              { label: "Started", value: trial.startAt ? formatDate(trial.startAt) : "—", icon: "play_circle" },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle">
                <span className="material-symbols-outlined text-[20px] text-teal-accent">{m.icon}</span>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{m.label}</p>
                  <p className="font-title-md text-title-md text-navy-deep font-semibold">{m.value}</p>
                </div>
              </div>
            ))}
          </div>

          {trial.objective && (
            <div className="p-space-md rounded-xl bg-surface-subtle mb-space-lg">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Objective</p>
              <p className="font-body-md text-body-md text-on-surface">{trial.objective}</p>
            </div>
          )}

          {totalTasks > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-navy-deep font-semibold">Overall Progress</span>
                <span className="font-label-md text-label-md text-teal-accent font-bold">{Math.round((completedTasks / totalTasks) * 100)}%</span>
              </div>
              <Progress value={completedTasks} max={totalTasks} variant="teal" size="md" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Tasks", icon: "task_alt", href: `/trials/${trialId}/tasks` },
            { label: "Progress", icon: "trending_up", href: `/trials/${trialId}/progress` },
            { label: "Review", icon: "rate_review", href: `/trials/${trialId}/review`, disabled: trial.status !== "UNDER_REVIEW" && trial.status !== "COMPLETED" },
            { label: "Result", icon: "emoji_events", href: `/trials/${trialId}/result`, disabled: trial.status !== "COMPLETED" },
          ].map(item => (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all text-center ${item.disabled ? "bg-surface-subtle text-on-surface-variant opacity-50 cursor-not-allowed" : "bg-surface-pure shadow-sm hover:shadow-md hover:-translate-y-0.5"}`}
            >
              <span className={`material-symbols-outlined text-[24px] ${item.disabled ? "text-on-surface-variant" : "text-teal-accent"}`}>{item.icon}</span>
              <span className="font-label-md text-label-md text-navy-deep font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Participants */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Participants ({trial.participants.length})</h2>
          <div className="space-y-3">
            {trial.participants.map(p => {
              const hasReviewed = trial.reviews.some(r => r.reviewerUserId === p.userId);
              return (
                <div key={p.userId} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle">
                  <Avatar name={p.user.name} size="md" />
                  <div className="flex-1">
                    <p className="font-label-md text-label-md text-navy-deep font-semibold">{p.user.name}</p>
                    {p.proposedRole && <p className="font-label-sm text-label-sm text-on-surface-variant">{p.proposedRole}</p>}
                  </div>
                  {hasReviewed && <span className="flex items-center gap-1 font-label-sm text-label-sm text-teal-accent"><span className="material-symbols-outlined text-[16px]">rate_review</span>Reviewed</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA for review */}
        {isParticipant && !hasReviewed && (trial.status === "UNDER_REVIEW" || trial.status === "COMPLETED") && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-title-md text-title-md text-navy-deep font-semibold">Submit Your Review</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Rate the collaboration and share your decision.</p>
            </div>
            <Link
              href={`/trials/${trialId}/review`}
              className="inline-flex items-center gap-2 h-11 px-5 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">rate_review</span>
              Submit Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
