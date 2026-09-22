"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingProgress } from "@/components/shared/OnboardingProgress";

import { MaterialSymbol } from "@/components/ui/material-symbol";
const FACULTIES = ["Engineering", "Science", "Business", "Arts & Humanities", "Social Sciences", "Law", "Medicine", "Education", "Agriculture", "Computing & IT"];
const LEVELS = [
  { value: "100", label: "Level 100" },
  { value: "200", label: "Level 200" },
  { value: "300", label: "Level 300" },
  { value: "400", label: "Level 400" },
  { value: "postgrad", label: "Postgraduate" },
];
const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() + i);

export default function AcademicPage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState("");
  const [programme, setProgramme] = useState("");
  const [level, setLevel] = useState("300");
  const [gradYear, setGradYear] = useState(String(new Date().getFullYear() + 1));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/profile/onboarding/academic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faculty, programme, level, expectedGraduationYear: parseInt(gradYear) }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to save");
      }
      router.push("/onboarding/capabilities");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save academic details");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-space-md">
      <OnboardingProgress current={1} />

      <div className="bg-surface-pure rounded-2xl shadow-md p-space-lg lg:p-space-xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-space-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-label-sm text-label-sm text-teal-accent font-bold uppercase tracking-wider">Step 1 of 5</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">
              Tell us about your academic background
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              This helps us verify your student status and match you with relevant ventures.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-subtle flex items-center justify-center flex-shrink-0">
            <MaterialSymbol icon="school" className="text-[24px] text-teal-accent" />
          </div>
        </div>

        {error && (
          <div className="mb-space-md p-3 rounded-lg bg-error-container flex items-center gap-2">
            <MaterialSymbol icon="error" className="text-on-error-container text-[18px]" />
            <p className="font-body-md text-body-md text-on-error-container">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          {/* Faculty */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="facultySelect">Faculty</label>
            <div className="relative">
              <select
                id="facultySelect"
                required
                value={faculty}
                onChange={e => setFaculty(e.target.value)}
                className="w-full h-12 pl-4 pr-10 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent/40 transition-colors cursor-pointer"
              >
                <option value="">Select your faculty</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <MaterialSymbol icon="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none" />
            </div>
          </div>

          {/* Programme */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="programmeInput">Department / Programme</label>
            <div className="relative flex items-center">
              <MaterialSymbol icon="menu_book" className="absolute left-3.5 text-outline text-[20px] pointer-events-none" />
              <input
                id="programmeInput"
                type="text"
                required
                value={programme}
                onChange={e => setProgramme(e.target.value)}
                placeholder="e.g. BSc Computer Science"
                className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent/40 transition-colors"
              />
            </div>
          </div>

          {/* Academic Level */}
          <div className="flex flex-col gap-2">
            <span className="font-label-md text-label-md text-navy-deep font-semibold">Academic Level</span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {LEVELS.map(l => (
                <label key={l.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="academicLevel"
                    value={l.value}
                    checked={level === l.value}
                    onChange={() => setLevel(l.value)}
                    className="sr-only peer"
                  />
                  <div className="h-11 flex items-center justify-center rounded-xl font-label-md text-label-md border-2 border-transparent bg-surface-subtle text-on-surface-variant peer-checked:bg-navy-deep peer-checked:text-on-primary peer-checked:border-navy-deep transition-all cursor-pointer hover:bg-surface-container-high">
                    {l.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Graduation Year */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="gradYear">Expected Graduation Year</label>
            <div className="relative">
              <select
                id="gradYear"
                required
                value={gradYear}
                onChange={e => setGradYear(e.target.value)}
                className="w-full h-12 pl-4 pr-10 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent/40 transition-colors cursor-pointer"
              >
                {GRAD_YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
              </select>
              <MaterialSymbol icon="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-space-md border-t border-surface-container-high mt-space-sm">
            <button type="button" onClick={() => router.push("/dashboard")} className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">
              Skip for now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-navy-deep hover:bg-on-primary-fixed text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:shadow-md active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {loading ? <MaterialSymbol icon="progress_activity" className="text-[18px] animate-spin" /> : <>Continue <MaterialSymbol icon="arrow_forward" className="text-[18px]" /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
