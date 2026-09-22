import { getServerSession } from "@/server/permissions";
import { db } from "@/lib/db";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { Avatar } from "@/components/ui/avatar";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user) return null;
  const userId = session.user.id;
  const firstName = session.user.name.split(" ")[0];

  const [matchCount, ownedVentures, recentNotifications, recentInvitations, recentMatches] = await Promise.all([
    db.matchRecommendation.count({ where: { candidateUserId: userId, status: "ACTIVE" } }),
    db.venture.findMany({
      where: { ownerId: userId, status: { not: "ARCHIVED" } },
      include: {
        primarySector: true,
        members: {
          where: { status: "ACTIVE" },
          include: { user: { select: { id: true, name: true, image: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
    db.notification.findMany({
      where: { userId, readAt: null },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.ventureInvitation.findMany({
      where: { recipientUserId: userId, status: "PENDING" },
      include: {
        venture: { include: { primarySector: true } },
        sender: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.matchRecommendation.findMany({
      where: { candidateUserId: userId, status: "ACTIVE" },
      include: {
        venture: { include: { owner: { select: { id: true, name: true, image: true } }, primarySector: true } },
        factorScores: true,
      },
      orderBy: { overallScore: "desc" },
      take: 3,
    }),
  ]);

  const unreadCount = recentNotifications.length;
  const activeVentureCount = ownedVentures.filter(v => v.status === "ACTIVE").length;
  const conversationCount = await db.conversationParticipant.count({ where: { userId } });

  return (
    <div className="px-gutter py-space-lg">
      <div className="flex flex-col w-full space-y-space-xl max-w-[1200px] mx-auto">

        {/* Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Find complementary people and keep building.</p>
          </div>
          <div className="flex items-center gap-space-md self-start md:self-auto">
            <Link href="/notifications" className="relative p-2.5 rounded-xl bg-surface-pure hover:bg-surface-container shadow-sm text-navy-deep transition-all">
              <MaterialSymbol icon="notifications" className="text-[22px]" />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-warm ring-2 ring-surface-pure" />}
            </Link>
            <Link
              href="/ventures/new"
              className="flex items-center gap-space-xs px-space-lg py-3 rounded-xl bg-navy-deep text-on-primary font-label-md text-label-md shadow-sm hover:bg-on-primary-fixed transition-all"
            >
              <MaterialSymbol icon="add" className="text-[18px]" />
              <span>Start a Venture</span>
            </Link>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
          {[
            { label: "Total Matches", value: matchCount, icon: "group", color: "text-navy-deep", bg: "bg-surface-container" },
            { label: "Conversations", value: conversationCount, icon: "chat", color: "text-navy-deep", bg: "bg-surface-container" },
            { label: "Active Ventures", value: activeVentureCount, icon: "rocket_launch", color: "text-navy-deep", bg: "bg-surface-container" },
            { label: "Invitations", value: recentInvitations.length, icon: "mail", color: "text-teal-accent", bg: "bg-secondary-container/40" },
          ].map(m => (
            <div key={m.label} className="p-space-lg rounded-2xl bg-surface-pure shadow-sm flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{m.label}</p>
                <p className={`font-display-lg text-display-lg font-bold mt-1 ${m.label === "Invitations" ? "text-teal-accent" : "text-navy-deep"}`}>{m.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center ${m.color}`}>
                <MaterialSymbol icon={m.icon} className="text-[24px]" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-xl">
          {/* Left: ventures + matches */}
          <div className="lg:col-span-2 space-y-space-xl">

            {/* Pending invitations */}
            {recentInvitations.length > 0 && (
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Pending Invitations</h2>
                  <Link href="/invitations" className="font-label-md text-label-md text-teal-accent hover:underline">View all</Link>
                </div>
                <div className="space-y-3">
                  {recentInvitations.map(inv => (
                    <Link
                      key={inv.id}
                      href={`/invitations/${inv.id}`}
                      className="flex items-center gap-space-md p-space-md rounded-2xl bg-surface-pure shadow-sm hover:shadow-md transition-all group"
                    >
                      <Avatar name={inv.sender.name} image={inv.sender.image} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-title-md text-title-md text-navy-deep truncate">{inv.venture.name}</p>
                        <p className="font-body-md text-body-md text-on-surface-variant truncate">from {inv.sender.name}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-warm/20 text-amber-warm font-label-sm text-label-sm font-semibold">Pending</span>
                      <MaterialSymbol icon="chevron_right" className="text-[18px] text-on-surface-variant group-hover:text-teal-accent transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Top matches */}
            {recentMatches.length > 0 && (
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Your Top Matches</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Ventures that need your skills right now.</p>
                  </div>
                  <Link href="/matches" className="font-label-md text-label-md text-teal-accent hover:underline">View all</Link>
                </div>
                <div className="space-y-3">
                  {recentMatches.map(rec => (
                    <Link
                      key={rec.id}
                      href={`/discover/ventures/${rec.ventureId}`}
                      className="flex items-center gap-space-md p-space-lg rounded-2xl bg-surface-pure shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-navy-deep/10 flex items-center justify-center flex-shrink-0">
                        <MaterialSymbol icon="rocket_launch" className="text-[22px] text-navy-deep" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-title-md text-title-md text-navy-deep truncate group-hover:text-teal-accent transition-colors">{rec.venture.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {rec.venture.primarySector && (
                            <span className="font-label-sm text-label-sm text-on-surface-variant">{rec.venture.primarySector.name}</span>
                          )}
                          <VentureStageBadge stage={rec.venture.stage} />
                        </div>
                      </div>
                      <MatchScoreBadge score={rec.overallScore} size="md" />
                      <MaterialSymbol icon="chevron_right" className="text-[18px] text-on-surface-variant group-hover:text-teal-accent transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* My ventures */}
            {ownedVentures.length > 0 && (
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">My Ventures</h2>
                  <Link href="/ventures" className="font-label-md text-label-md text-teal-accent hover:underline">View all</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ownedVentures.map(v => (
                    <Link
                      key={v.id}
                      href={`/ventures/${v.id}`}
                      className="p-space-lg rounded-2xl bg-surface-pure shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-navy-deep flex items-center justify-center">
                          <MaterialSymbol icon="rocket_launch" className="text-on-primary text-[18px]" />
                        </div>
                        <VentureStageBadge stage={v.stage} />
                      </div>
                      <h3 className="font-title-md text-title-md text-navy-deep font-semibold truncate">{v.name}</h3>
                      {v.primarySector && (
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{v.primarySector.name}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex -space-x-1.5">
                          {v.members.slice(0, 3).map(m => (
                            <div key={m.userId} className="w-6 h-6 rounded-full bg-surface-container-high ring-2 ring-surface-pure flex items-center justify-center">
                              <span className="font-label-sm text-label-sm text-[10px] text-on-surface-variant">{m.user?.name?.[0]}</span>
                            </div>
                          ))}
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{v.members.length} member{v.members.length !== 1 ? "s" : ""}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: notifications feed */}
          <div className="space-y-space-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Recent Activity</h2>
              <Link href="/notifications" className="font-label-md text-label-md text-teal-accent hover:underline">View all</Link>
            </div>
            {recentNotifications.length === 0 ? (
              <div className="p-space-lg rounded-2xl bg-surface-pure shadow-sm text-center">
                <MaterialSymbol icon="notifications_none" className="text-[32px] text-on-surface-variant block mb-2" />
                <p className="font-body-md text-body-md text-on-surface-variant">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentNotifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 p-space-md rounded-2xl bg-surface-pure shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                      <MaterialSymbol icon={n.type === "NEW_MESSAGE" ? "chat" : n.type === "INVITATION_RECEIVED" ? "mail" : "notifications"} className="text-[16px] text-on-secondary-container" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label-md text-label-md text-navy-deep font-semibold truncate">{n.title}</p>
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{n.body}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{formatRelativeTime(n.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick links */}
            <div className="p-space-lg rounded-2xl bg-navy-deep text-on-primary">
              <h3 className="font-title-md text-title-md font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Discover People", icon: "person_search", href: "/discover/people" },
                  { label: "Browse Ventures", icon: "explore", href: "/discover/ventures" },
                  { label: "My Matches", icon: "auto_awesome", href: "/matches" },
                ].map(a => (
                  <Link key={a.label} href={a.href} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors">
                    <MaterialSymbol icon={a.icon} className="text-[18px] text-teal-accent" />
                    <span className="font-label-md text-label-md">{a.label}</span>
                    <MaterialSymbol icon="chevron_right" className="text-[16px] text-white/40 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
