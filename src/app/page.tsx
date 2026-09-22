import Link from "next/link";
import { PublicHeader } from "@/components/shared/PublicHeader";

export default function LandingPage() {
  const capabilities = [
    { icon: "checkroom", label: "Fashion & Textiles", sub: "Circular Materials", tag: "Fashion Tech", campus: "USTED Tanoso", color: "text-teal-accent" },
    { icon: "finance", label: "Business Strategy", sub: "Financial Modeling", tag: "Unit Economics", campus: "USTED Kumasi", color: "text-navy-deep" },
    { icon: "terminal", label: "Software Arch.", sub: "Cloud & Mobile", tag: "Next.js / API", campus: "Computer Sci", color: "text-teal-accent" },
    { icon: "brush", label: "Product Design", sub: "UX Research", tag: "Figma / Design", campus: "Art & Design", color: "text-amber-warm" },
    { icon: "science", label: "Life Sciences", sub: "Biotech Research", tag: "Lab Methods", campus: "USTED Bio", color: "text-teal-accent" },
    { icon: "solar_power", label: "Engineering", sub: "Systems Design", tag: "Embedded / IoT", campus: "Eng. Dept.", color: "text-navy-deep" },
  ];

  return (
    <div className="bg-surface-subtle text-on-surface antialiased selection:bg-teal-accent selection:text-on-primary">
      <PublicHeader />
      <main className="w-full pt-20 min-h-screen">
        <div className="flex flex-col w-full">
          {/* Ambient glows */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[840px] h-[380px] bg-gradient-to-b from-teal-accent/10 via-surface-container-high/40 to-transparent blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-48 -right-24 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-2xl pointer-events-none -z-10" />
            <div className="absolute top-96 -left-20 w-72 h-72 bg-amber-warm/10 rounded-full blur-2xl pointer-events-none -z-10" />

            {/* Hero */}
            <section className="max-w-[1200px] mx-auto px-gutter pt-8 pb-16 lg:pt-14 lg:pb-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                {/* Hero text */}
                <div className="lg:col-span-6 flex flex-col items-start text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-pure shadow-sm mb-6">
                    <span className="inline-block w-2 h-2 rounded-full bg-teal-accent animate-pulse" />
                    <span className="font-label-sm text-label-sm text-navy-deep tracking-wider uppercase">USTED Innovation Campus Network</span>
                    <span className="font-label-sm text-label-sm text-teal-accent font-semibold ml-1">Live Spring Match →</span>
                  </div>
                  <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-navy-deep tracking-tight font-bold mb-5">
                    Connect Skills.<br />
                    <span className="text-teal-accent underline decoration-secondary-container decoration-4 underline-offset-8">Build Ventures.</span>
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
                    Find students whose capabilities complement yours and build multidisciplinary ventures together. Break free from departmental silos and assemble your founding team today.
                  </p>
                  <div className="flex flex-wrap items-center gap-space-md w-full sm:w-auto">
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center justify-center bg-navy-deep hover:bg-primary text-on-primary font-label-md text-label-md rounded-xl px-7 py-3.5 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 gap-2"
                    >
                      <span>Find My Co-Founder</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                    <Link
                      href="/discover"
                      className="inline-flex items-center justify-center bg-surface-pure hover:bg-surface-container text-teal-accent font-label-md text-label-md rounded-xl px-7 py-3.5 shadow-sm hover:shadow-md transition-all gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">explore</span>
                      <span>Explore Ventures</span>
                    </Link>
                  </div>
                  {/* Social proof */}
                  <div className="flex items-center gap-6 mt-10 pt-6">
                    <div className="flex -space-x-2.5 overflow-hidden p-1">
                      {["AK", "FA", "MO"].map(init => (
                        <div key={init} className="inline-block h-9 w-9 rounded-full bg-surface-container ring-2 ring-surface-pure flex items-center justify-center font-label-sm text-navy-deep text-[12px] font-bold">{init}</div>
                      ))}
                      <div className="inline-block h-9 w-9 rounded-full bg-navy-deep text-on-primary ring-2 ring-surface-pure flex items-center justify-center font-label-sm text-[11px]">+48</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center text-amber-warm">
                        {[1,2,3,4].map(i => (
                          <span key={i} className="material-symbols-outlined text-[16px]" style={{fontVariationSettings:"'FILL' 1"}}>star</span>
                        ))}
                        <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings:"'FILL' 1"}}>star_half</span>
                        <span className="font-title-md text-navy-deep text-label-md ml-1.5 font-bold">94%</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Successful 7-day Founder Trial conversion</span>
                    </div>
                  </div>
                </div>

                {/* Hero visual */}
                <div className="lg:col-span-6 relative">
                  <div className="bg-surface-pure rounded-2xl p-6 shadow-xl relative z-10">
                    <div className="flex items-center justify-between pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-error/70" /><span className="w-3 h-3 rounded-full bg-amber-warm/80" /><span className="w-3 h-3 rounded-full bg-teal-accent" />
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium ml-2">USTED Cross-Discipline Engine</span>
                      </div>
                      <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-semibold">Active Synergies</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {capabilities.map(cap => (
                        <div key={cap.label} className="bg-surface-subtle p-3.5 rounded-xl flex flex-col justify-between hover:bg-surface-container transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`w-7 h-7 rounded-lg bg-surface-pure flex items-center justify-center shadow-sm ${cap.color}`}>
                              <span className="material-symbols-outlined text-[18px]">{cap.icon}</span>
                            </span>
                            <span className={`font-label-sm text-label-sm font-bold ${cap.color}`}>{cap.campus}</span>
                          </div>
                          <div>
                            <h4 className="font-title-md text-label-md text-navy-deep font-semibold leading-snug">{cap.label}</h4>
                            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{cap.sub}</p>
                          </div>
                          <div className="mt-2.5">
                            <span className="px-2 py-0.5 bg-surface-pure text-[11px] rounded-full text-navy-deep font-medium shadow-sm">{cap.tag}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Live match indicator */}
                    <div className="mt-4 p-3 rounded-xl bg-surface-subtle flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-accent animate-pulse" />
                        <span className="font-label-sm text-label-sm text-navy-deep font-semibold">Spring Match in Progress</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-teal-accent font-bold">142 Active Synergies</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* How It Works */}
          <section className="bg-surface-pure py-16 lg:py-24">
            <div className="max-w-[1200px] mx-auto px-gutter">
              <div className="text-center mb-12">
                <h2 className="font-headline-lg text-headline-lg text-navy-deep font-bold mb-3">How VentureMatch Works</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">From building your Talent DNA to founding a venture — in four steps.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
                {[
                  { step: "01", icon: "badge", title: "Build Talent DNA", desc: "Map your capabilities, interests, and working style into a rich profile." },
                  { step: "02", icon: "auto_awesome", title: "Get Matched", desc: "Our 7-factor algorithm finds complementary co-founders for your specific venture." },
                  { step: "03", icon: "handshake", title: "Connect & Collaborate", desc: "Send invitations, chat, and explore joint venture opportunities." },
                  { step: "04", icon: "rocket_launch", title: "Launch Your Venture", desc: "Complete a Founder Trial, sign a Team Charter, and start building together." },
                ].map(s => (
                  <div key={s.step} className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-surface-subtle hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-label-sm text-label-sm text-teal-accent font-bold">{s.step}</span>
                      <div className="w-10 h-10 rounded-xl bg-surface-pure flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[20px] text-navy-deep">{s.icon}</span>
                      </div>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold">{s.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-navy-deep py-16 lg:py-24">
            <div className="max-w-[1200px] mx-auto px-gutter text-center">
              <h2 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-on-primary font-bold mb-5">
                Ready to find your<br /><span className="text-teal-accent">co-founder?</span>
              </h2>
              <p className="font-body-lg text-body-lg text-on-primary/70 max-w-xl mx-auto mb-10">
                Join 500+ USTED students building the ventures of tomorrow.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center bg-teal-accent hover:bg-secondary text-on-primary font-label-md text-label-md rounded-xl px-8 py-4 shadow-lg transition-all gap-2 text-[15px]"
              >
                <span>Create Free Account</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-surface-pure border-t border-surface-container-high py-8 px-gutter">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-space-sm">
                <div className="w-7 h-7 rounded-lg bg-navy-deep flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[14px]">rocket_launch</span>
                </div>
                <span className="font-title-md text-title-md text-navy-deep font-bold">VentureMatch</span>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/help" className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep">Help</Link>
                <Link href="/legal/terms" className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep">Terms</Link>
                <Link href="/legal/privacy" className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep">Privacy</Link>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">© {new Date().getFullYear()} VentureMatch Initiative</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
