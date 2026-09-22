"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingProgress } from "@/components/shared/OnboardingProgress";

const COMMITMENT_OPTIONS = [
  { value: "CASUAL", label: "Casual", desc: "2–5 hrs/week, exploratory", icon: "explore" },
  { value: "SIDE_VENTURE", label: "Side Venture", desc: "5–10 hrs/week, part-time", icon: "weekend" },
  { value: "SERIOUS", label: "Serious", desc: "10–20 hrs/week, dedicated", icon: "trending_up" },
  { value: "FULL_TIME", label: "Full-Time", desc: "20+ hrs/week, all-in", icon: "rocket_launch" },
];

const HOURS_OPTIONS = ["2-5", "5-10", "10-20", "20+"];

function SliderInput({ label, leftLabel, rightLabel, value, onChange }: {
  label: string; leftLabel: string; rightLabel: string;
  value: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-label-md text-label-md text-navy-deep font-semibold">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-label-sm text-label-sm text-on-surface-variant w-24 text-right flex-shrink-0">{leftLabel}</span>
        <input
          type="range" min={1} max={5} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-teal-accent"
        />
        <span className="font-label-sm text-label-sm text-on-surface-variant w-24 flex-shrink-0">{rightLabel}</span>
      </div>
      <div className="flex justify-center">
        <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">{value}/5</span>
      </div>
    </div>
  );
}

export default function PreferencesPage() {
  const router = useRouter();
  const [commitment, setCommitment] = useState("SIDE_VENTURE");
  const [weeklyHoursBand, setWeeklyHoursBand] = useState("5-10");
  const [ventureGoal, setVentureGoal] = useState("side_venture");
  const [structured, setStructured] = useState(3);
  const [independent, setIndependent] = useState(3);
  const [fastDeliberate, setFastDeliberate] = useState(3);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/v1/profile/onboarding/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commitmentLevel: commitment,
          ventureGoal,
          weeklyHoursBand,
          structuredVsFlexible: structured,
          independentVsCollaborative: independent,
          fastVsDeliberate: fastDeliberate,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      router.push("/onboarding/talent-dna");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-space-md">
      <OnboardingProgress current={4} />

      <div className="bg-surface-pure rounded-2xl shadow-md p-space-lg lg:p-space-xl">
        <div className="flex items-start justify-between mb-space-lg">
          <div>
            <span className="font-label-sm text-label-sm text-teal-accent font-bold uppercase tracking-wider">Step 4 of 5</span>
            <h1 className="font-display-lg text-display-lg-mobile text-navy-deep tracking-tight mt-1">How do you want to build?</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Your working style and availability help us find the right venture fit.
            </p>
          </div>
          <span className="material-symbols-outlined text-[28px] text-teal-accent">tune</span>
        </div>

        {error && (
          <div className="mb-space-md p-3 rounded-lg bg-error-container flex items-center gap-2">
            <span className="material-symbols-outlined text-on-error-container text-[18px]">error</span>
            <p className="font-body-md text-body-md text-on-error-container">{error}</p>
          </div>
        )}

        <div className="space-y-space-xl">
          {/* Commitment level */}
          <div>
            <span className="font-title-md text-title-md text-navy-deep font-semibold block mb-3">Commitment level</span>
            <div className="grid grid-cols-2 gap-3">
              {COMMITMENT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCommitment(opt.value)}
                  className={`p-4 rounded-2xl text-left transition-all border-2 ${commitment === opt.value ? "border-navy-deep bg-navy-deep text-on-primary" : "border-transparent bg-surface-subtle hover:border-outline-variant text-on-surface"}`}
                >
                  <span className={`material-symbols-outlined text-[22px] mb-2 block ${commitment === opt.value ? "text-teal-accent" : "text-on-surface-variant"}`}>{opt.icon}</span>
                  <span className="font-title-md text-title-md font-semibold">{opt.label}</span>
                  <p className="font-body-md text-body-md opacity-70 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly hours */}
          <div>
            <span className="font-title-md text-title-md text-navy-deep font-semibold block mb-3">Weekly hours available</span>
            <div className="flex gap-2">
              {HOURS_OPTIONS.map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setWeeklyHoursBand(h)}
                  className={`flex-1 py-3 rounded-xl font-label-md text-label-md transition-all border-2 ${weeklyHoursBand === h ? "border-teal-accent bg-secondary-container text-on-secondary-container" : "border-transparent bg-surface-subtle text-on-surface-variant hover:bg-surface-container"}`}
                >
                  {h} hrs
                </button>
              ))}
            </div>
          </div>

          {/* Venture goal */}
          <div>
            <span className="font-title-md text-title-md text-navy-deep font-semibold block mb-3">Venture goal</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "experimental", label: "Experimental", desc: "Learning & exploring" },
                { value: "side_venture", label: "Side Venture", desc: "Part-time project" },
                { value: "serious", label: "Serious Startup", desc: "Meaningful impact" },
                { value: "long_term", label: "Long-term Build", desc: "Scalable business" },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setVentureGoal(opt.value)}
                  className={`p-3 rounded-xl text-left border-2 transition-all ${ventureGoal === opt.value ? "border-teal-accent bg-secondary-container/30" : "border-transparent bg-surface-subtle hover:border-outline-variant"}`}
                >
                  <span className="font-label-md text-label-md text-navy-deep font-semibold">{opt.label}</span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Working style sliders */}
          <div className="space-y-space-lg">
            <span className="font-title-md text-title-md text-navy-deep font-semibold block">Working style</span>
            <SliderInput label="Structure preference" leftLabel="Structured" rightLabel="Flexible" value={structured} onChange={setStructured} />
            <SliderInput label="Collaboration style" leftLabel="Independent" rightLabel="Collaborative" value={independent} onChange={setIndependent} />
            <SliderInput label="Decision pace" leftLabel="Fast-moving" rightLabel="Deliberate" value={fastDeliberate} onChange={setFastDeliberate} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-space-lg border-t border-surface-container-high mt-space-lg">
          <button onClick={() => router.back()} className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-navy-deep">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all disabled:opacity-60"
          >
            {saving ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <>Continue <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}
