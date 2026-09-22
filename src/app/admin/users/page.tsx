import { adminRepository } from "@/server/repositories/admin.repository";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Users — Admin" };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string; role?: string; search?: string }> }) {
  const { page: ps, role, search } = await searchParams;
  const page = Math.max(1, parseInt(ps ?? "1"));
  const [users, total] = await Promise.all([
    adminRepository.listUsers({ role, search, limit: 25, offset: (page - 1) * 25 }),
    adminRepository.countUsers({ role, search }),
  ]);
  const totalPages = Math.ceil(total / 25);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Users</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">{total} total users</p>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["", "student", "admin", "moderator", "verifier"].map(r => (
          <Link key={r} href={`?role=${r}&search=${search ?? ""}`}
            className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${(!role && !r) || role === r ? "bg-navy-deep text-on-primary" : "bg-surface-pure text-on-surface-variant border border-outline-variant hover:bg-surface-container-low"}`}>
            {r || "All Roles"}
          </Link>
        ))}
      </div>
      <div className="bg-surface-pure rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-subtle border-b border-surface-container-high">
            <tr>
              {["Name", "Email", "Role", "Joined", "Ventures", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-surface-subtle transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-navy-deep flex items-center justify-center text-on-primary font-label-sm text-label-sm font-bold flex-shrink-0">
                      {u.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className="font-label-md text-label-md text-navy-deep font-semibold">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm capitalize ${u.role === "admin" ? "bg-primary-container text-on-primary" : u.role === "moderator" ? "bg-amber-warm/20 text-amber-warm" : "bg-surface-container-high text-on-surface-variant"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{u._count.ownedVentures}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${u.id}`} className="font-label-md text-label-md text-teal-accent hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && <Link href={`?page=${page-1}&role=${role??""}&search=${search??""}`} className="px-4 py-2 rounded-xl bg-surface-pure shadow-sm font-label-md text-label-md hover:bg-surface-container transition-all">← Prev</Link>}
          <span className="font-body-md text-body-md text-on-surface-variant">Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={`?page=${page+1}&role=${role??""}&search=${search??""}`} className="px-4 py-2 rounded-xl bg-surface-pure shadow-sm font-label-md text-label-md hover:bg-surface-container transition-all">Next →</Link>}
        </div>
      )}
    </div>
  );
}
