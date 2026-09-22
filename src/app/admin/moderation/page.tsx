import { adminService } from "@/server/services/admin.service";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Moderation — Admin" };

export default async function AdminModerationPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const { page: ps, status } = await searchParams;
  const page = Math.max(1, parseInt(ps ?? "1"));
  const result = await adminService.listReports({ status, page, pageSize: 25 });
  if (!result.success) return <p>Error</p>;
  const { reports, total, totalPages } = result.data;

  const statusColor: Record<string, string> = {
    PENDING: "bg-amber-warm/20 text-amber-warm",
    UNDER_REVIEW: "bg-secondary-container text-on-secondary-container",
    RESOLVED: "bg-surface-container-high text-on-surface-variant",
    DISMISSED: "bg-surface-container-high text-on-surface-variant",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-navy-deep">Content Moderation</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">{total} reports</p>
      </div>
      <div className="flex gap-2">
        {["", "PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED"].map(s => (
          <Link key={s} href={`?status=${s}`}
            className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${(!status && !s) || status === s ? "bg-navy-deep text-on-primary" : "bg-surface-pure text-on-surface-variant border border-outline-variant hover:bg-surface-container-low"}`}>
            {s || "All"}
          </Link>
        ))}
      </div>
      {reports.length === 0 ? (
        <div className="bg-surface-pure rounded-2xl shadow-sm p-16 text-center">
          <span className="material-symbols-outlined text-[48px] text-teal-accent block mb-3">verified_user</span>
          <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold mb-2">Queue is clear</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">No reports matching this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r: { id: string; entityType: string; reason: string; status: string; createdAt: Date; reporter: { name: string }; moderationActions: { admin: { name: string }; action: string }[] }) => (
            <div key={r.id} className="bg-surface-pure rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">{r.entityType}</span>
                    <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${statusColor[r.status] ?? "bg-surface-container text-on-surface-variant"}`}>{r.status}</span>
                  </div>
                  <p className="font-label-md text-label-md text-navy-deep font-semibold">{r.reason}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    Reported by {r.reporter.name} · {formatRelativeTime(r.createdAt)}
                  </p>
                  {r.moderationActions[0] && (
                    <p className="font-label-sm text-label-sm text-teal-accent mt-1">
                      Action by {r.moderationActions[0].admin.name}: {r.moderationActions[0].action}
                    </p>
                  )}
                </div>
                {r.status === "PENDING" && (
                  <div className="flex gap-2">
                    <form action={`/api/v1/admin/reports/${r.id}/resolve`} method="POST">
                      <input type="hidden" name="reportId" value={r.id} />
                      <input type="hidden" name="action" value="CONTENT_REMOVED" />
                      <button type="submit" className="h-9 px-3 bg-error text-on-error font-label-sm text-label-sm rounded-lg hover:bg-error/90 transition-all">Remove</button>
                    </form>
                    <form action={`/api/v1/admin/reports/${r.id}/resolve`} method="POST">
                      <input type="hidden" name="reportId" value={r.id} />
                      <input type="hidden" name="action" value="DISMISSED" />
                      <button type="submit" className="h-9 px-3 border border-outline-variant text-on-surface-variant font-label-sm text-label-sm rounded-lg hover:bg-surface-container transition-all">Dismiss</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && <Link href={`?page=${page-1}&status=${status??""}`} className="px-4 py-2 rounded-xl bg-surface-pure shadow-sm font-label-md text-label-md hover:bg-surface-container">← Prev</Link>}
          <span className="font-body-md text-body-md text-on-surface-variant">Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={`?page=${page+1}&status=${status??""}`} className="px-4 py-2 rounded-xl bg-surface-pure shadow-sm font-label-md text-label-md hover:bg-surface-container">Next →</Link>}
        </div>
      )}
    </div>
  );
}
