import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  FileText,
  FolderOpen,
  MessageSquare,
  User,
  Settings,
  Users,
  Building2,
  MessagesSquare,
  Shield,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
}

export const investorNavigation: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Deals', href: '/deals', icon: Briefcase },
  { label: 'Opportunities', href: '/opportunities', icon: TrendingUp },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'Documents', href: '/documents', icon: FolderOpen },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const adminNavigation: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Investors', href: '/admin/investors', icon: Users },
  { label: 'Deal Management', href: '/admin/deals', icon: Building2 },
  { label: 'Reports', href: '/admin/reports', icon: FileText },
  { label: 'Chat Management', href: '/admin/chat-management', icon: MessagesSquare },
  { label: 'NDAs', href: '/admin/ndas', icon: Shield },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];
