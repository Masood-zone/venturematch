"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "@/components/shared/AuthShell";

import { MaterialSymbol } from "@/components/ui/material-symbol";
export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password, rememberMe: remember });
      if (result.error) {
        setError(result.error.message ?? "Invalid credentials");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="flex flex-col w-full items-center justify-center py-space-md">
        <div className="relative w-full max-w-lg flex flex-col items-center">
          {/* Ambient glows */}
          <div className="absolute -top-12 -left-10 w-64 h-64 bg-teal-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-8 w-60 h-60 bg-primary-fixed-dim/20 rounded-full blur-3xl pointer-events-none" />

          {/* Card */}
          <div className="relative w-full bg-surface-pure rounded-xl shadow-md p-space-lg md:p-space-xl flex flex-col">
            {/* Header */}
            <div className="text-center mb-space-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface-subtle text-navy-deep mb-space-sm shadow-sm">
                <MaterialSymbol icon="rocket_launch" className="text-teal-accent text-2xl" />
              </div>
              <h1 className="font-headline-md text-headline-md text-navy-deep tracking-tight">
                Welcome Back to VentureMatch
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs max-w-sm mx-auto">
                Sign in to access your venture matches, collaborations, and founder trials.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-space-md p-3 rounded-lg bg-error-container flex items-center gap-2">
                <MaterialSymbol icon="error" className="text-on-error-container text-[18px]" />
                <p className="font-body-md text-body-md text-on-error-container">{error}</p>
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-navy-deep" htmlFor="email">
                  Institutional or Account Email
                </label>
                <div className="relative flex items-center">
                  <MaterialSymbol icon="mail" className="absolute left-3.5 text-outline text-[20px] pointer-events-none select-none" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@st.usted.edu.gh or registered email"
                    className="w-full h-11 pl-10 pr-3.5 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-navy-deep" htmlFor="password">
                  Password
                </label>
                <div className="relative flex items-center">
                  <MaterialSymbol icon="lock" className="absolute left-3.5 text-outline text-[20px] pointer-events-none select-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your security phrase or password"
                    className="w-full h-11 pl-10 pr-11 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-2.5 p-1.5 rounded-lg text-outline hover:text-navy-deep hover:bg-surface-subtle transition-colors flex items-center justify-center"
                  >
                    <MaterialSymbol icon={showPassword ? "visibility_off" : "visibility"} className="text-[20px]" />
                  </button>
                </div>
              </div>

              {/* Options row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-teal-accent cursor-pointer"
                  />
                  <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-navy-deep transition-colors">
                    Remember me
                  </span>
                </label>
                <Link href="/forgot-password" className="font-label-md text-label-md text-teal-accent hover:text-secondary transition-colors font-medium">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[46px] mt-1 bg-navy-deep hover:bg-on-primary-fixed text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 font-semibold disabled:opacity-60"
              >
                {loading ? (
                  <MaterialSymbol icon="progress_activity" className="text-[18px] animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <MaterialSymbol icon="arrow_forward" className="text-[18px]" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-space-lg flex items-center justify-center">
              <div className="w-full h-px bg-surface-container-high" />
              <span className="absolute bg-surface-pure px-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                or continue with university single sign-on
              </span>
            </div>

            {/* SSO */}
            <button
              type="button"
              className="w-full h-11 bg-surface-subtle hover:bg-surface-container text-navy-deep font-label-md text-label-md rounded-lg shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
            >
              <MaterialSymbol icon="account_balance" className="text-teal-accent text-[20px]" />
              <span className="font-medium">Sign in with USTED Student Portal</span>
            </button>

            {/* Register link */}
            <p className="text-center font-body-md text-body-md text-on-surface-variant mt-space-lg">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-title-md text-title-md text-teal-accent hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
