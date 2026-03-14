'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileBarChart,
  MessageSquare,
  FileCheck,
  ScrollText,
  Settings,
  Menu,
  X,
  Shield,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Investors', href: '/admin/investors', icon: Users },
  { label: 'Deal Management', href: '/admin/deals', icon: Briefcase },
  { label: 'Reports', href: '/admin/reports', icon: FileBarChart },
  { label: 'Chat Management', href: '/admin/chat-management', icon: MessageSquare },
  { label: 'NDAs', href: '/admin/ndas', icon: FileCheck },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#282A35' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#2E3040', borderRight: '1px solid #3a3c4e' }}
      >
        <div className="flex items-center justify-between h-16 px-4" style={{ borderBottom: '1px solid #3a3c4e' }}>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6" style={{ color: '#C6AB4E' }} />
            <span className="text-lg font-bold" style={{ color: '#CFD2E5' }}>
              NorthLend
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: '#C6AB4E', color: '#282A35' }}
            >
              Admin
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: '#8b8fa3' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active ? 'rgba(198, 171, 78, 0.1)' : 'transparent',
                  color: active ? '#C6AB4E' : '#8b8fa3',
                  borderLeft: active ? '3px solid #C6AB4E' : '3px solid transparent',
                }}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div
            className="p-3 rounded-lg text-xs"
            style={{ backgroundColor: 'rgba(198, 171, 78, 0.08)', border: '1px solid #3a3c4e' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5" style={{ color: '#C6AB4E' }} />
              <span style={{ color: '#C6AB4E' }} className="font-medium">Role: Super Admin</span>
            </div>
            <p style={{ color: '#8b8fa3' }}>Full platform access</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-6"
          style={{ backgroundColor: '#2E3040', borderBottom: '1px solid #3a3c4e' }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              style={{ color: '#8b8fa3' }}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm font-medium" style={{ color: '#8b8fa3' }}>
              Admin Panel
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: '#8b8fa3' }}>
              <Bell className="w-5 h-5" />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: '#E53935' }}
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: '#C6AB4E', color: '#282A35' }}
                >
                  SA
                </div>
                <span className="text-sm hidden sm:block" style={{ color: '#CFD2E5' }}>
                  Super Admin
                </span>
                <ChevronDown className="w-4 h-4" style={{ color: '#8b8fa3' }} />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-1 z-50"
                  style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
                >
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-white/5"
                    style={{ color: '#CFD2E5' }}
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm w-full transition-colors hover:bg-white/5"
                    style={{ color: '#E53935' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
