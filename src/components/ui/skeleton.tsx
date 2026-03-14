import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Make the skeleton a circle (equal w/h). */
  circle?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ circle = false, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={[
        'animate-pulse bg-[#3a3c4e]',
        circle ? 'rounded-full' : 'rounded-lg',
        className,
      ].join(' ')}
      {...props}
    />
  )
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export type { SkeletonProps };
