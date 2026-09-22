import { adminRepository } from "@/server/repositories/admin.repository";
import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await adminRepository.getPlatformStats();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Platform Dashboard</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Live overview of VentureMatch activity.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: "group", href: "/admin/users" },
          { label: "Total Ventures", value: stats.totalVentures, icon: "rocket_launch", href: "/admin/ventures" },
          { label: "Active Ventures", value: stats.activeVentures, icon: "check_circle", href: "/admin/ventures?status=ACTIVE" },
          { label: "Pending Reports", value: stats.pendingReports, icon: "flag", href: "/admin/moderation", urgent: stats.pendingReports > 0 },
          { label: "Open Tickets", value: stats.openTickets, icon: "support_agent", href: "/admin/moderation", urgent: stats.openTickets > 0 },
        ].map(m => (
          <Link key={m.label} href={m.href}
            className={`p-5 rounded-2xl shadow-sm flex flex-col gap-3 hover:-translate-y-0.5 transition-all ${m.urgent && m.value > 0 ? "bg-amber-warm/10 border border-amber-warm/30" : "bg-surface-pure"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.urgent && m.value > 0 ? "bg-amber-warm text-on-primary" : "bg-surface-container text-navy-deep"}`}>
              <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
            </div>
            <div>
              <p className="font-display-lg text-display-lg font-bold text-navy-deep">{m.value}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{m.label}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "User Management", desc: "Manage roles, suspend accounts, view profiles", href: "/admin/users", icon: "manage_accounts" },
          { title: "Venture Oversight", desc: "Approve, pause, or archive ventures", href: "/admin/ventures", icon: "rocket_launch" },
          { title: "Content Moderation", desc: "Review reports and moderation queue", href: "/admin/moderation", icon: "shield" },
          { title: "System Configuration", desc: "Matching weights, feature flags, settings", href: "/admin/configuration", icon: "settings" },
        ].map(item => (
          <Link key={item.title} href={item.href}
            className="flex items-start gap-4 p-5 rounded-2xl bg-surface-pure shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-navy-deep/5 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px] text-navy-deep">{item.icon}</span>
            </div>
            <div>
              <h3 className="font-title-md text-title-md text-navy-deep font-semibold group-hover:text-teal-accent transition-colors">{item.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">{item.desc}</p>
            </div>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant ml-auto group-hover:text-teal-accent transition-colors">arrow_forward</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
