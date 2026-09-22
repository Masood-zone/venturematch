import { getServerSession } from "@/server/permissions";
import { trialsRepository } from "@/server/repositories/trials.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import type { Metadata } from "next";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Venture Room" };

export default async function VentureRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const session = await getServerSession();
  const { roomId } = await params;
  const room = await trialsRepository.getRoom(roomId);
  if (!room) notFound();

  const isOwner = session?.user.id === room.venture.ownerId;
  const activeTrial = room.trials[0];

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <Link href={`/ventures/${room.ventureId}`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
          </Link>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Venture Room</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{room.venture.name}</p>
          </div>
          <span className={`ml-auto px-3 py-1 rounded-full font-label-sm text-label-sm ${room.status === "OPEN" ? "bg-secondary-container text-on-secondary-container" : room.status === "TRIAL_ACTIVE" ? "bg-amber-warm/20 text-amber-warm" : "bg-surface-container-high text-on-surface-variant"}`}>
            {room.status}
          </span>
        </div>

        {/* Participants */}
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">Room Participants ({room.participants.length})</h2>
          <div className="space-y-3">
            {room.participants.map(p => (
              <div key={p.userId} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle">
                <Avatar name={p.user.name} size="md" />
                <div className="flex-1">
                  <p className="font-label-md text-label-md text-navy-deep font-semibold">{p.user.name}</p>
                  {p.proposedRole && <p className="font-label-sm text-label-sm text-on-surface-variant">{p.proposedRole}</p>}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${p.status === "ACTIVE" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active trial */}
        {activeTrial ? (
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-title-md text-title-md text-navy-deep font-semibold">Active Trial</h2>
              <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${activeTrial.status === "ACTIVE" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}>
                {activeTrial.status}
              </span>
            </div>
            <Link
              href={`/trials/${activeTrial.id}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle hover:bg-surface-container-high transition-colors group"
            >
              <MaterialSymbol icon="science" className="text-[20px] text-teal-accent" />
              <span className="font-label-md text-label-md text-navy-deep group-hover:text-teal-accent transition-colors">View Trial Details</span>
              <MaterialSymbol icon="chevron_right" className="text-[18px] text-on-surface-variant ml-auto" />
            </Link>
          </div>
        ) : (
          isOwner && room.status === "OPEN" && room.participants.length > 1 && (
            <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg text-center">
              <MaterialSymbol icon="science" className="text-[40px] text-teal-accent block mb-3" />
              <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold mb-2">Ready to Start a Trial?</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                All participants are in the room. Start a Founder Trial to formally evaluate compatibility.
              </p>
              <Link
                href={`/ventures/${room.ventureId}/recruit`}
                className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all"
              >
                <MaterialSymbol icon="play_arrow" className="text-[18px]" />
                Start Founder Trial
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}
