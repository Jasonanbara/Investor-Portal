import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NorthLend Financial - Investor Portal",
  description: "Secure access to the NorthLend Financial Investor Portal",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1b23] px-4 py-12">
      {/* Branding */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-[#C6AB4E]">NorthLend</span>
          <span className="ml-2 font-light text-[#CFD2E5]">Financial</span>
        </h1>
        <p className="mt-2 text-sm text-[#CFD2E5]/60">
          Investor Portal
        </p>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md rounded-xl border border-[#C6AB4E]/10 bg-[#282A35] p-8 shadow-2xl shadow-black/20">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-[#CFD2E5]/40">
        &copy; {new Date().getFullYear()} NorthLend Financial. All rights
        reserved.
      </p>
    </div>
  );
}
