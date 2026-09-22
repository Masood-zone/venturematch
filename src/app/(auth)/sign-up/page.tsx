"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "@/components/shared/AuthShell";

function calcStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length > 0) score++;
  if (pw.length >= 8) score++;
  if (/\d/.test(pw)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]|[A-Z]/.test(pw)) score++;
  const map = [
    { label: "Minimum 8 characters", color: "text-outline" },
    { label: "Weak", color: "text-error" },
    { label: "Fair", color: "text-amber-warm" },
    { label: "Good", color: "text-teal-accent" },
    { label: "Strong", color: "text-teal-accent" },
  ];
  return { score, ...map[score] };
}

const barColors = ["bg-error", "bg-error", "bg-amber-warm", "bg-teal-accent", "bg-teal-accent"];

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = calcStrength(password);
  const passwordsMatch = confirm.length > 0 && confirm === password;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (!agreed) { setError("Please accept the terms of service"); return; }
    setLoading(true);
    try {
      const result = await authClient.signUp.email({ name, email, password });
      if (result.error) {
        setError(result.error.message ?? "Failed to create account");
      } else {
        router.push("/onboarding/academic");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="flex flex-col w-full max-w-5xl mx-auto items-center justify-center py-space-md">
        {/* Progress breadcrumb */}
        <div className="flex items-center gap-space-sm mb-space-lg">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-accent text-on-primary font-label-sm text-label-sm font-bold shadow-sm">1</span>
          <span className="font-label-sm text-label-sm text-navy-deep font-semibold tracking-wide">Account Creation</span>
          <span className="w-8 h-0.5 bg-outline-variant/60 rounded-full" />
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-container-high text-outline font-label-sm text-label-sm font-medium">2</span>
          <span className="font-label-sm text-label-sm text-outline font-medium">Capability Setup</span>
        </div>

        {/* Header */}
        <div className="w-full text-center max-w-2xl px-space-md mb-space-xl">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container mb-space-sm shadow-sm">
            <span className="material-symbols-outlined text-teal-accent text-[14px]">hub</span>
            <span className="font-label-sm text-label-sm text-navy-deep uppercase tracking-wider">Student Founder Network</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep font-bold tracking-tight mb-space-xs">
            Create Your VentureMatch Account
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant font-normal leading-relaxed">
            &ldquo;Your programme shows where you study. Your capabilities show where you can contribute.&rdquo;
          </p>
        </div>

        {/* Split layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left: context */}
          <div className="lg:col-span-5 flex flex-col gap-space-md order-2 lg:order-1">
            {/* Spotlight card */}
            <div className="bg-surface-pure rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden">
              <div className="flex items-center gap-space-md">
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-[28px]">group</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-title-md text-title-md text-navy-deep font-bold truncate">Kwame &amp; Sarah</span>
                    <span className="material-symbols-outlined text-teal-accent text-[14px]">verified</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Computer Science + Business Admin</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                Matched through cross-faculty ventures to engineer autonomous solar microgrids across campus dormitories.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-space-xs">
                <span className="px-2.5 py-1 rounded-full bg-surface-subtle text-navy-deep font-label-sm text-label-sm">#EmbeddedSystems</span>
                <span className="px-2.5 py-1 rounded-full bg-surface-subtle text-navy-deep font-label-sm text-label-sm">#FinancialModeling</span>
                <span className="px-2.5 py-1 rounded-full bg-teal-accent/10 text-teal-accent font-label-sm text-label-sm font-semibold">Matched 98%</span>
              </div>
              <div className="pt-space-xs flex items-center justify-between text-on-surface-variant bg-surface-subtle rounded-lg p-space-sm">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline uppercase font-semibold tracking-wider">Active Teams</span>
                  <span className="font-title-md text-title-md text-navy-deep font-bold">142 Cross-Faculty</span>
                </div>
                <svg className="w-28 h-8 text-teal-accent overflow-visible" fill="none" viewBox="0 0 112 32">
                  <path d="M0 24 L20 22 L40 15 L60 18 L80 8 L100 4 L112 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  <circle cx="112" cy="2" r="3.5" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Value pillars */}
            {[
              { icon: "diversity_3", title: "Multidisciplinary Talent Network", desc: "Pair engineering mastery with design instincts and commercial strategy seamlessly." },
              { icon: "school", title: "Verified USTED Community", desc: "Exclusively tailored for registered students, faculty labs, and campus enterprise fellows." },
              { icon: "lock_open", title: "Zero Department Lock-in", desc: "Break free of departmental silos. Build projects on merit, passions, and functional capability." },
            ].map(p => (
              <div key={p.icon} className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low shadow-sm">
                <div className="p-1.5 bg-surface-pure rounded-md text-teal-accent flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{p.icon}</span>
                </div>
                <div>
                  <h4 className="font-title-md text-title-md text-navy-deep font-semibold">{p.title}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7 bg-surface-pure rounded-xl p-space-lg lg:p-space-xl shadow-md order-1 lg:order-2 flex flex-col">
            {/* Form header */}
            <div className="flex items-center justify-between pb-space-xs mb-space-md">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-navy-deep font-bold">Step 1: Identity &amp; Access</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Use your institutional address to enable instant auto-verification.</p>
              </div>
              <span className="material-symbols-outlined text-teal-accent text-[28px]">badge</span>
            </div>

            {error && (
              <div className="mb-space-md p-3 rounded-lg bg-error-container flex items-center gap-2">
                <span className="material-symbols-outlined text-on-error-container text-[18px]">error</span>
                <p className="font-body-md text-body-md text-on-error-container">{error}</p>
              </div>
            )}

            <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
              {/* Full name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="name">Full Name</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">person</span>
                  <input
                    id="name" type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-subtle text-navy-deep font-body-md text-body-md placeholder:text-outline/70 focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-navy-deep font-semibold flex items-center justify-between" htmlFor="signup-email">
                  <span>Student Email Address</span>
                  <span className="text-teal-accent text-label-sm font-medium">USTED Institutional ID</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">mail</span>
                  <input
                    id="signup-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="e.g., student@st.usted.edu.gh"
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-subtle text-navy-deep font-body-md text-body-md placeholder:text-outline/70 focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent transition-all"
                  />
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-outline">info</span> Must end with institutional domain (@*.usted.edu.gh)
                </span>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="pw">Password</label>
                  <span className={`font-label-sm text-label-sm font-medium ${strength.color}`}>{strength.label}</span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">key</span>
                  <input
                    id="pw" type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong passphrase"
                    className="w-full h-11 pl-10 pr-11 rounded-lg bg-surface-subtle text-navy-deep font-body-md text-body-md placeholder:text-outline/70 focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent transition-all"
                  />
                  <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPw(p => !p)} className="absolute right-3 text-outline hover:text-navy-deep focus:outline-none">
                    <span className="material-symbols-outlined text-[20px]">{showPw ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {/* Strength bars */}
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${strength.score >= i ? barColors[strength.score] : "bg-surface-container-high"}`} />
                  ))}
                </div>
                {/* Requirements */}
                <div className="flex flex-wrap items-center gap-2 pt-1 font-label-sm text-label-sm">
                  {[
                    { label: "8+ chars", met: password.length >= 8 },
                    { label: "1+ number", met: /\d/.test(password) },
                    { label: "1+ symbol or uppercase", met: /[!@#$%^&*()]|[A-Z]/.test(password) },
                  ].map(r => (
                    <span key={r.label} className={`flex items-center gap-1 ${r.met ? "text-teal-accent font-medium" : "text-outline"}`}>
                      <span className="material-symbols-outlined text-[14px]">{r.met ? "check_circle" : "circle"}</span>
                      {r.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-navy-deep font-semibold" htmlFor="confirm-pw">Confirm Password</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">lock</span>
                  <input
                    id="confirm-pw" type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full h-11 pl-10 pr-11 rounded-lg bg-surface-subtle text-navy-deep font-body-md text-body-md placeholder:text-outline/70 focus:outline-none focus:bg-surface-pure focus:ring-2 focus:ring-teal-accent transition-all"
                  />
                  {passwordsMatch && (
                    <span className="absolute right-3 material-symbols-outlined text-teal-accent text-[20px]">check_circle</span>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="pt-space-xs">
                <label className="flex items-start gap-space-sm cursor-pointer select-none">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded accent-teal-accent cursor-pointer" />
                  <span className="font-body-md text-body-md text-on-surface leading-normal">
                    I agree to the{" "}
                    <Link href="/legal/terms" className="text-teal-accent font-semibold hover:underline">Terms of Service</Link>
                    {" "}&amp;{" "}
                    <Link href="/legal/privacy" className="text-teal-accent font-semibold hover:underline">Privacy Policy</Link>
                    , including institutional credential validation.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="pt-space-xs">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[46px] rounded-lg bg-navy-deep text-on-primary font-title-md text-title-md font-semibold flex items-center justify-center gap-space-sm hover:opacity-95 shadow-md active:scale-[0.99] transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sign in link */}
              <div className="text-center pt-space-xs pb-1">
                <span className="font-body-md text-body-md text-on-surface-variant">Already have an account?</span>
                <Link href="/sign-in" className="font-title-md text-title-md text-teal-accent font-semibold ml-1 hover:underline inline-flex items-center gap-0.5">
                  Sign In
                  <span className="material-symbols-outlined text-[14px]">login</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
