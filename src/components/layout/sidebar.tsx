'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { investorNavigation } from '@/config/navigation';
import { useSidebar } from '@/hooks/use-sidebar';

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggle, setMobileOpen } = useSidebar();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-[#3a3c4e] px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-baseline gap-1">
            <span
              className="text-lg font-bold text-[#CFD2E5]"
              style={{ fontFamily: 'Volkhov, serif' }}
            >
              NorthLend
            </span>
            <span className="text-sm font-medium text-[#C6AB4E]">Financial</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <span
              className="text-xl font-bold text-[#C6AB4E]"
              style={{ fontFamily: 'Volkhov, serif' }}
            >
              NL
            </span>
          </Link>
        )}

        {/* Desktop toggle */}
        <button
          onClick={toggle}
          className="hidden rounded-lg p-1.5 text-[#8b8fa3] transition-colors hover:bg-[#3a3c4e] hover:text-[#CFD2E5] lg:block"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-1.5 text-[#8b8fa3] transition-colors hover:bg-[#3a3c4e] hover:text-[#CFD2E5] lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {investorNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'border-l-2 border-[#C6AB4E] bg-[#C6AB4E]/10 text-[#C6AB4E]'
                      : 'border-l-2 border-transparent text-[#8b8fa3] hover:bg-[#3a3c4e]/50 hover:text-[#CFD2E5]'
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.badge && item.badge > 0 && (
                    <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C6AB4E] px-1.5 text-[11px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      {!collapsed && (
        <div className="border-t border-[#3a3c4e] px-4 py-3">
          <p className="text-xs text-[#8b8fa3]/60">
            &copy; {new Date().getFullYear()} NorthLend Financial
          </p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#2E3040] transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 bg-[#2E3040] border-r border-[#3a3c4e] transition-all duration-300 ${
          collapsed ? 'lg:w-16' : 'lg:w-64'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
