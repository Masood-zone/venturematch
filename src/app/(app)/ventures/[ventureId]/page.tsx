import { getServerSession } from "@/server/permissions";
import { venturesRepository } from "@/server/repositories/ventures.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { Avatar } from "@/components/ui/avatar";
import { CapabilityChip } from "@/components/shared/CapabilityChip";
import type { Metadata } from "next";
import Image from "next/image";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export async function generateMetadata({ params }: { params: Promise<{ ventureId: string }> }): Promise<Metadata> {
  const { ventureId } = await params;
  const v = await venturesRepository.findById(ventureId);
  return { title: v?.name ?? "Venture" };
}

const NAV_ITEMS = [
  { label: "Overview", href: "", icon: "home" },
  { label: "DNA", href: "/dna", icon: "psychology" },
  { label: "Gaps", href: "/gaps", icon: "search" },
  { label: "Recommendations", href: "/recommendations", icon: "auto_awesome" },
  { label: "Recruit", href: "/recruit", icon: "person_add" },
  { label: "Journey", href: "/journey", icon: "map" },
  { label: "Health", href: "/health", icon: "favorite" },
  { label: "Contributions", href: "/contributions", icon: "construction" },
  { label: "Charter", href: "/charter", icon: "description" },
  { label: "Analysis", href: "/analysis", icon: "analytics" },
];

export default async function VentureDetailPage({ params }: { params: Promise<{ ventureId: string }> }) {
  const session = await getServerSession();
  const { ventureId } = await params;
  const venture = await venturesRepository.findById(ventureId);
  if (!venture) notFound();

  const isOwner = session?.user.id === venture.ownerId;
  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-5xl mx-auto space-y-space-xl">
        {/* Back */}
        <Link href="/ventures" className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">
          <MaterialSymbol icon="arrow_back" className="text-[18px]" /> My Ventures
        </Link>

        {/* Venture header */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl">
          <div className="flex flex-col md:flex-row md:items-start gap-space-lg">
            <div className="w-16 h-16 rounded-2xl bg-navy-deep flex items-center justify-center flex-shrink-0 shadow-sm">
              {venture.logoUrl
                ? <Image src={venture.logoUrl} alt="" width={64} height={64} className="object-cover rounded-2xl" unoptimized />
                : <MaterialSymbol icon="rocket_launch" className="text-on-primary text-[28px]" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="font-headline-md text-headline-md text-navy-deep font-bold">{venture.name}</h1>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <VentureStageBadge stage={venture.stage} />
                    {venture.primarySector && <span className="font-label-sm text-label-sm text-on-surface-variant">{venture.primarySector.name}</span>}
                    <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${venture.status === "ACTIVE" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}>
                      {venture.status}
                    </span>
                  </div>
                </div>
                {isOwner && (
                  <div className="flex items-center gap-2">
                    {venture.status === "DRAFT" && (
                      <form action={`/api/v1/ventures/${ventureId}/publish`} method="POST">
                        <button type="submit" className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-teal-accent text-on-primary font-label-md text-label-md shadow-sm hover:bg-secondary transition-all text-[13px]">
                          <MaterialSymbol icon="publish" className="text-[16px]" /> Publish
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
              {venture.shortPitch && (
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-3">{venture.shortPitch}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="overflow-x-auto">
          <nav className="flex gap-1 p-1 bg-surface-container-low rounded-2xl w-max min-w-full">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={`/ventures/${ventureId}${item.href}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-pure hover:text-navy-deep transition-all whitespace-nowrap"
              >
                <MaterialSymbol icon={item.icon} className="text-[16px]" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Overview content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
          <div className="md:col-span-2 space-y-space-lg">
            {/* Problem/Solution */}
            {(venture.problem || venture.solution) && (
              <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg space-y-space-md">
                {venture.problem && (
                  <div>
                    <h3 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2 mb-2">
                      <MaterialSymbol icon="search" className="text-[18px] text-teal-accent" /> Problem
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{venture.problem}</p>
                  </div>
                )}
                {venture.solution && (
                  <div>
                    <h3 className="font-title-md text-title-md text-navy-deep font-semibold flex items-center gap-2 mb-2">
                      <MaterialSymbol icon="lightbulb" className="text-[18px] text-teal-accent" /> Solution
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{venture.solution}</p>
                  </div>
                )}
                {isOwner && (
                  <Link href={`/ventures/${ventureId}/dna`} className="inline-flex items-center gap-1 font-label-md text-label-md text-teal-accent hover:underline mt-2">
                    Edit details <MaterialSymbol icon="edit" className="text-[16px]" />
                  </Link>
                )}
              </div>
            )}

            {/* Requirements */}
            {venture.capabilityRequirements.length > 0 && (
              <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-title-md text-title-md text-navy-deep font-semibold">Capability Gaps</h3>
                  {isOwner && <Link href={`/ventures/${ventureId}/gaps`} className="font-label-md text-label-md text-teal-accent hover:underline">Manage</Link>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {venture.capabilityRequirements.map(r => (
                    <CapabilityChip key={r.id} name={r.capability.name} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick actions for owner */}
            {isOwner && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Run Matching", icon: "auto_awesome", href: `/ventures/${ventureId}/recommendations` },
                  { label: "View Gaps", icon: "search", href: `/ventures/${ventureId}/gaps` },
                  { label: "Recruit", icon: "person_add", href: `/ventures/${ventureId}/recruit` },
                  { label: "Journey", icon: "map", href: `/ventures/${ventureId}/journey` },
                  { label: "Health Check", icon: "favorite", href: `/ventures/${ventureId}/health` },
                  { label: "Team Charter", icon: "description", href: `/ventures/${ventureId}/charter` },
                ].map(a => (
                  <Link key={a.label} href={a.href} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-subtle hover:bg-surface-container transition-all text-center">
                    <MaterialSymbol icon={a.icon} className="text-[22px] text-teal-accent" />
                    <span className="font-label-sm text-label-sm text-navy-deep font-semibold">{a.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-space-lg">
            {/* Team */}
            <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
              <h3 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Team ({venture.members.filter(m => m.status === "ACTIVE").length})</h3>
              <div className="space-y-3">
                {venture.members.filter(m => m.status === "ACTIVE").map(m => (
                  <div key={m.userId} className="flex items-center gap-3">
                    <Avatar name={m.user?.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-label-md text-label-md text-navy-deep font-semibold truncate">{m.user?.name}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{m.membershipType}</p>
                    </div>
                    {m.userId === venture.ownerId && (
                      <MaterialSymbol icon="star" className="text-[16px] text-teal-accent" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
              <h3 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Details</h3>
              <div className="space-y-2">
                {[
                  { label: "Commitment", value: venture.expectedCommitment.replace(/_/g, " ") },
                  { label: "Target Users", value: venture.targetUsers },
                  { label: "Ambition", value: venture.ambition },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} className="flex items-start justify-between gap-2 py-1.5 border-b border-surface-container-high last:border-0">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex-shrink-0">{row.label}</span>
                    <span className="font-body-md text-body-md text-navy-deep text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
