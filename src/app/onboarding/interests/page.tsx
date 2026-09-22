"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingProgress } from "@/components/shared/OnboardingProgress";

import { MaterialSymbol } from "@/components/ui/material-symbol";
type Sector = { id: string; name: string; description?: string };

const SECTOR_ICONS: Record<string, string> = {
  "tech": "laptop", "fintech": "account_balance", "health": "health_and_safety",
  "education": "school", "agriculture": "agriculture", "energy": "bolt",
  "retail": "storefront", "media": "movie", "transport": "directions_car",
  "social": "diversity_3",
};

export default function InterestsPage() {
  const router = useRouter();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/sectors").then(r => r.json()).then(d => setSectors(d ?? [])).catch(() => setError("Failed to load sectors"));
  }, []);

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function handleSubmit() {
    if (selected.size === 0) { setError("Please select at least one sector"); return; }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/v1/profile/onboarding/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectorIds: Array.from(selected) }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      router.push("/onboarding/preferences");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-space-md">
      <OnboardingProgress current={3} />

      <div className="bg-surface-pure rounded-2xl shadow-md p-space-lg lg:p-space-xl">
        <div className="flex items-start justify-between mb-space-lg">
          <div>
            <span className="font-label-sm text-label-sm text-teal-accent font-bold uppercase tracking-wider">Step 3 of 5</span>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight mt-1">What sectors excite you?</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Select sectors you&apos;d love to build in. These shape which ventures appear in your matches.
            </p>
          </div>
          <MaterialSymbol icon="explore" className="text-[28px] text-teal-accent" />
        </div>

        {selected.size > 0 && (
          <div className="mb-space-md">
            <span className="font-label-sm text-label-sm text-teal-accent font-semibold">{selected.size} sector{selected.size !== 1 ? "s" : ""} selected</span>
          </div>
        )}

        {error && (
          <div className="mb-space-md p-3 rounded-lg bg-error-container flex items-center gap-2">
            <MaterialSymbol icon="error" className="text-on-error-container text-[18px]" />
            <p className="font-body-md text-body-md text-on-error-container">{error}</p>
          </div>
        )}

        {/* Sector grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-space-lg">
          {sectors.length === 0 && (
            /* Fallback static sectors if DB empty */
            [
              { id: "tech", name: "Technology", slug: "tech" },
              { id: "fintech", name: "Fintech", slug: "fintech" },
              { id: "health", name: "Health & Biotech", slug: "health" },
              { id: "education", name: "Education", slug: "education" },
              { id: "agritech", name: "Agritech", slug: "agritech" },
              { id: "energy", name: "Clean Energy", slug: "energy" },
              { id: "retail", name: "Retail & Commerce", slug: "retail" },
              { id: "media", name: "Media & Creative", slug: "media" },
              { id: "transport", name: "Logistics & Mobility", slug: "transport" },
              { id: "social", name: "Social Impact", slug: "social" },
              { id: "manufacturing", name: "Manufacturing", slug: "manufacturing" },
              { id: "ai", name: "AI / Data", slug: "ai" },
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className={`p-4 rounded-2xl flex flex-col items-start gap-2 text-left transition-all border-2 ${selected.has(s.id) ? "bg-navy-deep text-on-primary border-navy-deep" : "bg-surface-subtle text-on-surface border-transparent hover:border-outline-variant"}`}
              >
                <MaterialSymbol icon={SECTOR_ICONS[s.slug] ?? "hub"} className={`text-[22px] ${selected.has(s.id) ? "text-teal-accent" : "text-on-surface-variant"}`} />
                <span className="font-title-md text-title-md font-semibold leading-tight">{s.name}</span>
                {selected.has(s.id) && <MaterialSymbol icon="check_circle" className="text-[16px] text-teal-accent" />}
              </button>
            ))
          )}
          {sectors.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              className={`p-4 rounded-2xl flex flex-col items-start gap-2 text-left transition-all border-2 ${selected.has(s.id) ? "bg-navy-deep text-on-primary border-navy-deep" : "bg-surface-subtle text-on-surface border-transparent hover:border-outline-variant"}`}
            >
              <MaterialSymbol icon="hub" className={`text-[22px] ${selected.has(s.id) ? "text-teal-accent" : "text-on-surface-variant"}`} />
              <span className="font-title-md text-title-md font-semibold leading-tight">{s.name}</span>
              {selected.has(s.id) && <MaterialSymbol icon="check_circle" className="text-[16px] text-teal-accent" />}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-space-md border-t border-surface-container-high">
          <button onClick={() => router.back()} className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-navy-deep">
            <MaterialSymbol icon="arrow_back" className="text-[18px]" /> Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all disabled:opacity-60"
          >
            {saving ? <MaterialSymbol icon="progress_activity" className="text-[18px] animate-spin" /> : <>Continue <MaterialSymbol icon="arrow_forward" className="text-[18px]" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
