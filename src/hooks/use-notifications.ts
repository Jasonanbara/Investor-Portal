import { create } from 'zustand';

export type NotificationType =
  | 'DEAL_OPPORTUNITY'
  | 'DEAL_STATUS'
  | 'REPORT_UPLOADED'
  | 'CHAT_MESSAGE'
  | 'PROFILE_ACTION'
  | 'COMMITMENT_UPDATE'
  | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  href?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

interface NotificationActions {
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearReadNotifications: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'DEAL_OPPORTUNITY',
    title: 'New Investment Opportunity',
    message: 'A new multifamily deal in Toronto is now available for review.',
    timestamp: '2026-03-12T09:30:00Z',
    read: false,
    href: '/opportunities',
  },
  {
    id: 'n2',
    type: 'DEAL_STATUS',
    title: 'Deal Status Updated',
    message: 'The Riverside Plaza deal has moved to the funding stage.',
    timestamp: '2026-03-12T08:15:00Z',
    read: false,
    href: '/deals',
  },
  {
    id: 'n3',
    type: 'REPORT_UPLOADED',
    title: 'Monthly Report Ready',
    message: 'Your February 2026 portfolio statement is now available.',
    timestamp: '2026-03-11T16:00:00Z',
    read: false,
    href: '/reports',
  },
  {
    id: 'n4',
    type: 'CHAT_MESSAGE',
    title: 'New Message from Underwriter',
    message: 'Sarah Chen sent you a message regarding the Oak Street property.',
    timestamp: '2026-03-11T14:22:00Z',
    read: false,
    href: '/messages',
  },
  {
    id: 'n5',
    type: 'PROFILE_ACTION',
    title: 'KYC Document Expiring',
    message: 'Your government ID expires in 30 days. Please upload a new one.',
    timestamp: '2026-03-11T10:00:00Z',
    read: false,
    href: '/profile',
  },
  {
    id: 'n6',
    type: 'COMMITMENT_UPDATE',
    title: 'Commitment Approved',
    message: 'Your $250,000 commitment to Harbour View Condos has been approved.',
    timestamp: '2026-03-10T17:45:00Z',
    read: true,
    href: '/deals',
  },
  {
    id: 'n7',
    type: 'SYSTEM',
    title: 'Scheduled Maintenance',
    message: 'Platform maintenance scheduled for March 15, 2026, 2:00 AM - 4:00 AM EST.',
    timestamp: '2026-03-10T12:00:00Z',
    read: true,
  },
  {
    id: 'n8',
    type: 'DEAL_OPPORTUNITY',
    title: 'Deal Closing Soon',
    message: 'The Midtown Office Complex opportunity closes for commitments in 3 days.',
    timestamp: '2026-03-10T09:00:00Z',
    read: false,
    href: '/opportunities',
  },
  {
    id: 'n9',
    type: 'REPORT_UPLOADED',
    title: 'Tax Document Available',
    message: 'Your 2025 T5 tax slip is now available for download.',
    timestamp: '2026-03-09T15:30:00Z',
    read: true,
    href: '/reports',
  },
  {
    id: 'n10',
    type: 'CHAT_MESSAGE',
    title: 'New Message from Support',
    message: 'NorthLend Support replied to your inquiry about distributions.',
    timestamp: '2026-03-09T11:10:00Z',
    read: true,
    href: '/messages',
  },
  {
    id: 'n11',
    type: 'DEAL_STATUS',
    title: 'Distribution Processed',
    message: 'A distribution of $4,125.00 has been processed for the Lakeview project.',
    timestamp: '2026-03-08T16:00:00Z',
    read: true,
    href: '/deals',
  },
  {
    id: 'n12',
    type: 'COMMITMENT_UPDATE',
    title: 'Commitment Pending Review',
    message: 'Your commitment to the King West Condo project is under review.',
    timestamp: '2026-03-08T10:30:00Z',
    read: true,
    href: '/deals',
  },
  {
    id: 'n13',
    type: 'SYSTEM',
    title: 'New Feature: Document Center',
    message: 'We have launched a new centralized document center. Check it out!',
    timestamp: '2026-03-07T09:00:00Z',
    read: true,
  },
  {
    id: 'n14',
    type: 'DEAL_OPPORTUNITY',
    title: 'Exclusive Opportunity',
    message: 'An exclusive commercial deal in Vancouver has been added to your pipeline.',
    timestamp: '2026-03-06T14:15:00Z',
    read: true,
    href: '/opportunities',
  },
  {
    id: 'n15',
    type: 'PROFILE_ACTION',
    title: 'Profile Incomplete',
    message: 'Complete your investment preferences to receive tailored deal recommendations.',
    timestamp: '2026-03-06T08:00:00Z',
    read: true,
    href: '/profile',
  },
  {
    id: 'n16',
    type: 'REPORT_UPLOADED',
    title: 'Quarterly Performance Report',
    message: 'Q4 2025 performance report has been uploaded to your documents.',
    timestamp: '2026-03-05T16:30:00Z',
    read: true,
    href: '/reports',
  },
  {
    id: 'n17',
    type: 'CHAT_MESSAGE',
    title: 'Message from David Kim',
    message: 'David Kim shared documents related to the Yorkville deal.',
    timestamp: '2026-03-05T13:20:00Z',
    read: true,
    href: '/messages',
  },
  {
    id: 'n18',
    type: 'DEAL_STATUS',
    title: 'Deal Fully Funded',
    message: 'The Bayview Estates project has been fully funded. Thank you for your participation.',
    timestamp: '2026-03-04T17:00:00Z',
    read: true,
    href: '/deals',
  },
  {
    id: 'n19',
    type: 'COMMITMENT_UPDATE',
    title: 'Commitment Confirmation',
    message: 'Your $100,000 commitment to Bayview Estates has been confirmed.',
    timestamp: '2026-03-04T10:45:00Z',
    read: true,
    href: '/deals',
  },
  {
    id: 'n20',
    type: 'SYSTEM',
    title: 'Welcome to NorthLend Financial',
    message: 'Welcome! Complete your onboarding to start exploring investment opportunities.',
    timestamp: '2026-03-01T09:00:00Z',
    read: true,
    href: '/onboarding',
  },
  {
    id: 'n21',
    type: 'DEAL_OPPORTUNITY',
    title: 'New Industrial Deal',
    message: 'A new industrial warehouse opportunity in Mississauga is now accepting commitments.',
    timestamp: '2026-02-28T11:00:00Z',
    read: true,
    href: '/opportunities',
  },
  {
    id: 'n22',
    type: 'PROFILE_ACTION',
    title: 'Accreditation Verified',
    message: 'Your accredited investor status has been verified successfully.',
    timestamp: '2026-02-27T14:00:00Z',
    read: true,
    href: '/profile',
  },
];

