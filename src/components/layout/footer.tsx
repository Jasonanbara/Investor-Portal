'use client';

export function Footer() {
  return (
    <footer className="border-t border-[#3a3c4e] bg-[#2E3040]/50 px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-xs text-[#8b8fa3]/60">
          &copy; {new Date().getFullYear()} NorthLend Financial Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-xs text-[#8b8fa3]/60 transition-colors hover:text-[#C6AB4E]">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-[#8b8fa3]/60 transition-colors hover:text-[#C6AB4E]">
            Terms of Service
          </a>
          <a href="#" className="text-xs text-[#8b8fa3]/60 transition-colors hover:text-[#C6AB4E]">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
