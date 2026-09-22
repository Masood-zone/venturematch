import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Discover" };

export default function DiscoverPage() {
  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-4xl mx-auto space-y-space-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep tracking-tight">Discover</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Find people and ventures across the USTED campus network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          <Link
            href="/discover/people"
            className="group p-space-xl rounded-2xl bg-surface-pure shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-on-secondary-container">person_search</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold group-hover:text-teal-accent transition-colors">Discover People</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Browse student talent profiles, filter by capability, and find your next co-founder.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <span className="font-label-md text-label-md text-teal-accent font-semibold">Browse Talent</span>
              <span className="material-symbols-outlined text-[18px] text-teal-accent group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>

          <Link
            href="/discover/ventures"
            className="group p-space-xl rounded-2xl bg-surface-pure shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-on-primary">rocket_launch</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold group-hover:text-teal-accent transition-colors">Discover Ventures</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Explore active student ventures looking for co-founders with your specific skills.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <span className="font-label-md text-label-md text-teal-accent font-semibold">Browse Ventures</span>
              <span className="material-symbols-outlined text-[18px] text-teal-accent group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
