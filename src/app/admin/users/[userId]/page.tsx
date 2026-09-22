import { adminService } from "@/server/services/admin.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { CapabilityChip } from "@/components/shared/CapabilityChip";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "User Detail — Admin" };

export default async function AdminUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const result = await adminService.getUserDetail(userId);
  if (!result.success) notFound();
  const user = result.data as any;
  const profile = user?.studentProfile;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="p-2 rounded-xl hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep">{user.name}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">{user.email}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full font-label-sm text-label-sm capitalize ${user.role === "admin" ? "bg-primary-container text-on-primary" : user.role === "moderator" ? "bg-amber-warm/20 text-amber-warm" : "bg-surface-container-high text-on-surface-variant"}`}>
          {user.role}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-pure rounded-2xl shadow-sm p-5">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Account Info</h2>
          {[
            { label: "User ID", value: user.id },
            { label: "Email Verified", value: user.emailVerified ? "Yes" : "No" },
            { label: "Joined", value: formatDate(user.createdAt) },
            { label: "Onboarding", value: profile?.onboardingCompleted ? "Complete" : "Incomplete" },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2 border-b border-surface-container-high last:border-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{r.label}</span>
              <span className="font-body-md text-body-md text-navy-deep font-medium">{r.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface-pure rounded-2xl shadow-sm p-5">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Role Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-3">Current role: <strong>{user.role}</strong></p>
          <form action={`/api/v1/admin/users/${userId}`} method="PATCH" className="flex gap-2">
            <select name="role" defaultValue={user.role} className="flex-1 h-10 px-3 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40">
              <option value="student">Student</option>
              <option value="moderator">Moderator</option>
              <option value="verifier">Verifier</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="h-10 px-4 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all">Update</button>
          </form>
        </div>
      </div>

      {profile && profile.capabilities.length > 0 && (
        <div className="bg-surface-pure rounded-2xl shadow-sm p-5">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Capabilities ({profile.capabilities.length})</h2>
          <div className="flex flex-wrap gap-2">
            {profile.capabilities.map(c => <CapabilityChip key={c.id} name={c.capability.name} proficiency={c.proficiency as never} size="sm" />)}
          </div>
        </div>
      )}

      {user.ownedVentures.length > 0 && (
        <div className="bg-surface-pure rounded-2xl shadow-sm p-5">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Owned Ventures ({user.ownedVentures.length})</h2>
          <div className="space-y-2">
            {user.ownedVentures.map(v => (
              <Link key={v.id} href={`/admin/ventures/${v.id}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-subtle transition-colors">
                <span className="material-symbols-outlined text-[16px] text-teal-accent">rocket_launch</span>
                <span className="font-label-md text-label-md text-navy-deep">{v.name}</span>
                <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">{v.status}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
