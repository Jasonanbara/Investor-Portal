"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setSuccess(true);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to send reset link");
        }
      } catch {
        setError("An unexpected error occurred");
      }
    });
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-semibold text-[#CFD2E5]">
          Check Your Email
        </h2>
        <p className="mt-2 text-sm text-[#CFD2E5]/60">
          If an account exists for <strong className="text-[#CFD2E5]">{email}</strong>,
          you will receive a password reset link shortly.
        </p>
        <p className="mt-4 text-xs text-[#CFD2E5]/40">
          Didn&apos;t receive the email? Check your spam folder or try again in a
          few minutes.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm text-[#C6AB4E] transition hover:text-[#C6AB4E]/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-[#CFD2E5]">
          Reset Password
        </h2>
        <p className="mt-1 text-sm text-[#CFD2E5]/60">
          Enter your email address and we&apos;ll send you a reset link
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[#CFD2E5]/80"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CFD2E5]/40" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#CFD2E5]/10 bg-[#1a1b23] py-2.5 pl-10 pr-4 text-sm text-[#CFD2E5] placeholder-[#CFD2E5]/30 transition focus:border-[#C6AB4E]/50 focus:outline-none focus:ring-1 focus:ring-[#C6AB4E]/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C6AB4E] py-2.5 text-sm font-semibold text-[#1a1b23] transition hover:bg-[#C6AB4E]/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-[#C6AB4E] transition hover:text-[#C6AB4E]/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
