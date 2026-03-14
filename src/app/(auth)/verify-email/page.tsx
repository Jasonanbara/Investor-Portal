"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";

type VerifyState = "loading" | "success" | "error" | "no-token";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>(
    token ? "loading" : "no-token"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setState("success");
          setMessage(data.message || "Your email has been verified successfully.");
        } else {
          setState("error");
          setMessage(data.error || "Verification failed. The link may have expired.");
        }
      } catch {
        setState("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="text-center">
      {state === "loading" && (
        <div className="space-y-4">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#C6AB4E]" />
          <h2 className="text-xl font-semibold text-[#CFD2E5]">
            Verifying Your Email
          </h2>
          <p className="text-sm text-[#CFD2E5]/60">
            Please wait while we verify your email address...
          </p>
        </div>
      )}

      {state === "success" && (
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-semibold text-[#CFD2E5]">
            Email Verified
          </h2>
          <p className="text-sm text-[#CFD2E5]/60">{message}</p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#C6AB4E] px-6 py-2.5 text-sm font-semibold text-[#1a1b23] transition hover:bg-[#C6AB4E]/90"
          >
            Continue to Sign In
          </Link>
        </div>
      )}

      {state === "error" && (
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-[#CFD2E5]">
            Verification Failed
          </h2>
          <p className="text-sm text-[#CFD2E5]/60">{message}</p>
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-[#C6AB4E] px-6 py-2.5 text-sm font-semibold text-[#1a1b23] transition hover:bg-[#C6AB4E]/90"
            >
              Go to Sign In
            </Link>
            <button className="text-sm text-[#C6AB4E] transition hover:text-[#C6AB4E]/80">
              Resend verification email
            </button>
          </div>
        </div>
      )}

      {state === "no-token" && (
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C6AB4E]/10">
            <Mail className="h-8 w-8 text-[#C6AB4E]" />
          </div>
          <h2 className="text-xl font-semibold text-[#CFD2E5]">
            Check Your Email
          </h2>
          <p className="text-sm text-[#CFD2E5]/60">
            We&apos;ve sent a verification link to your email address. Click the
            link to verify your account.
          </p>
          <p className="text-xs text-[#CFD2E5]/40">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button className="text-[#C6AB4E] hover:text-[#C6AB4E]/80">
              request a new link
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#C6AB4E]" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
