"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(errorParam || "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: email.toLowerCase(),
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
          return;
        }

        router.push(callbackUrl);
        router.refresh();
      } catch {
        setError("An unexpected error occurred");
      }
    });
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-[#CFD2E5]">Welcome Back</h2>
        <p className="mt-1 text-sm text-[#CFD2E5]/60">
          Sign in to your investor account
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
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

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-[#CFD2E5]/80"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CFD2E5]/40" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-[#CFD2E5]/10 bg-[#1a1b23] py-2.5 pl-10 pr-10 text-sm text-[#CFD2E5] placeholder-[#CFD2E5]/30 transition focus:border-[#C6AB4E]/50 focus:outline-none focus:ring-1 focus:ring-[#C6AB4E]/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CFD2E5]/40 transition hover:text-[#CFD2E5]/70"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[#CFD2E5]/20 bg-[#1a1b23] text-[#C6AB4E] focus:ring-[#C6AB4E]/50"
            />
            <span className="text-sm text-[#CFD2E5]/60">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-[#C6AB4E] transition hover:text-[#C6AB4E]/80"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C6AB4E] py-2.5 text-sm font-semibold text-[#1a1b23] transition hover:bg-[#C6AB4E]/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Register Link */}
      <p className="mt-6 text-center text-sm text-[#CFD2E5]/60">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-[#C6AB4E] transition hover:text-[#C6AB4E]/80"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#C6AB4E]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
