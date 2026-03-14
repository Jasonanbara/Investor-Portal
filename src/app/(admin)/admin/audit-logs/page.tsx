'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Calendar,
  User,
  Shield,
  LogIn,
  LogOut,
  FileText,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Settings,
  Send,
  Lock,
  Unlock,
} from 'lucide-react';

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  actionType: 'auth' | 'create' | 'update' | 'delete' | 'view' | 'approve' | 'reject' | 'system' | 'upload' | 'download';
  resource: string;
  details: string;
  ip: string;
}

const actionColors: Record<string, { bg: string; text: string }> = {
  auth: { bg: 'rgba(33, 150, 243, 0.15)', text: '#2196F3' },
  create: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50' },
  update: { bg: 'rgba(198, 171, 78, 0.15)', text: '#C6AB4E' },
  delete: { bg: 'rgba(229, 57, 53, 0.15)', text: '#E53935' },
  view: { bg: 'rgba(139, 143, 163, 0.15)', text: '#8b8fa3' },
  approve: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50' },
  reject: { bg: 'rgba(229, 57, 53, 0.15)', text: '#E53935' },
  system: { bg: 'rgba(156, 39, 176, 0.15)', text: '#9C27B0' },
  upload: { bg: 'rgba(255, 179, 0, 0.15)', text: '#FFB300' },
  download: { bg: 'rgba(33, 150, 243, 0.15)', text: '#2196F3' },
};

const actionIcons: Record<string, React.ElementType> = {
  auth: LogIn,
  create: Plus,
  update: Edit,
  delete: Trash2,
  view: Eye,
  approve: CheckCircle,
  reject: XCircle,
  system: Settings,
  upload: Upload,
  download: Download,
};

