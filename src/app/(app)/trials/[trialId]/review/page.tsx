"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

function ScoreInput({ label, name, value, onChange }: { label: string; name: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-label-md text-label-md text-navy-deep font-semibold">{label}</label>
        <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">{value}/5</span>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(n => (
          <button
            key={n} type="button" onClick={() => onChange(n)}
            className={`flex-1 h-10 rounded-xl font-label-md text-label-md transition-all border-2 ${value >= n ? "border-teal-accent bg-teal-accent text-on-primary" : "border-outline-variant bg-surface-subtle text-on-surface-variant hover:border-teal-accent/50"}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TrialReviewPage() {
  const { trialId } = useParams<{ trialId: string }>();
  const router = useRouter();
  const [scores, setScores] = useState({ communicationScore: 3, reliabilityScore: 3, contributionScore: 3, commitmentScore: 3, goalAlignmentScore: 3 });
  const [workedWellText, setWorkedWellText] = useState("");
  const [concernsText, setConcernsText] = useState("");
  const [decision, setDecision] = useState("CONTINUE");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/trials/${trialId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trialId, ...scores, workedWellText, concernsText, decision }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      router.push(`/trials/${trialId}/result`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to submit review");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-2xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href={`/trials/${trialId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Submit Review</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Rate the collaboration honestly.</p>
          </div>
        </div>

        {error && <div className="p-3 rounded-lg bg-error-container flex items-center gap-2"><span className="material-symbols-outlined text-on-error-container text-[18px]">error</span><p className="font-body-md text-body-md text-on-error-container">{error}</p></div>}

        <form onSubmit={handleSubmit} className="bg-surface-pure rounded-2xl shadow-sm p-space-xl space-y-space-lg">
          <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Collaboration Scores</h2>
          <ScoreInput label="Communication" name="communicationScore" value={scores.communicationScore} onChange={v => setScores(s => ({ ...s, communicationScore: v }))} />
          <ScoreInput label="Reliability" name="reliabilityScore" value={scores.reliabilityScore} onChange={v => setScores(s => ({ ...s, reliabilityScore: v }))} />
          <ScoreInput label="Contribution Quality" name="contributionScore" value={scores.contributionScore} onChange={v => setScores(s => ({ ...s, contributionScore: v }))} />
          <ScoreInput label="Commitment Level" name="commitmentScore" value={scores.commitmentScore} onChange={v => setScores(s => ({ ...s, commitmentScore: v }))} />
          <ScoreInput label="Goal Alignment" name="goalAlignmentScore" value={scores.goalAlignmentScore} onChange={v => setScores(s => ({ ...s, goalAlignmentScore: v }))} />

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold">What worked well?</label>
            <textarea value={workedWellText} onChange={e => setWorkedWellText(e.target.value)} rows={3} placeholder="Describe the positive aspects of this collaboration..." className="w-full px-3.5 py-3 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-teal-accent/40 resize-none transition-all" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold">Concerns or areas for improvement</label>
            <textarea value={concernsText} onChange={e => setConcernsText(e.target.value)} rows={3} placeholder="Any concerns or things to work on..." className="w-full px-3.5 py-3 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-teal-accent/40 resize-none transition-all" />
          </div>

          <div>
            <label className="font-label-md text-label-md text-navy-deep font-semibold block mb-3">Your Decision</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "CONTINUE", label: "Continue", icon: "check_circle", desc: "Ready to formalise", color: "border-teal-accent bg-teal-accent/5" },
                { value: "EXTEND", label: "Extend", icon: "schedule", desc: "Need more time", color: "border-amber-warm bg-amber-warm/5" },
                { value: "STOP", label: "Stop", icon: "cancel", desc: "Not the right fit", color: "border-error bg-error/5" },
              ].map(opt => (
                <button key={opt.value} type="button" onClick={() => setDecision(opt.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${decision === opt.value ? opt.color : "border-transparent bg-surface-subtle hover:border-outline-variant"}`}>
                  <span className={`material-symbols-outlined text-[20px] block mb-1 ${decision === opt.value ? (opt.value === "CONTINUE" ? "text-teal-accent" : opt.value === "EXTEND" ? "text-amber-warm" : "text-error") : "text-on-surface-variant"}`}>{opt.icon}</span>
                  <span className="font-label-md text-label-md text-navy-deep font-semibold">{opt.label}</span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-space-md border-t border-surface-container-high">
            <Link href={`/trials/${trialId}`} className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">Cancel</Link>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all disabled:opacity-60">
              {saving ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <><span className="material-symbols-outlined text-[18px]">rate_review</span>Submit Review</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
