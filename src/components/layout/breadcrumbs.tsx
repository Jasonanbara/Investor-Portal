'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = decodeURIComponent(segment)
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(capitalize)
      .join(' ');
    const isLast = index === segments.length - 1;

    return { href, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1.5 px-4 py-2 text-xs sm:px-6">
      <Link
        href="/dashboard"
        className="flex items-center text-[#8b8fa3] transition-colors hover:text-[#C6AB4E]"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-[#8b8fa3]/50" />
          {crumb.isLast ? (
            <span className="text-[#CFD2E5]">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-[#8b8fa3] transition-colors hover:text-[#C6AB4E]"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
