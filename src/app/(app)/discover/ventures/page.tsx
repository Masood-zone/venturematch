import { venturesRepository } from "@/server/repositories/ventures.repository";
import { talentRepository } from "@/server/repositories/talent.repository";
import Link from "next/link";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Discover Ventures" };

const STAGES = ["IDEA", "VALIDATION", "PROTOTYPE", "EARLY_LAUNCH", "OPERATE"];

export default async function DiscoverVenturesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sectorId?: string; stage?: string }>;
}) {
  const { page: pageStr, sectorId, stage } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1"));
  const pageSize = 12;

  const [ventures, total, sectors] = await Promise.all([
    venturesRepository.listActive({ sectorId, stage, limit: pageSize, offset: (page - 1) * pageSize }),
    venturesRepository.countActive({ sectorId, stage }),
    talentRepository.getAllSectors(),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  function buildFilterUrl(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const merged = { sectorId, stage, page: "1", ...params };
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v); });
    return `?${p.toString()}`;
  }

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-5xl mx-auto space-y-space-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/discover" className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep flex items-center gap-1">
                <MaterialSymbol icon="arrow_back" className="text-[16px]" /> Discover
              </Link>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Discover Ventures</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">{total} active ventures</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Stage filter */}
          <Link
            href={buildFilterUrl({ stage: undefined })}
            className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${!stage ? "bg-navy-deep text-on-primary" : "bg-surface-pure text-on-surface-variant border border-outline-variant hover:bg-surface-container-low"}`}
          >
            All Stages
          </Link>
          {STAGES.map(s => (
            <Link
              key={s}
              href={buildFilterUrl({ stage: s })}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${stage === s ? "bg-navy-deep text-on-primary" : "bg-surface-pure text-on-surface-variant border border-outline-variant hover:bg-surface-container-low"}`}
            >
              {s.replace(/_/g, " ")}
            </Link>
          ))}
        </div>

        {/* Sector filter */}
        {sectors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link href={buildFilterUrl({ sectorId: undefined })} className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${!sectorId ? "bg-secondary-container text-on-secondary-container" : "bg-surface-pure text-on-surface-variant border border-outline-variant"}`}>All Sectors</Link>
            {sectors.map(s => (
              <Link key={s.id} href={buildFilterUrl({ sectorId: s.id })} className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${sectorId === s.id ? "bg-secondary-container text-on-secondary-container" : "bg-surface-pure text-on-surface-variant border border-outline-variant"}`}>
                {s.name}
              </Link>
            ))}
          </div>
        )}

        {ventures.length === 0 ? (
          <EmptyState icon="rocket_launch" title="No ventures found" description="No active ventures match the current filters. Try adjusting the stage or sector." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {ventures.map(v => (
                <Link
                  key={v.id}
                  href={`/discover/ventures/${v.id}`}
                  className="group flex flex-col bg-surface-pure rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="p-space-lg flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-navy-deep flex items-center justify-center flex-shrink-0">
                        <MaterialSymbol icon="rocket_launch" className="text-on-primary text-[22px]" />
                      </div>
                      <VentureStageBadge stage={v.stage} />
                    </div>
                    <h3 className="font-title-md text-title-md text-navy-deep font-semibold group-hover:text-teal-accent transition-colors">{v.name}</h3>
                    {v.primarySector && <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{v.primarySector.name}</p>}
                    {v.shortPitch && (
                      <p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">{v.shortPitch}</p>
                    )}
                    {v.capabilityRequirements.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {v.capabilityRequirements.slice(0, 3).map(r => (
                          <span key={r.id} className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                            {r.capability.name}
                          </span>
                        ))}
                        {v.capabilityRequirements.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant">+{v.capabilityRequirements.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="px-space-lg pb-space-lg flex items-center justify-between border-t border-surface-container-high pt-3">
                    <div className="flex -space-x-1.5">
                      {v.members.slice(0, 3).map(m => (
                        <Avatar key={m.userId} name={m.user?.name} size="xs" />
                      ))}
                    </div>
                    <span className="font-label-sm text-label-sm text-teal-accent font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      View <MaterialSymbol icon="arrow_forward" className="text-[14px]" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {page > 1 && <Link href={buildFilterUrl({ page: String(page - 1) })} className="px-4 py-2 rounded-xl bg-surface-pure shadow-sm font-label-md text-label-md text-on-surface hover:bg-surface-container transition-all">← Previous</Link>}
                <span className="font-body-md text-body-md text-on-surface-variant">Page {page} of {totalPages}</span>
                {page < totalPages && <Link href={buildFilterUrl({ page: String(page + 1) })} className="px-4 py-2 rounded-xl bg-surface-pure shadow-sm font-label-md text-label-md text-on-surface hover:bg-surface-container transition-all">Next →</Link>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