const computeUnreadCount = (notifications: Notification[]) =>
  notifications.filter((n) => !n.read).length;

export const useNotifications = create<NotificationState & NotificationActions>(
  (set) => ({
    notifications: mockNotifications,
    unreadCount: computeUnreadCount(mockNotifications),

    markAsRead: (id: string) =>
      set((state) => {
        const notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        return { notifications, unreadCount: computeUnreadCount(notifications) };
      }),

    markAsUnread: (id: string) =>
      set((state) => {
        const notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, read: false } : n
        );
        return { notifications, unreadCount: computeUnreadCount(notifications) };
      }),

    markAllAsRead: () =>
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      })),

    addNotification: (notification: Notification) =>
      set((state) => {
        const notifications = [notification, ...state.notifications];
        return { notifications, unreadCount: computeUnreadCount(notifications) };
      }),

    removeNotification: (id: string) =>
      set((state) => {
        const notifications = state.notifications.filter((n) => n.id !== id);
        return { notifications, unreadCount: computeUnreadCount(notifications) };
      }),

    clearReadNotifications: () =>
      set((state) => {
        const notifications = state.notifications.filter((n) => !n.read);
        return { notifications, unreadCount: computeUnreadCount(notifications) };
      }),

    // TODO: Connect WebSocket/SSE listener for real-time notification updates
    // Example:
    // useEffect(() => {
    //   const eventSource = new EventSource('/api/notifications/stream');
    //   eventSource.onmessage = (event) => {
    //     const notification = JSON.parse(event.data);
    //     useNotifications.getState().addNotification(notification);
    //   };
    //   return () => eventSource.close();
    // }, []);
  })
);