const mockLogs: AuditLog[] = [
  { id: 1, timestamp: '2024-03-10 14:55:22', user: 'Admin', action: 'Login', actionType: 'auth', resource: 'Auth System', details: 'Successful login via SSO', ip: '10.0.0.1' },
  { id: 2, timestamp: '2024-03-10 14:52:10', user: 'Sarah Mitchell', action: 'View Deal', actionType: 'view', resource: 'Deal NL-2024-015', details: 'Viewed deal detail page', ip: '192.168.1.45' },
  { id: 3, timestamp: '2024-03-10 14:48:33', user: 'Admin', action: 'Approve KYC', actionType: 'approve', resource: 'Investor INV-001', details: 'Approved passport document', ip: '10.0.0.1' },
  { id: 4, timestamp: '2024-03-10 14:40:15', user: 'David Chen', action: 'Download Report', actionType: 'download', resource: 'RPT-003', details: 'Downloaded Q4 performance report', ip: '10.0.0.22' },
  { id: 5, timestamp: '2024-03-10 14:35:44', user: 'Admin', action: 'Create Deal', actionType: 'create', resource: 'Deal NL-2024-021', details: 'New bridge loan deal created', ip: '10.0.0.1' },
  { id: 6, timestamp: '2024-03-10 14:30:08', user: 'Rachel Kim', action: 'Sign NDA', actionType: 'create', resource: 'NDA-005', details: 'Signed platform NDA v2.1', ip: '172.16.0.88' },
  { id: 7, timestamp: '2024-03-10 14:22:55', user: 'Admin', action: 'Upload Report', actionType: 'upload', resource: 'RPT-008', details: 'Uploaded Q1 2024 quarterly report', ip: '10.0.0.1' },
  { id: 8, timestamp: '2024-03-10 14:15:30', user: 'System', action: 'Auto-Update', actionType: 'system', resource: 'Deal NL-2024-012', details: 'Deal status changed to Funded', ip: 'system' },
  { id: 9, timestamp: '2024-03-10 14:10:12', user: 'Admin', action: 'Reject Commitment', actionType: 'reject', resource: 'CMT-010', details: 'KYC incomplete for Kevin Thompson', ip: '10.0.0.1' },
  { id: 10, timestamp: '2024-03-10 14:05:00', user: 'Lisa Anderson', action: 'Login', actionType: 'auth', resource: 'Auth System', details: 'Successful login', ip: '192.168.2.33' },
  { id: 11, timestamp: '2024-03-10 13:58:22', user: 'Admin', action: 'Update Deal', actionType: 'update', resource: 'Deal NL-2024-002', details: 'Updated funding progress to 72%', ip: '10.0.0.1' },
  { id: 12, timestamp: '2024-03-10 13:45:11', user: 'Daniel Lee', action: 'Commit to Deal', actionType: 'create', resource: 'CMT-003', details: 'Committed $750,000 to NL-2024-002', ip: '172.16.5.44' },
  { id: 13, timestamp: '2024-03-10 13:30:45', user: 'Admin', action: 'Suspend Account', actionType: 'update', resource: 'Investor INV-006', details: 'Account suspended - KYC rejected', ip: '10.0.0.1' },
  { id: 14, timestamp: '2024-03-10 13:22:18', user: 'System', action: 'Email Sent', actionType: 'system', resource: 'Email Service', details: 'Commitment confirmation to David Chen', ip: 'system' },
  { id: 15, timestamp: '2024-03-10 13:15:00', user: 'Jennifer Martinez', action: 'View Report', actionType: 'view', resource: 'RPT-001', details: 'Viewed Q4 2023 financial report', ip: '192.168.8.15' },
  { id: 16, timestamp: '2024-03-10 13:00:33', user: 'Admin', action: 'Approve Commitment', actionType: 'approve', resource: 'CMT-004', details: 'Approved $200,000 from Sarah Mitchell', ip: '10.0.0.1' },
  { id: 17, timestamp: '2024-03-10 12:45:20', user: 'Robert Taylor', action: 'Upload KYC Doc', actionType: 'upload', resource: 'Investor INV-008', details: 'Uploaded government ID scan', ip: '172.16.3.55' },
  { id: 18, timestamp: '2024-03-10 12:30:55', user: 'Admin', action: 'Update Settings', actionType: 'update', resource: 'Platform Config', details: 'Updated email SMTP settings', ip: '10.0.0.1' },
  { id: 19, timestamp: '2024-03-10 12:15:10', user: 'Amanda White', action: 'Login', actionType: 'auth', resource: 'Auth System', details: 'Successful login', ip: '10.0.5.77' },
  { id: 20, timestamp: '2024-03-10 12:00:00', user: 'System', action: 'Scheduled Task', actionType: 'system', resource: 'Cron Service', details: 'Daily interest calculation completed', ip: 'system' },
  { id: 21, timestamp: '2024-03-10 11:45:33', user: 'Admin', action: 'Revoke NDA', actionType: 'delete', resource: 'NDA-007', details: 'Revoked NDA for Michael Brown', ip: '10.0.0.1' },
  { id: 22, timestamp: '2024-03-10 11:30:22', user: 'Emily Zhang', action: 'Register', actionType: 'create', resource: 'Auth System', details: 'New investor registration', ip: '10.10.10.55' },
  { id: 23, timestamp: '2024-03-10 11:15:18', user: 'Admin', action: 'Create Report', actionType: 'create', resource: 'RPT-006', details: 'Created Wellington St performance report', ip: '10.0.0.1' },
  { id: 24, timestamp: '2024-03-10 11:00:45', user: 'Sarah Mitchell', action: 'View Deal', actionType: 'view', resource: 'Deal NL-2024-012', details: 'Viewed deal commitment page', ip: '192.168.1.45' },
  { id: 25, timestamp: '2024-03-10 10:45:00', user: 'System', action: 'Backup Complete', actionType: 'system', resource: 'DB Service', details: 'Daily backup completed successfully', ip: 'system' },
  { id: 26, timestamp: '2024-03-09 22:30:11', user: 'Admin', action: 'Logout', actionType: 'auth', resource: 'Auth System', details: 'Session ended', ip: '10.0.0.1' },
  { id: 27, timestamp: '2024-03-09 22:15:55', user: 'Admin', action: 'Update Deal', actionType: 'update', resource: 'Deal NL-2024-009', details: 'Updated funding to 88%', ip: '10.0.0.1' },
  { id: 28, timestamp: '2024-03-09 21:50:33', user: 'David Chen', action: 'View Deal', actionType: 'view', resource: 'Deal NL-2024-002', details: 'Viewed funding progress', ip: '10.0.0.22' },
  { id: 29, timestamp: '2024-03-09 21:30:00', user: 'System', action: 'Rate Update', actionType: 'system', resource: 'Interest Service', details: 'Updated base rates from BoC feed', ip: 'system' },
  { id: 30, timestamp: '2024-03-09 20:15:22', user: 'James Wilson', action: 'Download Report', actionType: 'download', resource: 'RPT-005', details: 'Downloaded monthly financial report', ip: '192.168.5.12' },
  { id: 31, timestamp: '2024-03-09 19:45:18', user: 'Admin', action: 'Approve KYC', actionType: 'approve', resource: 'Investor INV-008', details: 'Approved proof of address', ip: '10.0.0.1' },
  { id: 32, timestamp: '2024-03-09 19:00:00', user: 'Patricia Robinson', action: 'Login', actionType: 'auth', resource: 'Auth System', details: 'Successful login', ip: '10.10.2.200' },
  { id: 33, timestamp: '2024-03-09 18:30:45', user: 'Admin', action: 'Assign Underwriter', actionType: 'update', resource: 'Chat CHAT-001', details: 'Assigned Mark Stevens', ip: '10.0.0.1' },
  { id: 34, timestamp: '2024-03-09 18:00:11', user: 'System', action: 'NDA Expiry Check', actionType: 'system', resource: 'NDA Service', details: 'Flagged NDA-013 as expired', ip: 'system' },
  { id: 35, timestamp: '2024-03-09 17:30:55', user: 'Lisa Anderson', action: 'Sign NDA', actionType: 'create', resource: 'NDA-009', details: 'Signed deal NDA for NL-2024-005', ip: '192.168.2.33' },
  { id: 36, timestamp: '2024-03-09 17:00:22', user: 'Admin', action: 'Update Investor', actionType: 'update', resource: 'Investor INV-003', details: 'Updated contact information', ip: '10.0.0.1' },
  { id: 37, timestamp: '2024-03-09 16:30:00', user: 'Kevin Thompson', action: 'Upload KYC Doc', actionType: 'upload', resource: 'Investor INV-014', details: 'Uploaded accreditation certificate', ip: '10.10.8.99' },
  { id: 38, timestamp: '2024-03-09 16:00:18', user: 'Admin', action: 'Create Deal', actionType: 'create', resource: 'Deal NL-2024-015', details: 'New construction loan deal', ip: '10.0.0.1' },
  { id: 39, timestamp: '2024-03-09 15:30:33', user: 'Daniel Lee', action: 'View Report', actionType: 'view', resource: 'RPT-003', details: 'Viewed Adelaide St performance', ip: '172.16.5.44' },
  { id: 40, timestamp: '2024-03-09 15:00:00', user: 'System', action: 'Health Check', actionType: 'system', resource: 'Monitor Service', details: 'All services operational', ip: 'system' },
  { id: 41, timestamp: '2024-03-09 14:30:12', user: 'Admin', action: 'Delete Draft', actionType: 'delete', resource: 'Deal NL-2024-020', details: 'Deleted draft deal', ip: '10.0.0.1' },
  { id: 42, timestamp: '2024-03-09 14:00:45', user: 'Sarah Mitchell', action: 'Download Report', actionType: 'download', resource: 'RPT-002', details: 'Downloaded tax summary 2023', ip: '192.168.1.45' },
  { id: 43, timestamp: '2024-03-09 13:30:00', user: 'Admin', action: 'Reject KYC', actionType: 'reject', resource: 'Investor INV-006', details: 'ID document unclear', ip: '10.0.0.1' },
  { id: 44, timestamp: '2024-03-09 13:00:55', user: 'Christopher Harris', action: 'Register', actionType: 'create', resource: 'Auth System', details: 'New investor registration', ip: '10.10.12.33' },
  { id: 45, timestamp: '2024-03-09 12:30:22', user: 'Admin', action: 'Update Settings', actionType: 'update', resource: 'Platform Config', details: 'Updated Mortgage Automator API key', ip: '10.0.0.1' },
  { id: 46, timestamp: '2024-03-09 12:00:00', user: 'System', action: 'Scheduled Task', actionType: 'system', resource: 'Cron Service', details: 'Monthly report generation triggered', ip: 'system' },
  { id: 47, timestamp: '2024-03-09 11:30:18', user: 'Amanda White', action: 'Commit to Deal', actionType: 'create', resource: 'CMT-005', details: 'Committed $450,000 to NL-2024-002', ip: '10.0.5.77' },
  { id: 48, timestamp: '2024-03-09 11:00:33', user: 'Admin', action: 'Approve Commitment', actionType: 'approve', resource: 'CMT-001', details: 'Approved $500,000 from David Chen', ip: '10.0.0.1' },
  { id: 49, timestamp: '2024-03-09 10:30:00', user: 'Sophia Garcia', action: 'Login Failed', actionType: 'auth', resource: 'Auth System', details: 'Invalid password - attempt 2', ip: '172.16.9.22' },
  { id: 50, timestamp: '2024-03-09 10:00:45', user: 'Admin', action: 'Send Broadcast', actionType: 'system', resource: 'Email Service', details: 'Sent platform update to all investors', ip: '10.0.0.1' },
];

