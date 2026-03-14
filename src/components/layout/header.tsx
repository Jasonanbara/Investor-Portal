'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useSidebar } from '@/hooks/use-sidebar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { NotificationBell } from '@/components/layout/notification-bell';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/deals': 'My Deals',
  '/opportunities': 'Opportunities',
  '/reports': 'Reports',
  '/documents': 'Documents',
  '/messages': 'Messages',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
  '/onboarding': 'Onboarding',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(path)) return title;
  }
  return 'Dashboard';
}

export function Header() {
  const pathname = usePathname();
  const { setMobileOpen, collapsed } = useSidebar();
  const { user } = useCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#3a3c4e] bg-[#282A35]/80 px-4 backdrop-blur-md sm:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-[#8b8fa3] transition-colors hover:bg-[#3a3c4e] hover:text-[#CFD2E5] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1
          className="text-lg font-semibold text-[#CFD2E5]"
          style={{ fontFamily: 'Volkhov, serif' }}
        >
          {getPageTitle(pathname)}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <NotificationBell />

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#3a3c4e]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C6AB4E]/20 text-sm font-semibold text-[#C6AB4E]">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-[#CFD2E5]">{user.name}</p>
              <p className="text-[11px] text-[#8b8fa3]">{user.role}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-[#8b8fa3] sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#3a3c4e] bg-[#2E3040] shadow-2xl animate-[slideDown_0.15s_ease-out]">
              <div className="border-b border-[#3a3c4e] px-4 py-3">
                <p className="text-sm font-medium text-[#CFD2E5]">{user.name}</p>
                <p className="text-xs text-[#8b8fa3]">{user.email}</p>
              </div>
              <div className="py-1">
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#CFD2E5] transition-colors hover:bg-[#3a3c4e]/50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="h-4 w-4 text-[#8b8fa3]" />
                  Profile
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#CFD2E5] transition-colors hover:bg-[#3a3c4e]/50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4 text-[#8b8fa3]" />
                  Settings
                </a>
              </div>
              <div className="border-t border-[#3a3c4e] py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    window.location.href = '/';
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#E53935] transition-colors hover:bg-[#3a3c4e]/50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
