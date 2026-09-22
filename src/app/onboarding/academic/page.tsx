"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingProgress } from "@/components/shared/OnboardingProgress";
import { MaterialSymbol } from "@/components/ui/material-symbol";

const LEVELS = [
  { value: "100", label: "Level 100" },
  { value: "200", label: "Level 200" },
  { value: "300", label: "Level 300" },
  { value: "400", label: "Level 400" },
  { value: "postgrad", label: "Postgraduate" },
];
const GRAD_YEARS = Array.from({ length: 8 }, (_, index) => new Date().getFullYear() + index);

type AcademicProgramme = {
  id: string;
  name: string;
  academicUnit: string;
  studyLevel: "UNDERGRADUATE" | "DIPLOMA" | "POSTGRADUATE" | string;
};

export default function AcademicPage() {
  const router = useRouter();
  const [catalogue, setCatalogue] = useState<AcademicProgramme[]>([]);
  const [faculty, setFaculty] = useState("");
  const [programme, setProgramme] = useState("");
  const [level, setLevel] = useState("300");
  const [gradYear, setGradYear] = useState(String(new Date().getFullYear() + 1));
  const [loading, setLoading] = useState(false);
  const [catalogueLoading, setCatalogueLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCatalogue() {
      try {
        const response = await fetch("/api/v1/academic-programmes", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load USTED programmes");
        const payload = await response.json();
        if (!cancelled) setCatalogue(payload.data ?? []);
      } catch (cause: unknown) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Failed to load USTED academic programmes");
      } finally {
        if (!cancelled) setCatalogueLoading(false);
      }
    }
    void loadCatalogue();
    return () => { cancelled = true; };
  }, []);

  const levelCatalogue = useMemo(() => {
    if (level === "postgrad") return catalogue.filter((item) => item.studyLevel === "POSTGRADUATE");
    const numericLevel = Number(level);
    return catalogue.filter((item) => item.studyLevel !== "POSTGRADUATE" && !(item.studyLevel === "DIPLOMA" && numericLevel > 200));
  }, [catalogue, level]);
  const faculties = useMemo(() => Array.from(new Set(levelCatalogue.map((item) => item.academicUnit))).sort((a, b) => a.localeCompare(b)), [levelCatalogue]);
  const programmes = useMemo(() => levelCatalogue.filter((item) => item.academicUnit === faculty).map((item) => item.name), [levelCatalogue, faculty]);

  function handleLevelChange(nextLevel: string) {
    setLevel(nextLevel);
    setFaculty("");
    setProgramme("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!faculty || !programme) {
      setError("Please select your faculty or institute and programme.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/v1/profile/onboarding/academic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faculty, programme, level, expectedGraduationYear: Number.parseInt(gradYear, 10) }),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to save academic details");
      }
      router.push("/onboarding/capabilities");
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Failed to save academic details");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-2xl flex-col mx-auto py-space-md">
      <OnboardingProgress current={1} />
      <div className="bg-surface-pure rounded-2xl shadow-md p-space-lg lg:p-space-xl">
        <div className="flex items-start justify-between mb-space-lg">
          <div>
            <span className="font-label-sm text-label-sm text-teal-accent font-bold uppercase tracking-wider">Step 1 of 5</span>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight mt-1">Tell us about your academic background</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Choose your current USTED Kumasi programme to improve relevant venture matches.</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-subtle flex items-center justify-center flex-shrink-0"><MaterialSymbol icon="school" className="text-[24px] text-teal-accent" /></div>
        </div>

        {error && <div className="mb-space-md p-3 rounded-lg bg-error-container flex items-center gap-2"><MaterialSymbol icon="error" className="text-on-error-container text-[18px]" /><p className="font-body-md text-body-md text-on-error-container">{error}</p></div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-2">
            <span className="font-label-md text-label-md text-navy-deep font-semibold">Academic Level</span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {LEVELS.map((item) => <label key={item.value} className="cursor-pointer"><input type="radio" name="academicLevel" value={item.value} checked={level === item.value} onChange={() => handleLevelChange(item.value)} className="sr-only peer" /><span className="h-11 flex items-center justify-center rounded-xl font-label-md text-label-md border-2 border-transparent bg-surface-subtle text-on-surface-variant peer-checked:bg-navy-deep peer-checked:text-on-primary peer-checked:border-navy-deep transition-all hover:bg-surface-container-high">{item.label}</span></label>)}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="faculty">Faculty / Institute</label>
            <input id="faculty" list="faculty-options" required disabled={catalogueLoading} value={faculty} onChange={(event) => { setFaculty(event.target.value); setProgramme(""); }} placeholder={catalogueLoading ? "Loading USTED faculties..." : "Search or select your faculty / institute"} className="w-full h-12 px-4 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent/40 transition-colors disabled:opacity-60" />
            <datalist id="faculty-options">{faculties.map((item) => <option key={item} value={item} />)}</datalist>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="programme">Programme</label>
            <div className="relative flex items-center"><MaterialSymbol icon="menu_book" className="absolute left-3.5 text-outline text-[20px] pointer-events-none" /><input id="programme" list="programme-options" required disabled={catalogueLoading || !faculties.includes(faculty)} value={programme} onChange={(event) => setProgramme(event.target.value)} placeholder={!faculty ? "Select a faculty or institute first" : "Search or select your programme"} className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent/40 transition-colors disabled:opacity-60" /></div>
            <datalist id="programme-options">{programmes.map((item) => <option key={item} value={item} />)}</datalist>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="gradYear">Expected Graduation Year</label>
            <div className="relative"><select id="gradYear" required value={gradYear} onChange={(event) => setGradYear(event.target.value)} className="w-full h-12 pl-4 pr-10 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent/40 transition-colors cursor-pointer">{GRAD_YEARS.map((year) => <option key={year} value={String(year)}>{year}</option>)}</select><MaterialSymbol icon="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none" /></div>
          </div>

          <div className="flex items-center justify-between pt-space-md border-t border-surface-container-high mt-space-sm">
            <button type="button" onClick={() => router.push("/dashboard")} className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">Skip for now</button>
            <button type="submit" disabled={loading || catalogueLoading || !faculties.includes(faculty) || !programmes.includes(programme)} className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-navy-deep hover:bg-on-primary-fixed text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:shadow-md active:scale-[0.99] transition-all disabled:opacity-60">{loading ? <MaterialSymbol icon="progress_activity" className="text-[18px] animate-spin" /> : <>Continue <MaterialSymbol icon="arrow_forward" className="text-[18px]" /></>}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
