import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface-pure/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(11,29,58,0.04)] flex items-center justify-between px-gutter">
      <Link href="/" className="flex items-center gap-space-sm">
        <div className="w-8 h-8 rounded-lg bg-navy-deep flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[18px]">rocket_launch</span>
        </div>
        <span className="font-title-md text-title-md text-navy-deep font-bold">VentureMatch</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/help" className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">Help</Link>
        <Link href="/sign-in" className="font-label-md text-label-md text-on-surface-variant hover:text-navy-deep transition-colors">Sign In</Link>
        <Link
          href="/sign-up"
          className="inline-flex items-center justify-center h-9 px-4 bg-navy-deep text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:bg-on-primary-fixed transition-all"
        >
          Get Started
        </Link>
      </nav>
      <div className="md:hidden flex items-center gap-2">
        <Link href="/sign-in" className="font-label-md text-label-md text-navy-deep">Sign In</Link>
      </div>
    </header>
  );
}
