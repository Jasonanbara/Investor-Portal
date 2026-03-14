'use client';

import React, { useState } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = '', name = '', size = 'md', className = '', ...props }, ref) => {
    const [imgError, setImgError] = useState(false);
    const showImage = src && !imgError;
    const initials = name ? getInitials(name) : '?';

    return (
      <div
        ref={ref}
        className={[
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3a3c4e] font-medium text-[#C6AB4E]',
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-label={name || 'avatar'}>{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
export type { AvatarProps, AvatarSize };
