"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

interface NavItem {
  label: string;
  icon: string;
  href: string;
  badge?: number | string;
  badgeVariant?: "teal" | "amber" | "navy";
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "home", href: "/dashboard" },
  { label: "Discover", icon: "explore", href: "/discover" },
  { label: "Matches", icon: "auto_awesome", href: "/matches" },
  { label: "Ventures", icon: "rocket_launch", href: "/ventures" },
  { label: "Messages", icon: "chat", href: "/messages" },
  { label: "My Profile", icon: "person", href: "/profile" },
  { label: "Notifications", icon: "notifications", href: "/notifications" },
];

interface AppShellProps {
  children: React.ReactNode;
  user?: { name: string; image?: string | null; role?: string };
  profileSubtitle?: string;
  unreadNotifications?: number;
  unreadMessages?: number;
  matchCount?: number;
}

export function AppShell({
  children,
  user,
  profileSubtitle,
  unreadNotifications = 0,
  unreadMessages = 0,
  matchCount = 0,
}: AppShellProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  const items = navItems.map(item => {
    if (item.href === "/matches") return { ...item, badge: matchCount || undefined, badgeVariant: "secondary" as const };
    if (item.href === "/messages") return { ...item, badge: unreadMessages || undefined, badgeVariant: "teal" as const };
    if (item.href === "/notifications") return { ...item, badge: unreadNotifications ? "•" : undefined, badgeVariant: "amber" as const };
    return item;
  });

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-pure z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(11,29,58,0.04)]">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="px-space-lg pt-space-lg pb-space-md flex items-start gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-navy-deep flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-on-primary text-[18px]">rocket_launch</span>
            </div>
            <div>
              <div className="font-title-md text-title-md text-navy-deep tracking-tight leading-tight">VentureMatch</div>
              <p className="font-label-sm text-label-sm text-on-surface-variant font-normal leading-normal">Connect Skills. Build Ventures.</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-space-md py-space-sm space-y-1">
            {items.map(item => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between px-space-md py-space-sm rounded-xl transition-all",
                    active
                      ? "bg-primary-container text-on-primary font-title-md"
                      : "font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  )}
                >
                  <div className="flex items-center gap-space-md">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full font-label-sm text-label-sm",
                        item.badgeVariant === "teal" && "bg-teal-accent text-on-primary",
                        item.badgeVariant === "amber" && "w-2 h-2 rounded-full bg-amber-warm p-0",
                        item.badgeVariant === "navy" && "bg-surface-container-high text-on-surface-variant",
                        (!item.badgeVariant || item.badgeVariant === "secondary") && "bg-secondary-container text-on-secondary-container",
                      )}
                    >
                      {item.badge !== "•" ? item.badge : ""}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User footer */}
        <div className="p-space-md mx-space-sm mb-space-md rounded-xl bg-surface-container-low shadow-[0_2px_8px_rgba(11,29,58,0.04)]">
          <div className="flex items-center gap-space-sm">
            <Avatar name={user?.name} image={user?.image} size="md" online />
            <div className="min-w-0 flex-1">
              <p className="font-label-md text-label-md text-navy-deep font-semibold truncate">{user?.name ?? "User"}</p>
              {profileSubtitle && (
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{profileSubtitle}</p>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="pl-72">
        {/* Top header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface-pure/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(11,29,58,0.04)] z-40 flex items-center justify-between px-gutter">
          <div className="flex items-center gap-space-sm">
            <span className="font-title-md text-title-md text-navy-deep font-bold hidden sm:inline-block">VentureMatch</span>
          </div>
          <div className="flex items-center gap-space-md">
            <Link href="/notifications" className="relative p-2.5 rounded-xl bg-surface-pure hover:bg-surface-container shadow-sm text-navy-deep transition-all">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadNotifications > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-warm ring-2 ring-surface-pure" />
              )}
            </Link>
            <Avatar name={user?.name} image={user?.image} size="sm" />
          </div>
        </header>

        {/* Page content */}
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
