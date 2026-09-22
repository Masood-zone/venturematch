"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function NewInvitationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ventureId = searchParams.get("ventureId") ?? "";
  const recipientId = searchParams.get("recipientId") ?? "";
  const recommendationId = searchParams.get("recommendationId") ?? "";

  const [proposedRole, setProposedRole] = useState("");
  const [expectedCommitment, setExpectedCommitment] = useState("SIDE_VENTURE");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [ventureName, setVentureName] = useState("");

  useEffect(() => {
    if (ventureId) fetch(`/api/v1/ventures/${ventureId}`).then(r => r.json()).then(v => setVentureName(v?.name ?? ""));
    if (recipientId) fetch(`/api/v1/profile`).then(r => r.json()); // placeholder
  }, [ventureId, recipientId]);

  async function handleSend() {
    if (!ventureId || !recipientId) { setError("Missing venture or recipient"); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ventureId, recipientUserId: recipientId,
          proposedRole: proposedRole || undefined,
          expectedCommitment,
          message: message || undefined,
          recommendationId: recommendationId || undefined,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      router.push(`/ventures/${ventureId}/recruit`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-2xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Send Invitation</h1>
            {ventureName && <p className="font-body-md text-body-md text-on-surface-variant">for {ventureName}</p>}
          </div>
        </div>

        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl space-y-space-lg">
          {error && (
            <div className="p-3 rounded-lg bg-error-container flex items-center gap-2">
              <span className="material-symbols-outlined text-on-error-container text-[18px]">error</span>
              <p className="font-body-md text-body-md text-on-error-container">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold">Proposed Role</label>
            <input
              type="text" value={proposedRole} onChange={e => setProposedRole(e.target.value)}
              placeholder="e.g. Technical Co-founder, Product Designer"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-navy-deep font-semibold">Expected Commitment</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["CASUAL", "SIDE_VENTURE", "SERIOUS", "FULL_TIME"].map(c => (
                <button
                  key={c} type="button" onClick={() => setExpectedCommitment(c)}
                  className={`py-2.5 rounded-xl font-label-md text-label-md transition-all border-2 text-center ${expectedCommitment === c ? "border-navy-deep bg-navy-deep/5 text-navy-deep" : "border-transparent bg-surface-subtle text-on-surface-variant hover:border-outline-variant"}`}
                >
                  {c.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold">Personal Message <span className="font-normal text-on-surface-variant">(optional)</span></label>
            <textarea
              value={message} onChange={e => setMessage(e.target.value)}
              rows={4} maxLength={1000}
              placeholder="Tell them why you think they'd be a great fit for your venture…"
              className="w-full px-3.5 py-3 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-teal-accent/40 resize-none transition-all"
            />
            <span className="font-label-sm text-label-sm text-on-surface-variant self-end">{message.length}/1000</span>
          </div>

          <div className="flex items-center justify-between pt-space-md border-t border-surface-container-high">
            <button onClick={() => router.back()} className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">Cancel</button>
            <button
              onClick={handleSend} disabled={loading}
              className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all disabled:opacity-60"
            >
              {loading ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : (
                <><span className="material-symbols-outlined text-[18px]">send</span>Send Invitation</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewInvitationPage() {
  return <Suspense><NewInvitationForm /></Suspense>;
}
