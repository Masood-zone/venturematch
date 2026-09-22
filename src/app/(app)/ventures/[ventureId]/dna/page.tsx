import { getServerSession } from "@/server/permissions";
import { venturesRepository } from "@/server/repositories/ventures.repository";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Venture DNA" };

export default async function VentureDNAPage({ params }: { params: Promise<{ ventureId: string }> }) {
  const session = await getServerSession();
  const { ventureId } = await params;
  const venture = await venturesRepository.findById(ventureId);
  if (!venture) notFound();

  const isOwner = session?.user.id === venture.ownerId;

  const dna = await venturesRepository.getVentureDNA(ventureId);

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href={`/ventures/${ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Venture DNA</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{venture.name}</p>
          </div>
        </div>

        {/* Core identity */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl space-y-space-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Core Identity</h2>
            <VentureStageBadge stage={venture.stage} />
          </div>

          {isOwner ? (
            <form action={`/api/v1/ventures/${ventureId}`} method="PATCH" className="space-y-space-md">
              {[
                { id: "name", label: "Venture Name", value: venture.name, placeholder: "Your venture name" },
                { id: "shortPitch", label: "Short Pitch (280 chars)", value: venture.shortPitch ?? "", placeholder: "One sentence describing your venture", isTextarea: true, rows: 2 },
                { id: "problem", label: "Problem", value: venture.problem ?? "", placeholder: "What problem are you solving?", isTextarea: true, rows: 3 },
                { id: "solution", label: "Solution", value: venture.solution ?? "", placeholder: "How do you solve it?", isTextarea: true, rows: 3 },
                { id: "targetUsers", label: "Target Users", value: venture.targetUsers ?? "", placeholder: "Who is this for?", isTextarea: true, rows: 2 },
                { id: "ambition", label: "Ambition", value: venture.ambition ?? "", placeholder: "Long-term vision" },
              ].map(field => (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor={field.id}>{field.label}</label>
                  {field.isTextarea ? (
                    <textarea
                      id={field.id} name={field.id} defaultValue={field.value} rows={field.rows}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-3 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-teal-accent/40 resize-none transition-all"
                    />
                  ) : (
                    <input
                      id={field.id} name={field.id} defaultValue={field.value} type="text"
                      placeholder={field.placeholder}
                      className="w-full h-11 px-3.5 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all"
                    />
                  )}
                </div>
              ))}

              <div className="pt-space-md border-t border-surface-container-high flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save DNA
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-space-md">
              {[
                { label: "Problem", value: venture.problem },
                { label: "Solution", value: venture.solution },
                { label: "Target Users", value: venture.targetUsers },
                { label: "Ambition", value: venture.ambition },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="p-space-md rounded-xl bg-surface-subtle">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">{row.label}</p>
                  <p className="font-body-md text-body-md text-on-surface">{row.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI DNA summary */}
        {dna && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[20px] text-teal-accent">psychology</span>
              <h2 className="font-title-md text-title-md text-navy-deep font-semibold">AI-Structured Summary</h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm ml-auto">v{dna.version}</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {dna.structuredSummaryJson ? JSON.parse(dna.structuredSummaryJson).summary ?? "Summary available." : "No AI summary generated yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
