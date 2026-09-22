"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CapabilityChip } from "@/components/shared/CapabilityChip";

import { MaterialSymbol } from "@/components/ui/material-symbol";
type CapFamily = { id: string; name: string; capabilities: { id: string; name: string }[] };
type Requirement = { capabilityId: string; importanceScore: number; priority: string };

export default function VentureGapsPage() {
  const { ventureId } = useParams<{ ventureId: string }>();
  const [families, setFamilies] = useState<CapFamily[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/v1/capabilities").then(r => r.json()).then(setFamilies);
    fetch(`/api/v1/ventures/${ventureId}`).then(r => r.json()).then(v => {
      if (v?.capabilityRequirements) {
        setRequirements(v.capabilityRequirements.map((r: { capabilityId: string; importanceScore: number; priority: string }) => ({
          capabilityId: r.capabilityId, importanceScore: r.importanceScore, priority: r.priority,
        })));
      }
    });
  }, [ventureId]);

  const allCaps = families.flatMap(f => f.capabilities);
  const selectedIds = new Set(requirements.map(r => r.capabilityId));

  function toggle(capabilityId: string) {
    setRequirements(prev => {
      if (prev.find(r => r.capabilityId === capabilityId)) return prev.filter(r => r.capabilityId !== capabilityId);
      return [...prev, { capabilityId, importanceScore: 7, priority: "HIGH" }];
    });
  }

  function setImportance(capabilityId: string, score: number) {
    setRequirements(prev => prev.map(r => r.capabilityId === capabilityId ? { ...r, importanceScore: score } : r));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/v1/ventures/${ventureId}/requirements`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href={`/ventures/${ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
          </Link>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Capability Gaps</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">What skills does your venture still need?</p>
          </div>
        </div>

        {/* Selected requirements */}
        {requirements.length > 0 && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-title-md text-title-md text-navy-deep font-semibold">{requirements.length} Required Capabilities</h2>
              <button onClick={() => setRequirements([])} className="font-label-sm text-label-sm text-on-surface-variant hover:text-error transition-colors">Clear all</button>
            </div>
            <div className="space-y-3">
              {requirements.map(req => {
                const cap = allCaps.find(c => c.id === req.capabilityId);
                return cap ? (
                  <div key={req.capabilityId} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle">
                    <CapabilityChip name={cap.name} removable onRemove={() => toggle(req.capabilityId)} />
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Importance</span>
                      <input
                        type="range" min={1} max={10} value={req.importanceScore}
                        onChange={e => setImportance(req.capabilityId, Number(e.target.value))}
                        className="w-20 accent-teal-accent"
                      />
                      <span className="font-label-sm text-label-sm text-navy-deep font-bold w-5">{req.importanceScore}</span>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
            <div className="flex justify-end mt-4 pt-4 border-t border-surface-container-high">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`inline-flex items-center gap-2 h-10 px-5 rounded-xl font-label-md text-label-md transition-all ${saved ? "bg-teal-accent text-on-primary" : "bg-navy-deep text-on-primary hover:bg-on-primary-fixed"} disabled:opacity-60`}
              >
                {saved ? <><MaterialSymbol icon="check" className="text-[18px]" />Saved!</>
                  : saving ? <MaterialSymbol icon="progress_activity" className="text-[18px] animate-spin" />
                  : <><MaterialSymbol icon="save" className="text-[18px]" />Save Requirements</>}
              </button>
            </div>
          </div>
        )}

        {/* Capability families */}
        <div className="space-y-space-lg">
          {families.map(family => (
            <div key={family.id} className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
              <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold mb-3">{family.name}</h3>
              <div className="flex flex-wrap gap-2">
                {family.capabilities.map(cap => (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => toggle(cap.id)}
                    className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${selectedIds.has(cap.id) ? "bg-navy-deep text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"}`}
                  >
                    {cap.name}
                    {selectedIds.has(cap.id) && <MaterialSymbol icon="check" className="ml-1.5 text-[12px] align-middle" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
