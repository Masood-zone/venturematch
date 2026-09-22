"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingProgress } from "@/components/shared/OnboardingProgress";
import { CapabilityChip } from "@/components/shared/CapabilityChip";

import { MaterialSymbol } from "@/components/ui/material-symbol";
type CapFamily = {
  id: string; name: string;
  capabilities: { id: string; name: string }[];
};

type Selection = { capabilityId: string; proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" };

export default function CapabilitiesPage() {
  const router = useRouter();
  const [families, setFamilies] = useState<CapFamily[]>([]);
  const [selected, setSelected] = useState<Selection[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFamilies = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/capabilities");
        const data = await response.json();
        setFamilies(data ?? []);
      } catch {
        setError("Failed to load capabilities");
      } finally {
        setLoading(false);
      }
    };

    void loadFamilies();
  }, []);

  function toggle(capabilityId: string) {
    setSelected(prev => {
      const exists = prev.find(s => s.capabilityId === capabilityId);
      if (exists) return prev.filter(s => s.capabilityId !== capabilityId);
      return [...prev, { capabilityId, proficiency: "INTERMEDIATE" }];
    });
  }

  function setProficiency(capabilityId: string, proficiency: Selection["proficiency"]) {
    setSelected(prev => prev.map(s => s.capabilityId === capabilityId ? { ...s, proficiency } : s));
  }

  const allCaps = families.flatMap(f => f.capabilities.map(c => ({ ...c, familyName: f.name })));
  const filtered = search ? allCaps.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.familyName.toLowerCase().includes(search.toLowerCase())) : null;

  async function handleSubmit() {
    if (selected.length === 0) { setError("Please select at least one capability"); return; }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/v1/profile/onboarding/capabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capabilities: selected }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      router.push("/onboarding/interests");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const selectedIds = new Set(selected.map(s => s.capabilityId));

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto py-space-md">
      <OnboardingProgress current={2} />

      <div className="bg-surface-pure rounded-2xl shadow-md p-space-lg lg:p-space-xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-space-lg">
          <div>
            <span className="font-label-sm text-label-sm text-teal-accent font-bold uppercase tracking-wider">Step 2 of 5</span>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight mt-1">What can you contribute?</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Select capabilities that represent your skills. Be honest — this powers your match score.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-subtle flex items-center justify-center flex-shrink-0">
            <MaterialSymbol icon="psychology" className="text-[24px] text-teal-accent" />
          </div>
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="mb-space-lg p-space-md rounded-xl bg-surface-subtle border border-secondary-container/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm text-teal-accent font-semibold uppercase tracking-wider">{selected.length} selected</span>
              <button onClick={() => setSelected([])} className="font-label-sm text-label-sm text-on-surface-variant hover:text-error transition-colors">Clear all</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.map(s => {
                const cap = allCaps.find(c => c.id === s.capabilityId);
                return cap ? (
                  <CapabilityChip
                    key={s.capabilityId}
                    name={cap.name}
                    proficiency={s.proficiency}
                    removable
                    onRemove={() => toggle(s.capabilityId)}
                  />
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-space-lg">
          <MaterialSymbol icon="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none" />
          <input
            type="text"
            placeholder="Search capabilities…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all"
          />
        </div>

        {error && (
          <div className="mb-space-md p-3 rounded-lg bg-error-container flex items-center gap-2">
            <MaterialSymbol icon="error" className="text-on-error-container text-[18px]" />
            <p className="font-body-md text-body-md text-on-error-container">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <MaterialSymbol icon="progress_activity" className="text-[32px] text-teal-accent animate-spin" />
          </div>
        ) : filtered ? (
          /* Search results */
          <div className="flex flex-wrap gap-2 mb-space-lg">
            {filtered.map(cap => (
              <button
                key={cap.id}
                type="button"
                onClick={() => toggle(cap.id)}
                className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${selectedIds.has(cap.id) ? "bg-navy-deep text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"}`}
              >
                {cap.name}
              </button>
            ))}
          </div>
        ) : (
          /* Grouped families */
          <div className="space-y-space-lg mb-space-lg">
            {families.map(family => (
              <div key={family.id}>
                <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold mb-2">{family.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {family.capabilities.map(cap => (
                    <button
                      key={cap.id}
                      type="button"
                      onClick={() => toggle(cap.id)}
                      className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${selectedIds.has(cap.id) ? "bg-navy-deep text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"}`}
                    >
                      {cap.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Proficiency for selected */}
        {selected.length > 0 && (
          <div className="mb-space-lg p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
            <h3 className="font-title-md text-title-md text-navy-deep font-semibold mb-space-md">Set proficiency levels</h3>
            <div className="space-y-3">
              {selected.map(s => {
                const cap = allCaps.find(c => c.id === s.capabilityId);
                if (!cap) return null;
                return (
                  <div key={s.capabilityId} className="flex items-center gap-space-md">
                    <span className="font-body-md text-body-md text-on-surface w-40 truncate flex-shrink-0">{cap.name}</span>
                    <div className="flex gap-1 flex-1">
                      {(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const).map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setProficiency(s.capabilityId, p)}
                          className={`flex-1 py-1.5 rounded-lg font-label-sm text-label-sm transition-all text-[11px] ${s.proficiency === p ? "bg-teal-accent text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}
                        >
                          {p.charAt(0) + p.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-space-md border-t border-surface-container-high">
          <button type="button" onClick={() => router.back()} className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">
            <MaterialSymbol icon="arrow_back" className="text-[18px]" /> Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep hover:bg-on-primary-fixed text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:shadow-md active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {saving ? <MaterialSymbol icon="progress_activity" className="text-[18px] animate-spin" /> : <>Continue <MaterialSymbol icon="arrow_forward" className="text-[18px]" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
