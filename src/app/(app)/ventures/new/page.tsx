"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewVenturePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [shortPitch, setShortPitch] = useState("");
  const [stage, setStage] = useState("IDEA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stages = [
    { value: "IDEA", label: "Idea", desc: "A concept not yet validated" },
    { value: "VALIDATION", label: "Validation", desc: "Testing the concept" },
    { value: "PROTOTYPE", label: "Prototype", desc: "Building an MVP" },
    { value: "EARLY_LAUNCH", label: "Early Launch", desc: "First users acquired" },
    { value: "OPERATE", label: "Operating", desc: "Running and scaling" },
  ];

  async function handleCreate() {
    if (!name.trim()) { setError("Venture name is required"); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/ventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), shortPitch, stage }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const { id } = await res.json();
      router.push(`/ventures/${id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create venture");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-2xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href="/ventures" className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Start a Venture</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Every great venture starts with a name and an idea.</p>
          </div>
        </div>

        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl space-y-space-lg">
          {error && (
            <div className="p-3 rounded-lg bg-error-container flex items-center gap-2">
              <span className="material-symbols-outlined text-on-error-container text-[18px]">error</span>
              <p className="font-body-md text-body-md text-on-error-container">{error}</p>
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="name">Venture Name <span className="text-error">*</span></label>
            <input
              id="name" type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. SolarGrid Campus"
              maxLength={100}
              className="w-full h-12 px-4 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent/40 transition-all text-[16px] font-semibold"
            />
            <span className="font-label-sm text-label-sm text-on-surface-variant self-end">{name.length}/100</span>
          </div>

          {/* Short pitch */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="pitch">Short Pitch
              <span className="font-label-sm text-label-sm text-on-surface-variant font-normal ml-2">optional · up to 280 chars</span>
            </label>
            <textarea
              id="pitch" value={shortPitch} onChange={e => setShortPitch(e.target.value)}
              maxLength={280} rows={3}
              placeholder="One sentence that captures what your venture does and who it's for…"
              className="w-full px-4 py-3 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent/40 transition-all resize-none"
            />
            <span className="font-label-sm text-label-sm text-on-surface-variant self-end">{shortPitch.length}/280</span>
          </div>

          {/* Stage */}
          <div>
            <label className="font-label-md text-label-md text-navy-deep font-semibold block mb-3">Current Stage</label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {stages.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStage(s.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${stage === s.value ? "border-navy-deep bg-navy-deep/5" : "border-transparent bg-surface-subtle hover:border-outline-variant"}`}
                >
                  <span className={`font-label-md text-label-md font-semibold block ${stage === s.value ? "text-navy-deep" : "text-on-surface-variant"}`}>{s.label}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 block">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-space-md border-t border-surface-container-high">
            <Link href="/ventures" className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">Cancel</Link>
            <button
              onClick={handleCreate}
              disabled={loading || !name.trim()}
              className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all disabled:opacity-60"
            >
              {loading ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : (
                <><span className="material-symbols-outlined text-[18px]">rocket_launch</span>Create Venture</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
