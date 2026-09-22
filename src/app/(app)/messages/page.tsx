import { getServerSession } from "@/server/permissions";
import { messagingRepository } from "@/server/repositories/messaging.repository";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const session = await getServerSession();
  if (!session?.user) return null;

  const conversations = await messagingRepository.getUserConversations(session.user.id);

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Messages</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {conversations.length === 0 ? (
          <EmptyState icon="chat" title="No conversations yet" description="Start a conversation from someone's profile or venture page." />
        ) : (
          <div className="space-y-2">
            {conversations.map(convo => {
              const other = convo.participants.find(p => p.userId !== session.user.id);
              const lastMsg = convo.messages[0];
              const isUnread = lastMsg && lastMsg.senderUserId !== session.user.id;
              return (
                <Link
                  key={convo.id}
                  href={`/messages/${convo.id}`}
                  className="flex items-center gap-space-md p-space-md rounded-2xl bg-surface-pure shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="relative flex-shrink-0">
                    <Avatar name={other?.user.name ?? convo.venture?.name} size="md" online />
                    {isUnread && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-teal-accent ring-2 ring-surface-pure" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-title-md text-title-md truncate ${isUnread ? "text-navy-deep" : "text-on-surface"}`}>
                        {convo.type === "VENTURE" ? convo.venture?.name : other?.user.name ?? "Conversation"}
                      </p>
                      {lastMsg && <p className="font-label-sm text-label-sm text-on-surface-variant flex-shrink-0">{formatRelativeTime(lastMsg.createdAt)}</p>}
                    </div>
                    {lastMsg && (
                      <p className={`font-body-md text-body-md truncate mt-0.5 ${isUnread ? "text-navy-deep font-medium" : "text-on-surface-variant"}`}>
                        {lastMsg.sender?.name ? `${lastMsg.sender.name}: ` : ""}{lastMsg.body}
                      </p>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-teal-accent transition-colors flex-shrink-0">chevron_right</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
