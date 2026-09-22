import { getServerSession } from "@/server/permissions";
import { messagingRepository } from "@/server/repositories/messaging.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conversation Details" };

export default async function ConversationDetailsPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const session = await getServerSession();
  const { conversationId } = await params;

  const isParticipant = await messagingRepository.isParticipant(conversationId, session?.user.id ?? "");
  if (!isParticipant) notFound();

  const convo = await messagingRepository.getConversation(conversationId);
  if (!convo) notFound();

  const other = convo.participants.filter(p => p.userId !== session?.user.id);

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-2xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href={`/messages/${conversationId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
          </Link>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Conversation Details</h1>
        </div>

        {/* Participants */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Participants ({convo.participants.length})</h2>
          <div className="space-y-3">
            {convo.participants.map(p => (
              <div key={p.userId} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle">
                <Avatar name={p.user.name} size="md" online={p.userId === session?.user.id} />
                <div className="flex-1">
                  <p className="font-label-md text-label-md text-navy-deep font-semibold">{p.user.name}</p>
                  {p.userId === session?.user.id && <p className="font-label-sm text-label-sm text-teal-accent">You</p>}
                </div>
                {p.userId !== session?.user.id && (
                  <Link href={`/students/${p.userId}`} className="font-label-sm text-label-sm text-teal-accent hover:underline">
                    View Profile
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Venture context */}
        {convo.venture && (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Related Venture</h2>
            <Link href={`/ventures/${convo.venture.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle hover:bg-surface-container transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-navy-deep flex items-center justify-center">
                {convo.venture.logoUrl
                  ? <img src={convo.venture.logoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                  : <span className="material-symbols-outlined text-on-primary text-[18px]">rocket_launch</span>
                }
              </div>
              <span className="font-label-md text-label-md text-navy-deep group-hover:text-teal-accent transition-colors font-semibold">{convo.venture.name}</span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant ml-auto">chevron_right</span>
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-3">Actions</h2>
          <div className="space-y-2">
            {other.map(p => (
              <Link key={p.userId} href={`/students/${p.userId}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-subtle transition-colors group">
                <span className="material-symbols-outlined text-[20px] text-teal-accent">person</span>
                <span className="font-label-md text-label-md text-navy-deep group-hover:text-teal-accent transition-colors">View {p.user.name}&apos;s Profile</span>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant ml-auto">chevron_right</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
