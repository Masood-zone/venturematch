"use client";
import { useState } from "react";
import Link from "next/link";

import { MaterialSymbol } from "@/components/ui/material-symbol";
const CATEGORIES = [
  { icon: "person_search", label: "Talent DNA & Profile", count: 8, slug: "talent-dna" },
  { icon: "auto_awesome", label: "Match Score & Algorithm", count: 6, slug: "matching" },
  { icon: "rocket_launch", label: "Ventures", count: 10, slug: "ventures" },
  { icon: "science", label: "Founder Trials", count: 7, slug: "founder-trials" },
  { icon: "chat", label: "Messaging", count: 4, slug: "messaging" },
  { icon: "admin_panel_settings", label: "Account & Privacy", count: 5, slug: "account" },
];

const ARTICLES = [
  { slug: "how-match-score-works", title: "How is my Match Score calculated?", category: "matching", excerpt: "The Match Score uses 7 weighted factors: capability coverage (35%), interest alignment (20%), commitment (15%), availability (10%), goal alignment (10%), working style (5%), and evidence (5%)." },
  { slug: "what-is-talent-dna", title: "What is a Talent DNA profile?", category: "talent-dna", excerpt: "Your Talent DNA is a structured representation of your capabilities, interests, and preferences that powers the matching algorithm." },
  { slug: "founder-trial-explained", title: "What is a Founder Trial?", category: "founder-trials", excerpt: "A Founder Trial is a structured 7-day collaboration period where both parties complete tasks and review each other before formalising a venture partnership." },
  { slug: "creating-a-venture", title: "How do I create a venture?", category: "ventures", excerpt: "Navigate to Ventures → New Venture. You'll enter your idea details, target users, capability requirements and then publish to start matching." },
  { slug: "sending-invitations", title: "How do invitations work?", category: "matching", excerpt: "As a venture owner you can send direct invitations or invite from matched recommendations. Candidates respond with interest or decline." },
  { slug: "messaging-rules", title: "Who can I message?", category: "messaging", excerpt: "You can message anyone you've matched with or exchanged an invitation with. Direct conversations are private between participants." },
  { slug: "profile-strength", title: "How do I increase profile strength?", category: "talent-dna", excerpt: "Add your bio, academic details, at least 3 capabilities, 2 sector interests, and your preferences. Each completed section boosts your strength score." },
  { slug: "venture-charter", title: "What is a Team Charter?", category: "ventures", excerpt: "A Team Charter is a shared agreement that documents roles, meeting frequency, decision-making methods, and team expectations." },
];

const SUGGESTED = ["Match Score", "Founder Trial", "Talent DNA", "Venture creation", "Team Charter"];

export default function HelpPage() {
  const [query, setQuery] = useState("");

  const filtered = ARTICLES.filter(a =>
    !query || a.title.toLowerCase().includes(query.toLowerCase()) || a.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-surface-subtle min-h-screen pt-16">
      <main className="w-full px-gutter py-space-lg">
        <div className="flex flex-col w-full max-w-5xl mx-auto">
          {/* Hero search */}
          <section className="relative overflow-hidden rounded-2xl bg-surface-pure shadow-sm px-6 py-12 lg:py-16 text-center mb-space-xl">
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <svg className="h-full w-full" fill="none" viewBox="0 0 800 400">
                <circle cx="120" cy="80" fill="#0AA08A" r="1.5" />
                <circle cx="680" cy="90" fill="#0AA08A" opacity="0.3" r="2" />
                <circle cx="720" cy="280" fill="#F5A623" opacity="0.4" r="2.5" />
                <circle cx="400" cy="200" fill="#0AA08A" opacity="0.5" r="3" />
                <path d="M120 80L280 140M680 90L720 280M280 140L400 200" opacity="0.15" stroke="#0B1D3A" strokeDasharray="4 6" strokeWidth="0.75" />
              </svg>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle text-navy-deep font-label-sm text-label-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-teal-accent" />
                <span>VentureMatch Knowledge Hub • USTED</span>
              </div>
              <h1 className="font-display-lg text-display-lg text-navy-deep tracking-tight">
                How can we help you build?
              </h1>
              <p className="mt-3 font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Find clear guidance on Talent DNA, Match Scores, ventures, Founder Trials, and campus governance.
              </p>
              <div className="mt-8 w-full max-w-2xl relative">
                <div className="relative flex items-center shadow-md rounded-xl bg-surface-pure focus-within:shadow-xl focus-within:ring-2 focus-within:ring-teal-accent transition-all">
                  <MaterialSymbol icon="search" className="text-outline-variant pl-4 text-[24px]" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search VentureMatch help (e.g., 'How is Match Score calculated?')..."
                    className="w-full py-4 pl-3 pr-12 text-navy-deep bg-transparent font-body-md text-body-md placeholder:text-outline focus:outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="absolute right-3 p-1.5 rounded-lg text-outline-variant hover:text-navy-deep hover:bg-surface-subtle">
                      <MaterialSymbol icon="close" className="text-[18px]" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {SUGGESTED.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 rounded-full bg-surface-subtle hover:bg-surface-container font-label-sm text-label-sm text-navy-deep transition-colors border border-outline-variant/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Categories */}
          {!query && (
            <section className="mb-space-xl">
              <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold mb-space-md">Browse by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-space-md">
                {CATEGORIES.map(cat => (
                  <div key={cat.slug} className="bg-surface-pure rounded-2xl p-space-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-surface-subtle flex items-center justify-center mb-3">
                      <MaterialSymbol icon={cat.icon} className="text-[20px] text-teal-accent" />
                    </div>
                    <h3 className="font-title-md text-title-md text-navy-deep font-semibold">{cat.label}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{cat.count} articles</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Articles */}
          <section>
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold mb-space-md">
              {query ? `Results for "${query}"` : "Popular Articles"}
            </h2>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <MaterialSymbol icon="search_off" className="text-[48px] text-on-surface-variant" />
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-4">No articles found for &ldquo;{query}&rdquo;</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(art => (
                  <Link
                    key={art.slug}
                    href={`/help/${art.slug}`}
                    className="flex items-start gap-4 bg-surface-pure rounded-xl p-space-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MaterialSymbol icon="article" className="text-[18px] text-teal-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-title-md text-title-md text-navy-deep group-hover:text-teal-accent transition-colors">{art.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1 line-clamp-2">{art.excerpt}</p>
                    </div>
                    <MaterialSymbol icon="arrow_forward_ios" className="text-[20px] text-on-surface-variant group-hover:text-teal-accent transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Contact CTA */}
          <div className="mt-space-xl p-space-lg rounded-2xl bg-surface-pure shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Still need help?</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Contact our support team — we typically respond within 2 hours.</p>
            </div>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-deep text-on-primary font-label-md text-label-md shadow-sm hover:bg-on-primary-fixed transition-all"
            >
              <MaterialSymbol icon="support_agent" className="text-[18px]" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
