'use client';

import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export function StepIndicator({
  steps,
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#3a3c4e]">
        <div
          className="h-full rounded-full bg-[#C6AB4E] transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Step Circles */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = step.number === currentStep;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <div key={step.number} className="flex flex-col items-center gap-2">
              {/* Circle with connector lines */}
              <div className="relative flex items-center">
                {/* Connector line before (except first) */}
                {index > 0 && (
                  <div
                    className={`absolute right-full h-0.5 w-8 sm:w-12 md:w-16 lg:w-24 ${
                      isCompleted || isCurrent ? 'bg-[#C6AB4E]' : 'bg-[#3a3c4e]'
                    }`}
                  />
                )}

                {/* Circle */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${
                    isCompleted
                      ? 'border-[#C6AB4E] bg-[#C6AB4E] text-white'
                      : isCurrent
                        ? 'border-[#C6AB4E] bg-[#C6AB4E]/10 text-[#C6AB4E]'
                        : 'border-[#3a3c4e] bg-[#282A35] text-[#8b8fa3]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
              </div>

              {/* Label */}
              <span
                className={`text-center text-xs sm:text-sm ${
                  isCurrent
                    ? 'font-medium text-[#C6AB4E]'
                    : isFuture
                      ? 'text-[#8b8fa3]'
                      : 'text-[#CFD2E5]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
