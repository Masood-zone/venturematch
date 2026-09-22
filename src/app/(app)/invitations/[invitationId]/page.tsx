"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { VentureStageBadge } from "@/components/shared/VentureStageBadge";
import { Avatar } from "@/components/ui/avatar";

type Invitation = {
  id: string; status: string; message?: string; proposedRole?: string; createdAt: string;
  venture: { id: string; name: string; stage: string; primarySector?: { name: string }; shortPitch?: string };
  sender: { id: string; name: string; image?: string };
  recipient: { id: string; name: string; image?: string };
  recommendation?: { overallScore: number };
};

export default function InvitationDetailPage() {
  const { invitationId } = useParams<{ invitationId: string }>();
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/invitations/${invitationId}`).then(r => r.json()).then(setInvitation);
  }, [invitationId]);

  async function respond(response: "INTERESTED" | "DECLINED") {
    setResponding(true);
    try {
      await fetch(`/api/v1/invitations/${invitationId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });
      router.push(response === "INTERESTED" ? "/match-requests" : "/dashboard");
    } finally {
      setResponding(false);
    }
  }

  if (!invitation) return (
    <div className="px-gutter py-space-lg flex justify-center">
      <span className="material-symbols-outlined text-[40px] text-teal-accent animate-spin">progress_activity</span>
    </div>
  );

  const isPending = invitation.status === "PENDING";

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-2xl mx-auto space-y-space-xl">
        <Link href="/match-requests" className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-navy-deep">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Match Requests
        </Link>

        {/* Invitation card */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl">
          <div className="flex items-center gap-3 mb-space-lg">
            <div className="w-12 h-12 rounded-2xl bg-navy-deep flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[22px]">rocket_launch</span>
            </div>
            <div className="flex-1">
              <h1 className="font-headline-sm text-headline-sm text-navy-deep font-bold">{invitation.venture.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {invitation.venture.primarySector && <span className="font-label-sm text-label-sm text-on-surface-variant">{invitation.venture.primarySector.name}</span>}
                <VentureStageBadge stage={invitation.venture.stage} />
              </div>
            </div>
            {invitation.recommendation && <MatchScoreBadge score={invitation.recommendation.overallScore} size="lg" showLabel />}
          </div>

          {invitation.venture.shortPitch && (
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg">{invitation.venture.shortPitch}</p>
          )}

          {/* Sender */}
          <div className="flex items-center gap-3 p-space-md rounded-xl bg-surface-subtle mb-space-lg">
            <Avatar name={invitation.sender.name} image={invitation.sender.image} size="md" />
            <div>
              <p className="font-label-md text-label-md text-navy-deep font-semibold">{invitation.sender.name}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Invited you to join</p>
            </div>
          </div>

          {/* Proposed role */}
          {invitation.proposedRole && (
            <div className="flex items-center gap-2 mb-space-md">
              <span className="material-symbols-outlined text-[18px] text-teal-accent">badge</span>
              <span className="font-body-md text-body-md text-on-surface">Proposed role: <strong className="text-navy-deep">{invitation.proposedRole}</strong></span>
            </div>
          )}

          {/* Message */}
          {invitation.message && (
            <div className="p-space-md rounded-xl bg-surface-subtle mb-space-lg">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Personal Message</p>
              <p className="font-body-md text-body-md text-on-surface italic">&ldquo;{invitation.message}&rdquo;</p>
            </div>
          )}

          {/* Status or actions */}
          {!isPending ? (
            <div className="flex items-center gap-2 p-space-md rounded-xl bg-surface-subtle">
              <span className="material-symbols-outlined text-[20px] text-teal-accent">info</span>
              <span className="font-body-md text-body-md text-on-surface">You have already responded: <strong className="text-navy-deep">{invitation.status}</strong></span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => respond("INTERESTED")}
                disabled={responding}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all disabled:opacity-60"
              >
                {responding ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : (
                  <><span className="material-symbols-outlined text-[18px]">handshake</span>Interested — Let&apos;s Talk</>
                )}
              </button>
              <button
                onClick={() => respond("DECLINED")}
                disabled={responding}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 border-2 border-outline-variant hover:border-error text-on-surface-variant hover:text-error font-label-md text-label-md rounded-xl transition-all disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
                Decline
              </button>
            </div>
          )}
        </div>

        <Link
          href={`/discover/ventures/${invitation.venture.id}`}
          className="flex items-center gap-3 p-space-md rounded-2xl bg-surface-pure shadow-sm hover:shadow-md transition-all group"
        >
          <span className="material-symbols-outlined text-[20px] text-teal-accent">rocket_launch</span>
          <span className="font-label-md text-label-md text-navy-deep group-hover:text-teal-accent transition-colors">View full venture profile</span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant ml-auto">chevron_right</span>
        </Link>
      </div>
    </div>
  );
}
