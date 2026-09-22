import { venturesRepository } from "@/server/repositories/ventures.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Contributions" };

export default async function VentureContributionsPage({ params }: { params: Promise<{ ventureId: string }> }) {
  const { ventureId } = await params;
  const venture = await venturesRepository.findById(ventureId);
  if (!venture) notFound();

  const contributions = await venturesRepository.getContributions(ventureId);

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/ventures/${ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
              <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
            </Link>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Contributions</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">{contributions.length} contributions recorded</p>
            </div>
          </div>
        </div>

        {contributions.length === 0 ? (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl text-center">
            <MaterialSymbol icon="construction" className="text-[48px] text-on-surface-variant block mb-3" />
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold mb-2">No contributions yet</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Team members can log their contributions to milestones here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contributions.map(c => (
              <div key={c.id} className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                <div className="flex items-start gap-3">
                  <Avatar name={c.user.name} image={c.user.image} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-title-md text-title-md text-navy-deep font-semibold">{c.title}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex-shrink-0">{c.category}</span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{c.user.name} · {formatRelativeTime(c.createdAt)}</p>
                    {c.description && <p className="font-body-md text-body-md text-on-surface-variant mt-2">{c.description}</p>}
                    {c.milestone && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <MaterialSymbol icon="flag" className="text-[14px] text-teal-accent" />
                        <span className="font-label-sm text-label-sm text-teal-accent">{c.milestone.title}</span>
                      </div>
                    )}
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
