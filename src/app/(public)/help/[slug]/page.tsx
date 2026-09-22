import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Help — ${slug.replaceAll("-", " ")}` };
}

export default async function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replaceAll("-", " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="bg-surface-subtle min-h-screen pt-16">
      <main className="w-full px-gutter py-space-lg">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-space-lg font-label-sm text-label-sm text-on-surface-variant">
            <Link href="/help" className="hover:text-navy-deep transition-colors">Help Centre</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-navy-deep font-semibold">{title}</span>
          </nav>

          {/* Article */}
          <article className="bg-surface-pure rounded-2xl shadow-sm p-space-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">Guide</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-navy-deep font-bold mb-space-md">{title}</h1>
            <div className="flex items-center gap-space-md mb-space-xl pb-space-lg border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">update</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Updated recently</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">2 min read</span>
              </div>
            </div>

            <div className="space-y-space-lg font-body-lg text-body-lg text-on-surface leading-relaxed">
              <p>This article covers everything you need to know about <strong className="font-semibold text-navy-deep">{title}</strong> on VentureMatch.</p>
              <p className="text-on-surface-variant">Full article content will be displayed here based on the knowledge base configuration. VentureMatch articles cover topics including Talent DNA profiling, Match Score calculation, Founder Trials, venture creation, messaging, and platform governance.</p>

              <div className="p-space-lg rounded-xl bg-surface-subtle border border-secondary-container/40">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-teal-accent flex-shrink-0 mt-0.5">info</span>
                  <div>
                    <h4 className="font-title-md text-title-md text-navy-deep font-semibold mb-1">Quick Tip</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      If you need further help on this topic, contact our support team directly from the{" "}
                      <Link href="/support" className="text-teal-accent hover:underline font-medium">Support page</Link>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related articles */}
          <div className="mt-space-xl">
            <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold mb-space-md">Related Articles</h2>
            <div className="space-y-3">
              {["How is my Match Score calculated?", "What is a Founder Trial?", "How do I increase profile strength?"].map(title => (
                <Link
                  key={title}
                  href={`/help/${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`}
                  className="flex items-center gap-4 bg-surface-pure rounded-xl p-space-md shadow-sm hover:shadow-md transition-all group"
                >
                  <span className="material-symbols-outlined text-[18px] text-teal-accent">article</span>
                  <span className="font-label-md text-label-md text-navy-deep group-hover:text-teal-accent transition-colors">{title}</span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant ml-auto">arrow_forward_ios</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
