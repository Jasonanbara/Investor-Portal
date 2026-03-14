'use client';

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCharCount?: boolean;
  wrapperClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      showCharCount = false,
      maxLength,
      value,
      defaultValue,
      wrapperClassName = '',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const charCount = typeof value === 'string' ? value.length : typeof defaultValue === 'string' ? defaultValue.length : 0;

    return (
      <div className={['flex flex-col gap-1.5', wrapperClassName].join(' ')}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-[#CFD2E5]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error && textareaId ? `${textareaId}-error` : undefined}
          className={[
            'flex min-h-[80px] w-full rounded-lg border bg-[#282A35] px-3 py-2 text-sm text-[#CFD2E5] placeholder:text-[#8b8fa3]',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#282A35]',
            'disabled:cursor-not-allowed disabled:opacity-50 resize-y',
            error
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-[#3a3c4e] focus-visible:ring-[#C6AB4E]',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        <div className="flex items-center justify-between">
          {error && (
            <p
              id={textareaId ? `${textareaId}-error` : undefined}
              className="text-xs text-red-400"
              role="alert"
            >
              {error}
            </p>
          )}
          {showCharCount && (
            <span className="ml-auto text-xs text-[#8b8fa3]">
              {charCount}
              {maxLength ? ` / ${maxLength}` : ''}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
