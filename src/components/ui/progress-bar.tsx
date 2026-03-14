import React from 'react';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, label, showPercentage = true, className = '', ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));

    return (
      <div ref={ref} className={['flex flex-col gap-1.5', className].join(' ')} {...props}>
        {(label || showPercentage) && (
          <div className="flex items-center justify-between text-sm">
            {label && <span className="font-medium text-[#CFD2E5]">{label}</span>}
            {showPercentage && (
              <span className="text-[#8b8fa3]">{Math.round(clamped)}%</span>
            )}
          </div>
        )}
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-[#3a3c4e]"
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C6AB4E] to-[#d4bc6a] transition-all duration-500 ease-out"
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
export type { ProgressBarProps };
