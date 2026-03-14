'use client';

import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';

interface OnboardingStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  nextLabel?: string;
  nextDisabled?: boolean;
  showSkip?: boolean;
}

export function OnboardingStep({
  title,
  description,
  children,
  onNext,
  onBack,
  onSkip,
  isFirst = false,
  isLast = false,
  nextLabel,
  nextDisabled = false,
  showSkip = false,
}: OnboardingStepProps) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Step Header */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-[#CFD2E5] sm:text-2xl"
          style={{ fontFamily: 'Volkhov, serif' }}
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-[#8b8fa3]">{description}</p>
      </div>

      {/* Step Content */}
      <div className="mb-8 rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {!isFirst && onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-lg border border-[#3a3c4e] bg-[#2E3040] px-4 py-2.5 text-sm text-[#CFD2E5] transition-colors hover:bg-[#353748]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showSkip && onSkip && (
            <button
              onClick={onSkip}
              className="flex items-center gap-2 text-sm text-[#8b8fa3] transition-colors hover:text-[#CFD2E5]"
            >
              <SkipForward className="h-4 w-4" />
              I&apos;ll do this later
            </button>
          )}

          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="flex items-center gap-2 rounded-lg bg-[#C6AB4E] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#b89b3e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nextLabel || (isLast ? 'Complete Onboarding' : 'Next')}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
