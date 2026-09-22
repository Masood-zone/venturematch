import { getServerSession } from "@/server/permissions";
import { venturesRepository } from "@/server/repositories/ventures.repository";
import Link from "next/link";
import Image from "next/image";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Avatar } from "@/components/ui/avatar";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "My Ventures" };

export default async function VenturesPage() {
  const session = await getServerSession();
  if (!session?.user) return null;

  const [owned, member] = await Promise.all([
    venturesRepository.findByOwnerId(session.user.id),
    venturesRepository.findByMemberId(session.user.id),
  ]);
  const memberOnly = member.filter(v => v.ownerId !== session.user.id);

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-5xl mx-auto space-y-space-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">My Ventures</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Ventures you own or collaborate on.</p>
          </div>
          <Link href="/ventures/new" className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-navy-deep text-on-primary font-label-md text-label-md shadow-sm hover:bg-on-primary-fixed transition-all self-start">
            <MaterialSymbol icon="add" className="text-[18px]" />
            New Venture
          </Link>
        </div>

        {/* Owned ventures */}
        {owned.length > 0 && (
          <section className="space-y-space-md">
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Founded by me ({owned.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {owned.map(v => (
                <VentureCard key={v.id} venture={v} isOwner />
              ))}
            </div>
          </section>
        )}

        {/* Member ventures */}
        {memberOnly.length > 0 && (
          <section className="space-y-space-md">
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Collaborating on ({memberOnly.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {memberOnly.map(v => (
                <VentureCard key={v.id} venture={v} isOwner={false} />
              ))}
            </div>
          </section>
        )}

        {owned.length === 0 && memberOnly.length === 0 && (
          <EmptyState
            icon="rocket_launch"
            title="No ventures yet"
            description="Start your first venture or explore opportunities to join existing ones."
            action={
              <Link href="/ventures/new" className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all">
                <MaterialSymbol icon="add" className="text-[18px]" />
                Start a Venture
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}

type VentureCardItem = {
  id: string;
  name: string;
  status: string;
  stage: string;
  logoUrl?: string | null;
  shortPitch?: string | null;
  primarySector?: { name: string } | null;
  ownerId?: string;
  members: Array<{
    userId: string;
    user?: { name?: string | null } | null;
  }>;
};

function VentureCard({ venture, isOwner }: { venture: VentureCardItem; isOwner: boolean }) {
  const statusColors: Record<string, string> = {
    DRAFT: "bg-surface-container-high text-on-surface-variant",
    ACTIVE: "bg-secondary-container text-on-secondary-container",
    PAUSED: "bg-tertiary-fixed text-on-tertiary-container",
    COMPLETED: "bg-primary-container text-on-primary",
    ARCHIVED: "bg-surface-container text-on-surface-variant",
  };
  return (
    <Link href={`/ventures/${venture.id}`} className="group flex flex-col bg-surface-pure rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="p-space-lg flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-2xl bg-navy-deep flex items-center justify-center">
            {venture.logoUrl ? (
              <Image src={venture.logoUrl} alt="" width={48} height={48} className="object-cover rounded-2xl" unoptimized />
            ) : (
              <MaterialSymbol icon="rocket_launch" className="text-on-primary text-[22px]" />
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <VentureStageBadge stage={venture.stage} />
            <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${statusColors[venture.status] ?? "bg-surface-container text-on-surface-variant"}`}>
              {venture.status}
            </span>
          </div>
        </div>
        <h3 className="font-title-md text-title-md text-navy-deep font-semibold group-hover:text-teal-accent transition-colors">{venture.name}</h3>
        {venture.primarySector && <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{venture.primarySector.name}</p>}
        {venture.shortPitch && <p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">{venture.shortPitch}</p>}
      </div>
      <div className="px-space-lg pb-space-lg flex items-center justify-between border-t border-surface-container-high pt-3">
        <div className="flex -space-x-1.5">
          {venture.members.slice(0, 4).map(m => (
            <Avatar key={m.userId} name={m.user?.name} size="xs" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {isOwner && <span className="font-label-sm text-label-sm text-teal-accent font-semibold">Owner</span>}
          <MaterialSymbol icon="chevron_right" className="text-[18px] text-on-surface-variant group-hover:text-teal-accent transition-colors" />
        </div>
      </div>
    </Link>
  );
}
