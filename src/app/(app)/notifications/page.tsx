import { getServerSession } from "@/server/permissions";
import { notificationsRepository } from "@/server/repositories/notifications.repository";
import { formatRelativeTime } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications" };

const NOTIFICATION_ICONS: Record<string, string> = {
  INVITATION_RECEIVED: "mail",
  INVITATION_ACCEPTED: "handshake",
  TRIAL_PROPOSED: "science",
  TRIAL_STARTED: "rocket_launch",
  NEW_MESSAGE: "chat",
  ROOM_INVITATION: "meeting_room",
  MATCH_FOUND: "auto_awesome",
};

export default async function NotificationsPage() {
  const session = await getServerSession();
  if (!session?.user) return null;

  const notifications = await notificationsRepository.getForUser(session.user.id, { limit: 50 });
  const unreadCount = notifications.filter(n => !n.readAt).length;

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <form action="/api/v1/notifications/read-all" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-outline-variant hover:border-navy-deep text-on-surface font-label-md text-label-md transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-teal-accent">done_all</span>
                Mark all read
              </button>
            </form>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon="notifications_none"
            title="No notifications yet"
            description="Activity from invitations, matches, and messages will appear here."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-space-md rounded-2xl shadow-sm transition-all ${!n.readAt ? "bg-secondary-container/20 border border-secondary-container/40" : "bg-surface-pure"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!n.readAt ? "bg-secondary-container" : "bg-surface-container-high"}`}>
                  <span className="material-symbols-outlined text-[18px] text-on-secondary-container">
                    {NOTIFICATION_ICONS[n.type] ?? "notifications"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-title-md text-title-md text-navy-deep font-semibold">{n.title}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">{n.body}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>
                {!n.readAt && (
                  <span className="w-2 h-2 rounded-full bg-teal-accent flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
