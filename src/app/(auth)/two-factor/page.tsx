"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, AlertCircle, KeyRound } from "lucide-react";

export default function TwoFactorPage() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showBackupInput, setShowBackupInput] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    const fullCode = code.join("");
    if (fullCode.length === 6 && code.every((d) => d !== "")) {
      handleVerify(fullCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleVerify = (verificationCode: string) => {
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/two-factor/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: verificationCode }),
        });

        if (response.ok) {
          router.push("/dashboard");
          router.refresh();
        } else {
          const data = await response.json();
          setError(data.error || "Invalid verification code");
          setCode(Array(6).fill(""));
          inputRefs.current[0]?.focus();
        }
      } catch {
        setError("An unexpected error occurred");
        setCode(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    });
  };

  const handleBackupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupCode.trim()) return;

    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/two-factor/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ backupCode: backupCode.trim() }),
        });

        if (response.ok) {
          router.push("/dashboard");
          router.refresh();
        } else {
          const data = await response.json();
          setError(data.error || "Invalid backup code");
        }
      } catch {
        setError("An unexpected error occurred");
      }
    });
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (value !== "" && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus to next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 0) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // Focus the next empty input or the last one
    const nextEmpty = newCode.findIndex((d) => d === "");
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  if (showBackupInput) {
    return (
      <div>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#C6AB4E]/10">
            <KeyRound className="h-7 w-7 text-[#C6AB4E]" />
          </div>
          <h2 className="text-xl font-semibold text-[#CFD2E5]">
            Backup Code
          </h2>
          <p className="mt-1 text-sm text-[#CFD2E5]/60">
            Enter one of your backup recovery codes
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleBackupSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value)}
              placeholder="XXXX-XXXX"
              className="w-full rounded-lg border border-[#CFD2E5]/10 bg-[#1a1b23] py-3 text-center font-mono text-lg tracking-wider text-[#CFD2E5] placeholder-[#CFD2E5]/30 transition focus:border-[#C6AB4E]/50 focus:outline-none focus:ring-1 focus:ring-[#C6AB4E]/50"
            />
          </div>

          <button
            type="submit"
            disabled={isPending || !backupCode.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C6AB4E] py-2.5 text-sm font-semibold text-[#1a1b23] transition hover:bg-[#C6AB4E]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Backup Code"
            )}
          </button>
        </form>

        <p className="mt-4 text-center">
          <button
            onClick={() => {
              setShowBackupInput(false);
              setError("");
            }}
            className="text-sm text-[#C6AB4E] transition hover:text-[#C6AB4E]/80"
          >
            Use authenticator app instead
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#C6AB4E]/10">
          <Shield className="h-7 w-7 text-[#C6AB4E]" />
        </div>
        <h2 className="text-xl font-semibold text-[#CFD2E5]">
          Two-Factor Authentication
        </h2>
        <p className="mt-1 text-sm text-[#CFD2E5]/60">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 6-digit code input */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isPending}
            className="h-14 w-11 rounded-lg border border-[#CFD2E5]/10 bg-[#1a1b23] text-center text-xl font-semibold text-[#CFD2E5] transition focus:border-[#C6AB4E]/50 focus:outline-none focus:ring-1 focus:ring-[#C6AB4E]/50 disabled:opacity-50"
          />
        ))}
      </div>

      {isPending && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#CFD2E5]/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          Verifying...
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setShowBackupInput(true);
            setError("");
          }}
          className="text-sm text-[#C6AB4E] transition hover:text-[#C6AB4E]/80"
        >
          Use a backup code instead
        </button>
      </div>
    </div>
  );
}
