'use client';

import React from 'react';
import {
  Users,
  DollarSign,
  Briefcase,
  Clock,
  Plus,
  FileText,
  UserPlus,
  Send,
  Activity,
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const stats = [
  {
    label: 'Active Investors',
    value: '47',
    change: '+5',
    trend: 'up',
    icon: Users,
    description: 'vs last month',
  },
  {
    label: 'Assets Under Management',
    value: '$12.5M',
    change: '+$1.2M',
    trend: 'up',
    icon: DollarSign,
    description: 'vs last month',
  },
  {
    label: 'Active Deals',
    value: '15',
    change: '+2',
    trend: 'up',
    icon: Briefcase,
    description: 'vs last month',
  },
  {
    label: 'Pending Commitments',
    value: '3',
    change: '-1',
    trend: 'down',
    icon: Clock,
    description: 'vs last week',
  },
];

const pipelineData = [
  { label: 'Draft', count: 3, percent: 12, color: '#8b8fa3' },
  { label: 'Open', count: 5, percent: 20, color: '#C6AB4E' },
  { label: 'Funding', count: 4, percent: 30, color: '#FFB300' },
  { label: 'Funded', count: 6, percent: 25, color: '#4CAF50' },
  { label: 'Closed', count: 2, percent: 8, color: '#2196F3' },
  { label: 'Defaulted', count: 1, percent: 5, color: '#E53935' },
];

const recentActivity = [
  { id: 1, action: 'KYC Approved', user: 'Sarah Mitchell', resource: 'Investor Profile', time: '2 min ago', type: 'success' },
  { id: 2, action: 'New Commitment', user: 'David Chen', resource: 'Deal #NL-2024-015', time: '8 min ago', type: 'info' },
  { id: 3, action: 'Deal Created', user: 'Admin', resource: 'Deal #NL-2024-021', time: '15 min ago', type: 'info' },
  { id: 4, action: 'NDA Signed', user: 'Rachel Kim', resource: 'Platform NDA', time: '22 min ago', type: 'success' },
  { id: 5, action: 'Report Uploaded', user: 'Admin', resource: 'Q4 Financial Report', time: '35 min ago', type: 'info' },
  { id: 6, action: 'Account Suspended', user: 'System', resource: 'John Doe', time: '1 hr ago', type: 'warning' },
  { id: 7, action: 'Commitment Rejected', user: 'Admin', resource: 'Deal #NL-2024-018', time: '1.5 hr ago', type: 'error' },
  { id: 8, action: 'New Investor Registered', user: 'Emily Zhang', resource: 'Investor Profile', time: '2 hr ago', type: 'info' },
  { id: 9, action: 'Deal Funded', user: 'System', resource: 'Deal #NL-2024-012', time: '3 hr ago', type: 'success' },
  { id: 10, action: 'Settings Updated', user: 'Admin', resource: 'Platform Config', time: '4 hr ago', type: 'info' },
];

const quickActions = [
  { label: 'Create Deal', icon: Plus, href: '/admin/deals/new' },
  { label: 'Upload Report', icon: FileText, href: '/admin/reports' },
  { label: 'Add Investor', icon: UserPlus, href: '/admin/investors' },
  { label: 'Send Broadcast', icon: Send, href: '/admin/chat-management' },
];

const typeColors: Record<string, string> = {
  success: '#4CAF50',
  info: '#2196F3',
  warning: '#FFB300',
  error: '#E53935',
};

const typeIcons: Record<string, React.ElementType> = {
  success: CheckCircle,
  info: Activity,
  warning: AlertTriangle,
  error: XCircle,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>
            Admin Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8b8fa3' }}>
            Welcome back. Here&apos;s an overview of your platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: '#C6AB4E' }} />
          <span className="text-sm" style={{ color: '#C6AB4E' }}>Super Admin</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-xl"
              style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(198, 171, 78, 0.1)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: '#C6AB4E' }} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium" style={{ color: stat.trend === 'up' ? '#4CAF50' : '#E53935' }}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: '#8b8fa3' }}>
                {stat.label} <span className="ml-1">{stat.description}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Deal pipeline */}
      <div
        className="p-5 rounded-xl"
        style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#CFD2E5' }}>
          Deal Pipeline
        </h2>
        <div className="flex rounded-lg overflow-hidden h-10 mb-4">
          {pipelineData.map((seg) => (
            <div
              key={seg.label}
              className="flex items-center justify-center text-xs font-medium transition-all"
              style={{
                width: `${seg.percent}%`,
                backgroundColor: seg.color,
                color: '#282A35',
                minWidth: '40px',
              }}
              title={`${seg.label}: ${seg.count} deals`}
            >
              {seg.count}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {pipelineData.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
              <span style={{ color: '#8b8fa3' }}>
                {seg.label} ({seg.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div
          className="lg:col-span-2 p-5 rounded-xl"
          style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#CFD2E5' }}>
            Recent System Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item) => {
              const TypeIcon = typeIcons[item.type];
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(40, 42, 53, 0.5)' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${typeColors[item.type]}15` }}
                  >
                    <TypeIcon className="w-4 h-4" style={{ color: typeColors[item.type] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium" style={{ color: '#CFD2E5' }}>
                        {item.action}
                      </p>
                      <span className="text-xs flex-shrink-0 ml-2" style={{ color: '#8b8fa3' }}>
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#8b8fa3' }}>
                      {item.user} &bull; {item.resource}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div
          className="p-5 rounded-xl"
          style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#CFD2E5' }}>
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => toast.success(`Navigating to ${action.label}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-white/5"
                  style={{ border: '1px solid #3a3c4e' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(198, 171, 78, 0.1)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#C6AB4E' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#CFD2E5' }}>
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
