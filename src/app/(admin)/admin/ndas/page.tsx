'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  FileCheck,
  Shield,
  AlertTriangle,
  XCircle,
  CheckCircle,
  X,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NDA {
  id: string;
  investor: string;
  investorId: string;
  type: 'platform' | 'deal_specific';
  deal: string | null;
  signedDate: string;
  ip: string;
  status: 'active' | 'revoked' | 'expired';
  version: string;
}

const mockNDAs: NDA[] = [
  { id: 'NDA-001', investor: 'Sarah Mitchell', investorId: 'INV-001', type: 'platform', deal: null, signedDate: '2024-01-15', ip: '192.168.1.45', status: 'active', version: 'v2.1' },
  { id: 'NDA-002', investor: 'Sarah Mitchell', investorId: 'INV-001', type: 'deal_specific', deal: 'NL-2024-001', signedDate: '2024-02-10', ip: '192.168.1.45', status: 'active', version: 'v1.0' },
  { id: 'NDA-003', investor: 'David Chen', investorId: 'INV-002', type: 'platform', deal: null, signedDate: '2023-11-08', ip: '10.0.0.22', status: 'active', version: 'v2.0' },
  { id: 'NDA-004', investor: 'David Chen', investorId: 'INV-002', type: 'deal_specific', deal: 'NL-2024-002', signedDate: '2024-02-18', ip: '10.0.0.22', status: 'active', version: 'v1.0' },
  { id: 'NDA-005', investor: 'Rachel Kim', investorId: 'INV-003', type: 'platform', deal: null, signedDate: '2024-03-01', ip: '172.16.0.88', status: 'active', version: 'v2.1' },
  { id: 'NDA-006', investor: 'James Wilson', investorId: 'INV-004', type: 'platform', deal: null, signedDate: '2023-09-20', ip: '192.168.5.12', status: 'active', version: 'v2.0' },
  { id: 'NDA-007', investor: 'Michael Brown', investorId: 'INV-006', type: 'platform', deal: null, signedDate: '2024-02-14', ip: '10.10.1.100', status: 'revoked', version: 'v2.1' },
  { id: 'NDA-008', investor: 'Lisa Anderson', investorId: 'INV-007', type: 'platform', deal: null, signedDate: '2023-08-05', ip: '192.168.2.33', status: 'active', version: 'v1.5' },
  { id: 'NDA-009', investor: 'Lisa Anderson', investorId: 'INV-007', type: 'deal_specific', deal: 'NL-2024-005', signedDate: '2024-03-02', ip: '192.168.2.33', status: 'active', version: 'v1.0' },
  { id: 'NDA-010', investor: 'Daniel Lee', investorId: 'INV-010', type: 'platform', deal: null, signedDate: '2023-06-12', ip: '172.16.5.44', status: 'active', version: 'v1.5' },
  { id: 'NDA-011', investor: 'Daniel Lee', investorId: 'INV-010', type: 'deal_specific', deal: 'NL-2024-002', signedDate: '2024-02-20', ip: '172.16.5.44', status: 'active', version: 'v1.0' },
  { id: 'NDA-012', investor: 'Amanda White', investorId: 'INV-011', type: 'platform', deal: null, signedDate: '2023-10-30', ip: '10.0.5.77', status: 'active', version: 'v2.0' },
  { id: 'NDA-013', investor: 'Jennifer Martinez', investorId: 'INV-013', type: 'platform', deal: null, signedDate: '2023-07-18', ip: '192.168.8.15', status: 'expired', version: 'v1.0' },
  { id: 'NDA-014', investor: 'Patricia Robinson', investorId: 'INV-015', type: 'platform', deal: null, signedDate: '2023-12-01', ip: '10.10.2.200', status: 'active', version: 'v2.0' },
  { id: 'NDA-015', investor: 'Robert Taylor', investorId: 'INV-008', type: 'platform', deal: null, signedDate: '2024-01-22', ip: '172.16.3.55', status: 'active', version: 'v2.1' },
];

const statusColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  active: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50', icon: CheckCircle },
  revoked: { bg: 'rgba(229, 57, 53, 0.15)', text: '#E53935', icon: XCircle },
  expired: { bg: 'rgba(255, 179, 0, 0.15)', text: '#FFB300', icon: AlertTriangle },
};

export default function NDAsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [revokeModal, setRevokeModal] = useState<NDA | null>(null);

  const filtered = mockNDAs.filter((nda) => {
    const matchSearch = nda.investor.toLowerCase().includes(search.toLowerCase()) || nda.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || nda.status === statusFilter;
    const matchType = typeFilter === 'all' || nda.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleRevoke = () => {
    if (!revokeModal) return;
    toast.error(`NDA ${revokeModal.id} revoked for ${revokeModal.investor}`);
    setRevokeModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Revoke modal */}
      {revokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md mx-4 p-6 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#CFD2E5' }}>Revoke NDA</h3>
              <button onClick={() => setRevokeModal(null)} style={{ color: '#8b8fa3' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e' }}>
              <p className="text-sm" style={{ color: '#CFD2E5' }}><strong>NDA ID:</strong> {revokeModal.id}</p>
              <p className="text-sm mt-1" style={{ color: '#CFD2E5' }}><strong>Investor:</strong> {revokeModal.investor}</p>
              <p className="text-sm mt-1" style={{ color: '#CFD2E5' }}><strong>Type:</strong> {revokeModal.type === 'platform' ? 'Platform NDA' : `Deal NDA (${revokeModal.deal})`}</p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg mb-4" style={{ backgroundColor: 'rgba(229, 57, 53, 0.08)' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#E53935' }} />
              <p className="text-xs" style={{ color: '#E53935' }}>
                Revoking this NDA will restrict the investor&apos;s access to confidential deal information. This action is logged.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRevokeModal(null)} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#8b8fa3', border: '1px solid #3a3c4e' }}>
                Cancel
              </button>
              <button onClick={handleRevoke} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#E53935', color: '#fff' }}>
                Revoke NDA
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>NDA Management</h1>
          <p className="text-sm mt-1" style={{ color: '#8b8fa3' }}>Track and manage non-disclosure agreements.</p>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
          <FileCheck className="w-4 h-4" />
          {mockNDAs.filter((n) => n.status === 'active').length} active NDAs
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8b8fa3' }} />
          <input
            type="text"
            placeholder="Search by investor or NDA ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-4 pr-8 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          >
            <option value="all">All Types</option>
            <option value="platform">Platform</option>
            <option value="deal_specific">Deal Specific</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#8b8fa3' }} />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-4 pr-8 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
            <option value="expired">Expired</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#8b8fa3' }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #3a3c4e' }}>
                {['Investor', 'Type', 'Deal', 'Version', 'Signed Date', 'IP Address', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: '#8b8fa3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((nda) => {
                const sc = statusColors[nda.status];
                const StatusIcon = sc.icon;
                return (
                  <tr key={nda.id} className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid #3a3c4e' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: '#CFD2E5' }}>{nda.investor}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: nda.type === 'platform' ? 'rgba(198, 171, 78, 0.15)' : 'rgba(33, 150, 243, 0.15)',
                          color: nda.type === 'platform' ? '#C6AB4E' : '#2196F3',
                        }}
                      >
                        {nda.type === 'platform' ? 'Platform' : 'Deal Specific'}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: nda.deal ? '#C6AB4E' : '#8b8fa3' }}>
                      {nda.deal || 'N/A'}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>{nda.version}</td>
                    <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>{nda.signedDate}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: '#8b8fa3' }}>{nda.ip}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize w-fit" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {nda.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded hover:bg-white/5" style={{ color: '#8b8fa3' }} title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        {nda.status === 'active' && (
                          <button
                            onClick={() => setRevokeModal(nda)}
                            className="p-1.5 rounded hover:bg-white/5"
                            style={{ color: '#E53935' }}
                            title="Revoke"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
