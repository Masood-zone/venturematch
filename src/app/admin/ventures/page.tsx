import { adminService } from "@/server/services/admin.service";
import Link from "next/link";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Ventures — Admin" };

export default async function AdminVenturesPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string; search?: string }> }) {
  const { page: ps, status, search } = await searchParams;
  const page = Math.max(1, parseInt(ps ?? "1"));
  const result = await adminService.listVentures({ status, search, page, pageSize: 25 });
  if (!result.success) return <p>Error loading ventures</p>;
  const { ventures, total, totalPages } = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Ventures</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">{total} total ventures</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {["", "DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"].map(s => (
          <Link key={s} href={`?status=${s}`}
            className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${(!status && !s) || status === s ? "bg-navy-deep text-on-primary" : "bg-surface-pure text-on-surface-variant border border-outline-variant hover:bg-surface-container-low"}`}>
            {s || "All"}
          </Link>
        ))}
      </div>
      <div className="bg-surface-pure rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-subtle border-b border-surface-container-high">
            <tr>
              {["Venture", "Owner", "Stage", "Status", "Created", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high">
            {ventures.map((v: { id: string; name: string; owner: { name: string; email: string }; stage: string; status: string; createdAt: Date }) => (
              <tr key={v.id} className="hover:bg-surface-subtle transition-colors">
                <td className="px-4 py-3 font-label-md text-label-md text-navy-deep font-semibold">{v.name}</td>
                <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{v.owner.name}</td>
                <td className="px-4 py-3"><VentureStageBadge stage={v.stage} /></td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${v.status === "ACTIVE" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}>{v.status}</span>
                </td>
                <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{formatDate(v.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/ventures/${v.id}`} className="font-label-md text-label-md text-teal-accent hover:underline">Manage</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && <Link href={`?page=${page-1}&status=${status??""}`} className="px-4 py-2 rounded-xl bg-surface-pure shadow-sm font-label-md text-label-md hover:bg-surface-container">← Prev</Link>}
          <span className="font-body-md text-body-md text-on-surface-variant">Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={`?page=${page+1}&status=${status??""}`} className="px-4 py-2 rounded-xl bg-surface-pure shadow-sm font-label-md text-label-md hover:bg-surface-container">Next →</Link>}
        </div>
      )}
    </div>
  );
}
