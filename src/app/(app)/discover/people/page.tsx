import { getServerSession } from "@/server/permissions";
import { talentRepository } from "@/server/repositories/talent.repository";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { CapabilityChip } from "@/components/shared/CapabilityChip";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Discover People" };

export default async function DiscoverPeoplePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await getServerSession();
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1"));
  const pageSize = 12;

  const [people, total] = await Promise.all([
    talentRepository.listDiscoverable({ limit: pageSize, offset: (page - 1) * pageSize }),
    talentRepository.countDiscoverable({}),
  ]);

  const totalPages = Math.ceil(total / pageSize);

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
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Discover People</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">{total} students discoverable across USTED</p>
          </div>
        </div>

        {/* Grid */}
        {people.length === 0 ? (
          <EmptyState icon="person_search" title="No profiles found" description="No students match the current filters." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {people.map(p => (
                <Link
                  key={p.userId}
                  href={`/students/${p.userId}`}
                  className="group flex flex-col bg-surface-pure rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
                >
                  {/* Top bar */}
                  <div className="h-16 bg-gradient-to-br from-navy-deep to-navy-deep/80 relative">
                    <div className="absolute bottom-0 translate-y-1/2 left-space-lg">
                      <Avatar name={p.user.name} image={p.user.image} size="lg" />
                    </div>
                  </div>
                  <div className="p-space-lg pt-10">
                    <h3 className="font-title-md text-title-md text-navy-deep font-semibold group-hover:text-teal-accent transition-colors">{p.user.name}</h3>
                    {p.academicProfile && (
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                        {p.academicProfile.programme} {p.level ? `• ${p.level}` : ""}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.capabilities.slice(0, 3).map(c => (
                        <CapabilityChip key={c.id} name={c.capability.name} proficiency={c.proficiency as never} size="sm" />
                      ))}
                      {p.capabilities.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant">
                          +{p.capabilities.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.ventureInterests.slice(0, 2).map(vi => (
                        <Badge key={vi.id} variant="surface">{vi.sector.name}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-container-high">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {p.availability?.weeklyHoursBand ?? "?"} hrs/week
                      </span>
                      <span className="font-label-sm text-label-sm text-teal-accent font-semibold flex items-center gap-1">
                        View Profile <MaterialSymbol icon="arrow_forward" className="text-[14px] group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link href={`?page=${page - 1}`} className="px-4 py-2 rounded-xl bg-surface-pure shadow-sm font-label-md text-label-md text-on-surface hover:bg-surface-container transition-all">
                    ← Previous
                  </Link>
                )}
                <span className="font-body-md text-body-md text-on-surface-variant">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link href={`?page=${page + 1}`} className="px-4 py-2 rounded-xl bg-surface-pure shadow-sm font-label-md text-label-md text-on-surface hover:bg-surface-container transition-all">
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
