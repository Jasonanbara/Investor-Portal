'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error('DropdownMenu compound components must be used within <DropdownMenu>');
  return ctx;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};
DropdownMenu.displayName = 'DropdownMenu';

/* ------------------------------------------------------------------ */
/*  Trigger                                                            */
/* ------------------------------------------------------------------ */

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ className = '', onClick, ...props }, ref) => {
    const { open, setOpen, triggerRef } = useDropdown();

    const mergedRef = (node: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    };

    return (
      <button
        ref={mergedRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={(e) => {
          setOpen((v) => !v);
          onClick?.(e);
        }}
        className={className}
        {...props}
      />
    );
  }
);
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end';
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ align = 'end', className = '', children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = useDropdown();
    const contentRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = useCallback(
      (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      },
      [setOpen, triggerRef]
    );

    useEffect(() => {
      if (open) document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, handleClickOutside]);

    if (!open) return null;

    return (
      <div
        ref={(node) => {
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="menu"
        className={[
          'absolute z-50 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-[#3a3c4e] bg-[#2E3040] py-1 shadow-xl',
          'animate-[fadeIn_0.15s_ease-out]',
          align === 'end' ? 'right-0' : 'left-0',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

/* ------------------------------------------------------------------ */
/*  Item                                                               */
/* ------------------------------------------------------------------ */

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  destructive?: boolean;
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ icon, destructive = false, className = '', children, onClick, ...props }, ref) => {
    const { setOpen } = useDropdown();

    return (
      <button
        ref={ref}
        role="menuitem"
        type="button"
        onClick={(e) => {
          onClick?.(e);
          setOpen(false);
        }}
        className={[
          'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
          'focus-visible:outline-none focus-visible:bg-[#3a3c4e]',
          destructive
            ? 'text-red-400 hover:bg-red-500/10'
            : 'text-[#CFD2E5] hover:bg-[#3a3c4e]',
          className,
        ].join(' ')}
        {...props}
      >
        {icon && <span className="shrink-0 text-[#8b8fa3]">{icon}</span>}
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

/* ------------------------------------------------------------------ */
/*  Divider                                                            */
/* ------------------------------------------------------------------ */

const DropdownMenuDivider: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({
  className = '',
  ...props
}) => <hr className={['my-1 border-[#3a3c4e]', className].join(' ')} {...props} />;
DropdownMenuDivider.displayName = 'DropdownMenuDivider';

/* ------------------------------------------------------------------ */
/*  Label                                                              */
/* ------------------------------------------------------------------ */

const DropdownMenuLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => (
  <div
    className={['px-3 py-1.5 text-xs font-semibold text-[#8b8fa3]', className].join(' ')}
    {...props}
  />
);
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuDivider,
  DropdownMenuLabel,
};
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
};
