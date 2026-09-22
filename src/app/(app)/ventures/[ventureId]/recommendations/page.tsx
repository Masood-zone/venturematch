"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/EmptyState";

import { MaterialSymbol } from "@/components/ui/material-symbol";
type Recommendation = {
  id: string;
  overallScore: number;
  candidateUserId: string;
  candidate: { id: string; name: string; image?: string };
  factorScores: { factor: string; rawScore: number; weight: number }[];
};

export default function VentureRecommendationsPage() {
  const { ventureId } = useParams<{ ventureId: string }>();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [generated, setGenerated] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/v1/ventures/${ventureId}/recommendations`)
      .then(r => r.json())
      .then(d => setRecs(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [ventureId]);

  async function runMatching() {
    setRunning(true);
    try {
      const res = await fetch(`/api/v1/ventures/${ventureId}/recommendations`, { method: "POST" });
      const d = await res.json();
      setGenerated(d.generated ?? 0);
      // Reload
      const refreshed = await fetch(`/api/v1/ventures/${ventureId}/recommendations`).then(r => r.json());
      setRecs(Array.isArray(refreshed) ? refreshed : []);
    } finally {
      setRunning(false);
    }
  }

  const FACTORS = ["capability", "interest", "commitment", "availability", "goal", "workingStyle", "evidence"];
  const FACTOR_WEIGHTS: Record<string, number> = { capability: 35, interest: 20, commitment: 15, availability: 10, goal: 10, workingStyle: 5, evidence: 5 };

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-4xl mx-auto space-y-space-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-3">
            <Link href={`/ventures/${ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
              <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
            </Link>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Match Recommendations</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">7-factor algorithm · {recs.length} active matches</p>
            </div>
          </div>
          <button
            onClick={runMatching}
            disabled={running}
            className="inline-flex items-center gap-2 h-11 px-5 bg-teal-accent hover:bg-secondary text-on-primary font-label-md text-label-md rounded-xl shadow-sm transition-all disabled:opacity-60 self-start"
          >
            {running ? <MaterialSymbol icon="progress_activity" className="text-[18px] animate-spin" /> : <><MaterialSymbol icon="auto_awesome" className="text-[18px]" />Run Matching</>}
          </button>
        </div>

        {generated !== null && (
          <div className="p-space-md rounded-xl bg-secondary-container/30 flex items-center gap-2">
            <MaterialSymbol icon="check_circle" className="text-[18px] text-teal-accent" />
            <span className="font-body-md text-body-md text-on-surface">{generated} new recommendations generated.</span>
          </div>
        )}

        {/* Algorithm weights */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Algorithm Weights</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FACTORS.map(f => (
              <div key={f} className="p-3 rounded-xl bg-surface-subtle text-center">
                <p className="font-headline-sm text-headline-sm text-navy-deep font-bold">{FACTOR_WEIGHTS[f]}%</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant capitalize mt-0.5">{f.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <MaterialSymbol icon="progress_activity" className="text-[40px] text-teal-accent animate-spin" />
          </div>
        ) : recs.length === 0 ? (
          <EmptyState
            icon="auto_awesome"
            title="No recommendations yet"
            description="Run the matching algorithm to find students whose capabilities complement your venture's gaps."
            action={
              <button onClick={runMatching} disabled={running} className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm transition-all">
                <MaterialSymbol icon="auto_awesome" className="text-[18px]" /> Run Matching
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {recs.map(rec => (
              <div key={rec.id} className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                <div className="flex items-start gap-space-md flex-wrap">
                  <Avatar name={rec.candidate.name} image={rec.candidate.image} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-title-md text-title-md text-navy-deep font-semibold">{rec.candidate.name}</h3>
                      <MatchScoreBadge score={rec.overallScore} size="lg" showLabel />
                    </div>
                    {/* Factor breakdown */}
                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5 mt-4">
                      {rec.factorScores.slice(0, 7).map(fs => (
                        <div key={fs.factor} className="text-center p-2 rounded-lg bg-surface-subtle">
                          <p className="font-label-sm text-label-sm text-navy-deep font-bold">{Math.round(fs.rawScore)}%</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant capitalize text-[10px] mt-0.5">{fs.factor.slice(0, 6)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 self-start">
                    <Link
                      href={`/invitations/new?ventureId=${ventureId}&recipientId=${rec.candidateUserId}&recommendationId=${rec.id}`}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-navy-deep text-on-primary font-label-sm text-label-sm shadow-sm hover:bg-on-primary-fixed transition-all"
                    >
                      <MaterialSymbol icon="send" className="text-[16px]" />
                      Invite
                    </Link>
                    <Link
                      href={`/students/${rec.candidateUserId}`}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-all"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
