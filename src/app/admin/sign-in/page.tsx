import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Admin Sign In" };
export default function AdminSignInPage() {
  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-surface-pure rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-navy-deep flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-primary text-[28px]">admin_panel_settings</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-navy-deep font-bold">Admin Access</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Sign in with your admin credentials.</p>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mb-4">
          Use the main sign-in page with an admin account.
        </p>
        <Link href="/sign-in" className="block w-full h-11 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">login</span>
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}
