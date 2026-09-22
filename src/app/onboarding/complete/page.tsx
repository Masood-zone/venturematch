"use client";
import Link from "next/link";
import { OnboardingProgress } from "@/components/shared/OnboardingProgress";

export default function OnboardingCompletePage() {
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-space-md">
      <OnboardingProgress current={6} />

      <div className="bg-surface-pure rounded-2xl shadow-md p-space-xl text-center">
        {/* Celebration */}
        <div className="relative inline-flex items-center justify-center mb-space-lg">
          <div className="absolute inset-0 rounded-full bg-secondary-container/30 blur-xl" />
          <div className="relative w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[48px] text-on-secondary-container" style={{fontVariationSettings:"'FILL' 1"}}>celebration</span>
          </div>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-navy-deep font-bold tracking-tight mb-3">
          You&apos;re all set! 🎉
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto mb-space-xl">
          Your Talent DNA is live. VentureMatch is now finding co-founders and ventures that complement your skills.
        </p>

        {/* What's next */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-xl text-left">
          {[
            { icon: "auto_awesome", title: "View Your Matches", desc: "See ventures matched to your Talent DNA", href: "/matches", color: "text-teal-accent" },
            { icon: "explore", title: "Discover Ventures", desc: "Browse active ventures looking for co-founders", href: "/discover", color: "text-navy-deep" },
            { icon: "person", title: "Complete Profile", desc: "Add bio and capability evidence for stronger matches", href: "/profile", color: "text-amber-warm" },
          ].map(item => (
            <Link
              key={item.title}
              href={item.href}
              className="flex flex-col gap-3 p-space-md rounded-2xl bg-surface-subtle hover:bg-surface-container-low transition-all hover:-translate-y-0.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-pure flex items-center justify-center shadow-sm">
                <span className={`material-symbols-outlined text-[22px] ${item.color}`}>{item.icon}</span>
              </div>
              <div>
                <span className="font-title-md text-title-md text-navy-deep font-semibold group-hover:text-teal-accent transition-colors">{item.title}</span>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">{item.desc}</p>
              </div>
              <span className="material-symbols-outlined text-[18px] text-teal-accent mt-auto">arrow_forward</span>
            </Link>
          ))}
        </div>

        {/* Primary CTA */}
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-navy-deep hover:bg-on-primary-fixed text-on-primary font-label-md text-label-md rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all text-[15px]"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          Go to Dashboard
        </Link>

        <p className="font-body-md text-body-md text-on-surface-variant mt-space-md">
          You can update your profile and preferences at any time from the{" "}
          <Link href="/profile" className="text-teal-accent hover:underline font-medium">Profile</Link> page.
        </p>
      </div>
    </div>
  );
}
