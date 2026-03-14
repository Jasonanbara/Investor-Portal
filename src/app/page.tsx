'use client';

import Link from 'next/link';
import { Building2, LogIn, UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#282A35] px-4">
      {/* Background subtle pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #C6AB4E 1px, transparent 1px), radial-gradient(circle at 75% 75%, #C6AB4E 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center animate-[fadeIn_0.6s_ease-out]">
        {/* Logo / Branding */}
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C6AB4E]/15">
          <Building2 className="h-8 w-8 text-[#C6AB4E]" />
        </div>

        <h1
          className="mt-4 text-4xl font-bold tracking-tight text-[#CFD2E5] sm:text-5xl"
          style={{ fontFamily: 'Volkhov, serif' }}
        >
          NorthLend Financial
        </h1>

        <p className="mt-2 text-lg text-[#8b8fa3]">
          Investor Portal
        </p>

        <div className="mt-3 h-px w-24 bg-gradient-to-r from-transparent via-[#C6AB4E] to-transparent" />

        <p className="mt-6 max-w-md text-sm leading-relaxed text-[#8b8fa3]">
          Access your private mortgage investment portfolio, explore new opportunities,
          and manage your account securely.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C6AB4E] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#b89b3e] hover:shadow-lg hover:shadow-[#C6AB4E]/20"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C6AB4E]/40 px-8 py-3 text-sm font-semibold text-[#C6AB4E] transition-all hover:border-[#C6AB4E] hover:bg-[#C6AB4E]/10"
          >
            <UserPlus className="h-4 w-4" />
            Register
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center text-xs text-[#8b8fa3]/60">
        &copy; {new Date().getFullYear()} NorthLend Financial Inc. All rights reserved.
      </footer>
    </div>
  );
}
