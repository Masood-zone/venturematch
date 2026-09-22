import { getServerSession } from "@/server/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Users", href: "/admin/users", icon: "group" },
  { label: "Ventures", href: "/admin/ventures", icon: "rocket_launch" },
  { label: "Moderation", href: "/admin/moderation", icon: "shield" },
  { label: "Configuration", href: "/admin/configuration", icon: "settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect("/admin/sign-in");
  const role = session.user.role ?? "";
  if (!["admin", "moderator", "verifier"].includes(role)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-surface-subtle flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-navy-deep z-50 flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-accent text-[22px]">admin_panel_settings</span>
            <span className="font-title-md text-title-md text-on-primary font-bold">Admin Panel</span>
          </div>
          <p className="font-label-sm text-label-sm text-on-primary/50 mt-1">VentureMatch</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-label-md text-label-md text-on-primary/70 hover:bg-white/10 hover:text-on-primary transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-on-primary">person</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-primary font-semibold truncate">{session.user.name}</p>
              <p className="font-label-sm text-label-sm text-on-primary/50 capitalize">{role}</p>
            </div>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 mt-3 text-on-primary/60 hover:text-on-primary font-label-sm text-label-sm transition-colors">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to App
          </Link>
        </div>
      </aside>
      {/* Content */}
      <div className="pl-64 flex-1">
        <header className="h-14 bg-surface-pure border-b border-surface-container-high flex items-center px-6 gap-3 sticky top-0 z-40">
          <span className="font-title-md text-title-md text-navy-deep font-semibold">VentureMatch Admin</span>
          <span className="ml-auto px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm capitalize">{role}</span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
