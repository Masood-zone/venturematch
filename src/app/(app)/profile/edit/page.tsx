"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";
export default function EditProfilePage() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [discoverability, setDiscoverability] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/v1/profile").then(r => r.json()).then(d => {
      if (d?.bio) setBio(d.bio);
      if (typeof d?.discoverability === "boolean") setDiscoverability(d.discoverability);
    });
  }, []);

  async function handleSave() {
    setLoading(true);
    try {
      await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, discoverability }),
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); router.push("/profile"); }, 1200);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-2xl mx-auto space-y-space-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
          </button>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Edit Profile</h1>
        </div>

        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg space-y-space-lg">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Tell founders what makes you a great collaborator…"
              className="w-full px-3.5 py-3 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all resize-none"
            />
            <span className="font-label-sm text-label-sm text-on-surface-variant self-end">{bio.length}/500</span>
          </div>

          <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-subtle">
            <div>
              <p className="font-title-md text-title-md text-navy-deep font-semibold">Discoverability</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Allow ventures to discover and invite you</p>
            </div>
            <button
              type="button"
              onClick={() => setDiscoverability(d => !d)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${discoverability ? "bg-teal-accent" : "bg-surface-container-high"}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${discoverability ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-space-md border-t border-surface-container-high">
            <button onClick={() => router.back()} className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">Cancel</button>
            <button
              onClick={handleSave}
              disabled={loading || saved}
              className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all disabled:opacity-60"
            >
              {saved ? (
                <><MaterialSymbol icon="check" className="text-[18px]" />Saved!</>
              ) : loading ? (
                <MaterialSymbol icon="progress_activity" className="text-[18px] animate-spin" />
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>
        </div>

        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-lg">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-space-md">Update Capabilities & Interests</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">Re-run the onboarding steps to update your capability selections and venture interests.</p>
          <div className="flex flex-wrap gap-3">
            <a href="/onboarding/capabilities" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-outline-variant hover:border-navy-deep text-on-surface font-label-md text-label-md transition-all">
              <MaterialSymbol icon="psychology" className="text-[18px] text-teal-accent" />
              Update Capabilities
            </a>
            <a href="/onboarding/interests" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-outline-variant hover:border-navy-deep text-on-surface font-label-md text-label-md transition-all">
              <MaterialSymbol icon="explore" className="text-[18px] text-teal-accent" />
              Update Interests
            </a>
            <a href="/onboarding/preferences" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-outline-variant hover:border-navy-deep text-on-surface font-label-md text-label-md transition-all">
              <MaterialSymbol icon="tune" className="text-[18px] text-teal-accent" />
              Update Preferences
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
