'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  TrendingUp,
  Briefcase,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { useNotifications, type NotificationType } from '@/hooks/use-notifications';

const notificationIconMap: Record<
  NotificationType,
  { icon: React.ElementType; color: string }
> = {
  DEAL_OPPORTUNITY: { icon: TrendingUp, color: '#C6AB4E' },
  DEAL_STATUS: { icon: Briefcase, color: '#5B8DEF' },
  REPORT_UPLOADED: { icon: FileText, color: '#4CAF50' },
  CHAT_MESSAGE: { icon: MessageSquare, color: '#AB47BC' },
  PROFILE_ACTION: { icon: AlertCircle, color: '#FF9800' },
  COMMITMENT_UPDATE: { icon: CheckCircle, color: '#4CAF50' },
  SYSTEM: { icon: Info, color: '#8b8fa3' },
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string, href?: string) => {
    markAsRead(id);
    if (href) {
      router.push(href);
    }
    setIsOpen(false);
  };

  const recentNotifications = notifications.slice(0, 8);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 transition-colors hover:bg-[#3a3c4e]"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-[#CFD2E5]" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C6AB4E] px-1 text-[11px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 overflow-hidden rounded-xl border border-[#3a3c4e] bg-[#2E3040] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#3a3c4e] px-4 py-3">
            <h3
              className="text-base font-semibold text-[#CFD2E5]"
              style={{ fontFamily: 'Volkhov, serif' }}
            >
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-[#C6AB4E] transition-colors hover:text-[#d4bc6a]"
              >
                Mark All Read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[#8b8fa3]">
                No notifications yet
              </div>
            ) : (
              recentNotifications.map((notification) => {
                const { icon: IconComponent, color } =
                  notificationIconMap[notification.type];
                return (
                  <button
                    key={notification.id}
                    onClick={() =>
                      handleNotificationClick(notification.id, notification.href)
                    }
                    className="flex w-full items-start gap-3 border-b border-[#3a3c4e]/50 px-4 py-3 text-left transition-colors hover:bg-[#353748] last:border-0"
                  >
                    {/* Icon */}
                    <div
                      className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <IconComponent
                        className="h-4 w-4"
                        style={{ color }}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm leading-tight ${
                            notification.read
                              ? 'text-[#8b8fa3]'
                              : 'font-medium text-[#CFD2E5]'
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#C6AB4E]" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#8b8fa3] line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[11px] text-[#8b8fa3]/70">
                        {formatTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#3a3c4e] px-4 py-2.5">
            <button
              onClick={() => {
                router.push('/notifications');
                setIsOpen(false);
              }}
              className="w-full text-center text-sm font-medium text-[#C6AB4E] transition-colors hover:text-[#d4bc6a]"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
