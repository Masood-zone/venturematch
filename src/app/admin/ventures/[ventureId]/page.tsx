import { adminService } from "@/server/services/admin.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { Avatar } from "@/components/ui/avatar";
import type { Metadata } from "next";
import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Venture Detail — Admin" };

type AdminVentureDetail = {
  id: string;
  name: string;
  status: string;
  stage: string;
  expectedCommitment: string;
  shortPitch?: string | null;
  members: Array<{
    userId: string;
    status: string;
    membershipType: string;
    user?: { name?: string | null; image?: string | null } | null;
  }>;
  owner: { name: string | null };
};

export default async function AdminVentureDetailPage({ params }: { params: Promise<{ ventureId: string }> }) {
  const { ventureId } = await params;
  const result = await adminService.getVentureDetail(ventureId);
  if (!result.success) notFound();
  const v = result.data as AdminVentureDetail;

  const STATUSES = ["DRAFT","ACTIVE","PAUSED","COMPLETED","ARCHIVED"];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/ventures" className="p-2 rounded-xl hover:bg-surface-container transition-colors">
          <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
        </Link>
        <div>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep">{v.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <VentureStageBadge stage={v.stage} />
            <span className="font-label-sm text-label-sm text-on-surface-variant">by {v.owner.name}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-pure rounded-2xl shadow-sm p-5">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Venture Details</h2>
          {[
            { label: "ID", value: v.id },
            { label: "Status", value: v.status },
            { label: "Stage", value: v.stage },
            { label: "Commitment", value: v.expectedCommitment },
            { label: "Members", value: v.members.filter((m: { status: string }) => m.status === "ACTIVE").length },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2 border-b border-surface-container-high last:border-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{r.label}</span>
              <span className="font-body-md text-body-md text-navy-deep font-medium">{String(r.value)}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface-pure rounded-2xl shadow-sm p-5">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Status Management</h2>
          <form action={`/api/v1/admin/ventures/${ventureId}`} method="PATCH" className="space-y-3">
            <select name="status" defaultValue={v.status} className="w-full h-11 px-3 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input name="reason" type="text" placeholder="Reason (optional)" className="w-full h-10 px-3 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md border border-outline-variant focus:outline-none" />
            <button type="submit" className="w-full h-10 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all">Update Status</button>
          </form>
        </div>
      </div>

      {v.shortPitch && (
        <div className="bg-surface-pure rounded-2xl shadow-sm p-5">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-2">Short Pitch</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{v.shortPitch}</p>
        </div>
      )}

      <div className="bg-surface-pure rounded-2xl shadow-sm p-5">
        <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Team Members</h2>
        <div className="space-y-2">
          {v.members.filter((m: { status: string }) => m.status === "ACTIVE").map((m: { userId: string; membershipType: string; user?: { name?: string | null; image?: string | null } | null }) => (
            <div key={m.userId} className="flex items-center gap-3 p-2 rounded-lg bg-surface-subtle">
              <Avatar name={m.user?.name ?? undefined} size="sm" />
              <span className="font-label-md text-label-md text-navy-deep">{m.user?.name ?? "Unknown user"}</span>
              <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">{m.membershipType}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
