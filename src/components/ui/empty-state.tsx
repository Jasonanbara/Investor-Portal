import React from 'react';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={[
        'flex flex-col items-center justify-center py-16 text-center',
        className,
      ].join(' ')}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#3a3c4e] text-[#8b8fa3]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#CFD2E5]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-[#8b8fa3]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
);

EmptyState.displayName = 'EmptyState';

export { EmptyState };
export type { EmptyStateProps };
