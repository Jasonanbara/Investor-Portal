'use client';

import { Toaster } from 'react-hot-toast';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useSidebar } from '@/hooks/use-sidebar';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collapsed = useSidebar((s) => s.collapsed);

  return (
    <div className="min-h-screen bg-[#282A35]">
      <Sidebar />

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          collapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        <Header />
        <Breadcrumbs />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#2E3040',
            color: '#CFD2E5',
            border: '1px solid #3a3c4e',
          },
          success: {
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#2E3040',
            },
          },
          error: {
            iconTheme: {
              primary: '#E53935',
              secondary: '#2E3040',
            },
          },
        }}
      />
    </div>
  );
}
