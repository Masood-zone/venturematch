"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";

const CATEGORIES = [
  { value: "ACCOUNT", label: "Account & Profile", icon: "manage_accounts" },
  { value: "VENTURE", label: "Ventures", icon: "rocket_launch" },
  { value: "MATCHING", label: "Matching & Invitations", icon: "auto_awesome" },
  { value: "BUG", label: "Bug Report", icon: "bug_report" },
  { value: "FEATURE", label: "Feature Request", icon: "lightbulb" },
  { value: "OTHER", label: "Other", icon: "help" },
];

export default function SupportPage() {
  const router = useRouter();
  const [category, setCategory] = useState("ACCOUNT");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/v1/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, description }),
      });
      if (res.ok) {
        const d = await res.json();
        setRefCode(d.referenceCode ?? "VM-" + Date.now().toString(36).toUpperCase());
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="px-gutter py-space-lg">
        <div className="max-w-lg mx-auto">
          <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl text-center">
            <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px] text-on-secondary-container">check_circle</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-navy-deep font-bold mb-2">Ticket Submitted</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg">
              Your support ticket has been received. Our team will respond within 2 hours during business hours.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low mb-space-xl">
              <span className="material-symbols-outlined text-[18px] text-teal-accent">confirmation_number</span>
              <span className="font-title-md text-title-md text-navy-deep font-semibold">{refCode}</span>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setSubmitted(false); setSubject(""); setDescription(""); }}
                className="inline-flex items-center justify-center gap-2 h-11 px-6 border-2 border-outline-variant rounded-xl font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-all"
              >
                Submit Another Ticket
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-3xl mx-auto space-y-space-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Support</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Our team typically responds within 2 business hours.</p>
          </div>
          <a
            href="/help"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-outline-variant hover:border-navy-deep text-on-surface font-label-md text-label-md transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-teal-accent">help</span>
            Browse Help Centre
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-xl">
          {[
            { icon: "schedule", label: "Response Time", value: "< 2 hours" },
            { icon: "support_agent", label: "Support Hours", value: "Mon–Fri, 8am–6pm" },
            { icon: "chat", label: "Support Channel", value: "In-app ticketing" },
          ].map(item => (
            <div key={item.label} className="p-space-md rounded-2xl bg-surface-pure shadow-sm text-center">
              <span className="material-symbols-outlined text-[24px] text-teal-accent block mb-2">{item.icon}</span>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{item.label}</p>
              <p className="font-title-md text-title-md text-navy-deep font-semibold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-pure rounded-2xl shadow-sm p-space-lg space-y-space-lg">
          <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Submit a Support Ticket</h2>

          {/* Category */}
          <div>
            <label className="font-label-md text-label-md text-navy-deep font-semibold block mb-3">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left font-label-md text-label-md ${category === c.value ? "border-navy-deep bg-navy-deep/5 text-navy-deep" : "border-transparent bg-surface-subtle text-on-surface-variant hover:border-outline-variant"}`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${category === c.value ? "text-teal-accent" : "text-on-surface-variant"}`}>{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              required
              minLength={5}
              maxLength={200}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full h-11 px-3.5 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="desc">Description</label>
            <textarea
              id="desc"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your issue in detail. Include steps to reproduce if reporting a bug."
              className="w-full px-3.5 py-3 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all resize-none"
            />
            <span className="font-label-sm text-label-sm text-on-surface-variant self-end">{description.length}/5000</span>
          </div>

          <div className="flex items-center justify-end pt-space-md border-t border-surface-container-high">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all disabled:opacity-60"
            >
              {loading ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : (
                <><span className="material-symbols-outlined text-[18px]">send</span> Submit Ticket</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