const ITEMS_PER_PAGE = 15;

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const uniqueUsers = Array.from(new Set(mockLogs.map((l) => l.user))).sort();

  const filtered = useMemo(() => {
    return mockLogs.filter((log) => {
      const matchSearch =
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        log.resource.toLowerCase().includes(search.toLowerCase());
      const matchUser = userFilter === 'all' || log.user === userFilter;
      const matchAction = actionFilter === 'all' || log.actionType === actionFilter;
      const matchDateFrom = !dateFrom || log.timestamp >= dateFrom;
      const matchDateTo = !dateTo || log.timestamp <= dateTo + ' 23:59:59';
      return matchSearch && matchUser && matchAction && matchDateFrom && matchDateTo;
    });
  }, [search, userFilter, actionFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>Audit Logs</h1>
          <p className="text-sm mt-1" style={{ color: '#8b8fa3' }}>Complete system activity trail for compliance and monitoring.</p>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
          <ScrollText className="w-4 h-4" />
          {filtered.length} entries
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8b8fa3' }} />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
              style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8b8fa3' }} />
            <select
              value={userFilter}
              onChange={(e) => { setUserFilter(e.target.value); setPage(1); }}
              className="pl-10 pr-8 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
              style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
            >
              <option value="all">All Users</option>
              {uniqueUsers.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#8b8fa3' }} />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8b8fa3' }} />
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="pl-10 pr-8 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
              style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
            >
              <option value="all">All Actions</option>
              <option value="auth">Authentication</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="view">View</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="system">System</option>
              <option value="upload">Upload</option>
              <option value="download">Download</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#8b8fa3' }} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: '#8b8fa3' }} />
            <span className="text-xs" style={{ color: '#8b8fa3' }}>Date Range:</span>
          </div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          />
          <span className="text-xs" style={{ color: '#8b8fa3' }}>to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #3a3c4e' }}>
                {['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: '#8b8fa3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((log) => {
                const ac = actionColors[log.actionType];
                const ActionIcon = actionIcons[log.actionType];
                return (
                  <tr key={log.id} className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid #3a3c4e' }}>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: '#8b8fa3' }}>
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-xs" style={{ color: log.user === 'System' ? '#9C27B0' : log.user === 'Admin' ? '#C6AB4E' : '#CFD2E5' }}>
                        {log.user}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: ac.bg, color: ac.text }}>
                        <ActionIcon className="w-3.5 h-3.5" />
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#CFD2E5' }}>{log.resource}</td>
                    <td className="px-4 py-3 text-xs max-w-[250px] truncate" style={{ color: '#8b8fa3' }}>{log.details}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: '#8b8fa3' }}>{log.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: '#8b8fa3' }}>
          Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg transition-colors disabled:opacity-30"
            style={{ border: '1px solid #3a3c4e', color: '#8b8fa3' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="w-8 h-8 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: page === p ? '#C6AB4E' : 'transparent',
                color: page === p ? '#282A35' : '#8b8fa3',
                border: page === p ? 'none' : '1px solid #3a3c4e',
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg transition-colors disabled:opacity-30"
            style={{ border: '1px solid #3a3c4e', color: '#8b8fa3' }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
