"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) score++;
  return score;
}

function getStrengthLabel(score: number): { label: string; color: string } {
  if (score === 0) return { label: "", color: "bg-transparent" };
  if (score <= 2) return { label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { label: "Fair", color: "bg-orange-500" };
  if (score <= 4) return { label: "Good", color: "bg-yellow-500" };
  return { label: "Strong", color: "bg-emerald-500" };
}

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const passwordScore = useMemo(() => getPasswordStrength(password), [password]);
  const strength = useMemo(() => getStrengthLabel(passwordScore), [passwordScore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordScore < 5) {
      setError(
        "Password must include 12+ characters, uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Registration failed");
          return;
        }

        router.push("/login?registered=true");
      } catch {
        setError("An unexpected error occurred");
      }
    });
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-[#CFD2E5]">
          Create Account
        </h2>
        <p className="mt-1 text-sm text-[#CFD2E5]/60">
          Join the NorthLend investor community
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="mb-1.5 block text-sm font-medium text-[#CFD2E5]/80"
            >
              First Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CFD2E5]/40" />
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                className="w-full rounded-lg border border-[#CFD2E5]/10 bg-[#1a1b23] py-2.5 pl-10 pr-4 text-sm text-[#CFD2E5] placeholder-[#CFD2E5]/30 transition focus:border-[#C6AB4E]/50 focus:outline-none focus:ring-1 focus:ring-[#C6AB4E]/50"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="mb-1.5 block text-sm font-medium text-[#CFD2E5]/80"
            >
              Last Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CFD2E5]/40" />
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
                className="w-full rounded-lg border border-[#CFD2E5]/10 bg-[#1a1b23] py-2.5 pl-10 pr-4 text-sm text-[#CFD2E5] placeholder-[#CFD2E5]/30 transition focus:border-[#C6AB4E]/50 focus:outline-none focus:ring-1 focus:ring-[#C6AB4E]/50"
              />
            </div>
          </div>
        </div>

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
              placeholder="Min. 12 characters"
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

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= passwordScore
                        ? strength.color
                        : "bg-[#CFD2E5]/10"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`mt-1 text-xs ${
                  passwordScore <= 2
                    ? "text-red-400"
                    : passwordScore <= 3
                      ? "text-orange-400"
                      : passwordScore <= 4
                        ? "text-yellow-400"
                        : "text-emerald-400"
                }`}
              >
                {strength.label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-[#CFD2E5]/80"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CFD2E5]/40" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full rounded-lg border border-[#CFD2E5]/10 bg-[#1a1b23] py-2.5 pl-10 pr-10 text-sm text-[#CFD2E5] placeholder-[#CFD2E5]/30 transition focus:border-[#C6AB4E]/50 focus:outline-none focus:ring-1 focus:ring-[#C6AB4E]/50"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CFD2E5]/40 transition hover:text-[#CFD2E5]/70"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <p className="mt-1 text-xs text-red-400">
              Passwords do not match
            </p>
          )}
          {confirmPassword.length > 0 && password === confirmPassword && (
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              Passwords match
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#CFD2E5]/20 bg-[#1a1b23] text-[#C6AB4E] focus:ring-[#C6AB4E]/50"
          />
          <label htmlFor="terms" className="text-sm text-[#CFD2E5]/60">
            I agree to the{" "}
            <span className="cursor-pointer text-[#C6AB4E] hover:text-[#C6AB4E]/80">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="cursor-pointer text-[#C6AB4E] hover:text-[#C6AB4E]/80">
              Privacy Policy
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !termsAccepted}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C6AB4E] py-2.5 text-sm font-semibold text-[#1a1b23] transition hover:bg-[#C6AB4E]/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-[#CFD2E5]/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#C6AB4E] transition hover:text-[#C6AB4E]/80"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
