'use client';

import { useState, useMemo } from 'react';
import {
  Bell,
  TrendingUp,
  Briefcase,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useNotifications,
  type NotificationType,
  type Notification,
} from '@/hooks/use-notifications';

const notificationIconMap: Record<
  NotificationType,
  { icon: React.ElementType; color: string; label: string }
> = {
  DEAL_OPPORTUNITY: { icon: TrendingUp, color: '#C6AB4E', label: 'Deal Opportunity' },
  DEAL_STATUS: { icon: Briefcase, color: '#5B8DEF', label: 'Deal Status' },
  REPORT_UPLOADED: { icon: FileText, color: '#4CAF50', label: 'Report Uploaded' },
  CHAT_MESSAGE: { icon: MessageSquare, color: '#AB47BC', label: 'Chat Message' },
  PROFILE_ACTION: { icon: AlertCircle, color: '#FF9800', label: 'Profile Action' },
  COMMITMENT_UPDATE: { icon: CheckCircle, color: '#4CAF50', label: 'Commitment Update' },
  SYSTEM: { icon: Info, color: '#8b8fa3', label: 'System' },
};

const ITEMS_PER_PAGE = 10;

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function NotificationsPage() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearReadNotifications,
  } = useNotifications();

  const markAsUnread = useNotifications((s) => s.markAsUnread);

  const [filterType, setFilterType] = useState<NotificationType | 'ALL'>('ALL');
  const [filterRead, setFilterRead] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (filterType !== 'ALL') {
      result = result.filter((n) => n.type === filterType);
    }

    if (filterRead === 'UNREAD') {
      result = result.filter((n) => !n.read);
    } else if (filterRead === 'READ') {
      result = result.filter((n) => n.read);
    }

    return result;
  }, [notifications, filterType, filterRead]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE));
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleRead = (notification: Notification) => {
    if (notification.read) {
      markAsUnread(notification.id);
    } else {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#282A35] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6AB4E]/20">
              <Bell className="h-5 w-5 text-[#C6AB4E]" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-[#CFD2E5]"
                style={{ fontFamily: 'Volkhov, serif' }}
              >
                Notifications
              </h1>
              <p className="text-sm text-[#8b8fa3]">
                {notifications.filter((n) => !n.read).length} unread
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 rounded-lg border border-[#3a3c4e] bg-[#2E3040] px-3 py-2 text-sm text-[#CFD2E5] transition-colors hover:bg-[#353748]"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </button>
            <button
              onClick={() => {
                clearReadNotifications();
                setCurrentPage(1);
              }}
              className="flex items-center gap-2 rounded-lg border border-[#3a3c4e] bg-[#2E3040] px-3 py-2 text-sm text-[#CFD2E5] transition-colors hover:bg-[#353748]"
            >
              <Trash2 className="h-4 w-4" />
              Clear Read
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-[#8b8fa3]">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as NotificationType | 'ALL');
              setCurrentPage(1);
            }}
            className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
          >
            <option value="ALL">All Types</option>
            {Object.entries(notificationIconMap).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={filterRead}
            onChange={(e) => {
              setFilterRead(e.target.value as 'ALL' | 'UNREAD' | 'READ');
              setCurrentPage(1);
            }}
            className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
          >
            <option value="ALL">All Status</option>
            <option value="UNREAD">Unread</option>
            <option value="READ">Read</option>
          </select>
        </div>

        {/* Notification List */}
        {paginatedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#3a3c4e] bg-[#2E3040] py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C6AB4E]/10">
              <Bell className="h-8 w-8 text-[#C6AB4E]" />
            </div>
            <h3
              className="mb-1 text-lg font-semibold text-[#CFD2E5]"
              style={{ fontFamily: 'Volkhov, serif' }}
            >
              You&apos;re all caught up!
            </h3>
            <p className="text-sm text-[#8b8fa3]">
              No notifications match your current filters.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#3a3c4e] bg-[#2E3040]">
            {paginatedNotifications.map((notification, index) => {
              const { icon: IconComponent, color } =
                notificationIconMap[notification.type];
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-[#353748] ${
                    index < paginatedNotifications.length - 1
                      ? 'border-b border-[#3a3c4e]/50'
                      : ''
                  } ${!notification.read ? 'bg-[#C6AB4E]/[0.03]' : ''}`}
                >
                  {/* Unread dot */}
                  <div className="flex w-2 flex-shrink-0 pt-3">
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-[#C6AB4E]" />
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <IconComponent className="h-5 w-5" style={{ color }} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${
                        notification.read
                          ? 'text-[#8b8fa3]'
                          : 'font-medium text-[#CFD2E5]'
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="mt-0.5 text-sm text-[#8b8fa3]">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-[#8b8fa3]/60">
                      {formatDate(notification.timestamp)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 items-center gap-1">
                    <button
                      onClick={() => handleToggleRead(notification)}
                      className="rounded-lg p-2 text-[#8b8fa3] transition-colors hover:bg-[#3a3c4e] hover:text-[#CFD2E5]"
                      title={notification.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="rounded-lg p-2 text-[#8b8fa3] transition-colors hover:bg-[#3a3c4e] hover:text-[#E53935]"
                      title="Remove notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-[#8b8fa3]">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              {' '}-{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredNotifications.length)}{' '}
              of {filteredNotifications.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-[#3a3c4e] bg-[#2E3040] px-3 py-1.5 text-sm text-[#CFD2E5] transition-colors hover:bg-[#353748] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <span className="text-sm text-[#8b8fa3]">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-[#3a3c4e] bg-[#2E3040] px-3 py-1.5 text-sm text-[#CFD2E5] transition-colors hover:bg-[#353748] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
