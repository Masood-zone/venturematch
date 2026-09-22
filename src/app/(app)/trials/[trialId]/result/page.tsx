import { trialsRepository } from "@/server/repositories/trials.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Trial Result" };

export default async function TrialResultPage({ params }: { params: Promise<{ trialId: string }> }) {
  const { trialId } = await params;
  const trial = await trialsRepository.getTrial(trialId);
  if (!trial) notFound();

  const reviews = trial.reviews;
  const avgScores = reviews.length > 0 ? {
    communication: Math.round(reviews.reduce((s, r) => s + r.communicationScore, 0) / reviews.length * 10) / 10,
    reliability: Math.round(reviews.reduce((s, r) => s + r.reliabilityScore, 0) / reviews.length * 10) / 10,
    contribution: Math.round(reviews.reduce((s, r) => s + r.contributionScore, 0) / reviews.length * 10) / 10,
    commitment: Math.round(reviews.reduce((s, r) => s + r.commitmentScore, 0) / reviews.length * 10) / 10,
    goalAlignment: Math.round(reviews.reduce((s, r) => s + r.goalAlignmentScore, 0) / reviews.length * 10) / 10,
  } : null;

  const continueCnt = reviews.filter(r => r.decision === "CONTINUE").length;
  const extendCnt = reviews.filter(r => r.decision === "EXTEND").length;
  const stopCnt = reviews.filter(r => r.decision === "STOP").length;
  const majorityDecision = continueCnt > stopCnt ? (continueCnt > extendCnt ? "CONTINUE" : "EXTEND") : "STOP";

  const decisionConfig = {
    CONTINUE: { icon: "celebration", color: "bg-secondary-container text-on-secondary-container", label: "Continue — Formalise Partnership" },
    EXTEND: { icon: "schedule", color: "bg-amber-warm/20 text-amber-warm", label: "Extend Trial Period" },
    STOP: { icon: "cancel", color: "bg-error-container text-on-error-container", label: "Trial Ended — Not a Fit" },
  };
  const dc = decisionConfig[majorityDecision as keyof typeof decisionConfig];

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href={`/trials/${trialId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
          </Link>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Trial Result</h1>
        </div>

        {/* Decision banner */}
        <div className={`rounded-2xl p-space-xl flex items-center gap-4 ${dc.color}`}>
          <MaterialSymbol icon={dc.icon} className="text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }} />
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold">{dc.label}</h2>
            <p className="font-body-md text-body-md opacity-80 mt-1">
              {continueCnt} continue · {extendCnt} extend · {stopCnt} stop  ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </p>
          </div>
        </div>

        {avgScores && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Average Scores</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Communication", score: avgScores.communication },
                { label: "Reliability", score: avgScores.reliability },
                { label: "Contribution", score: avgScores.contribution },
                { label: "Commitment", score: avgScores.commitment },
                { label: "Goal Alignment", score: avgScores.goalAlignment },
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-surface-subtle">
                  <p className="font-headline-sm text-headline-sm text-navy-deep font-bold">{s.score}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 text-[11px]">{s.label}</p>
                  <div className="mt-1.5 w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full rounded-full bg-teal-accent" style={{ width: `${(s.score / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual reviews */}
        {reviews.length > 0 && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Individual Reviews</h2>
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="p-space-md rounded-xl bg-surface-subtle">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={r.reviewer.name} image={r.reviewer.image} size="sm" />
                      <span className="font-label-md text-label-md text-navy-deep font-semibold">{r.reviewer.name}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${r.decision === "CONTINUE" ? "bg-secondary-container text-on-secondary-container" : r.decision === "EXTEND" ? "bg-amber-warm/20 text-amber-warm" : "bg-error-container text-on-error-container"}`}>
                      {r.decision}
                    </span>
                  </div>
                  {r.workedWellText && <p className="font-body-md text-body-md text-on-surface mb-2"><span className="font-semibold text-teal-accent">+</span> {r.workedWellText}</p>}
                  {r.concernsText && <p className="font-body-md text-body-md text-on-surface-variant"><span className="font-semibold text-error">−</span> {r.concernsText}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {majorityDecision === "CONTINUE" && (
          <div className="flex gap-3">
            <Link href={`/ventures/${trial.ventureId}/charter`} className="flex-1 inline-flex items-center justify-center gap-2 h-12 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all">
              <MaterialSymbol icon="description" className="text-[18px]" />
              Create Team Charter
            </Link>
            <Link href={`/ventures/${trial.ventureId}`} className="flex-1 inline-flex items-center justify-center gap-2 h-12 border-2 border-outline-variant hover:border-navy-deep text-on-surface font-label-md text-label-md rounded-xl transition-all">
              View Venture
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
