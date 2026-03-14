'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  UserX,
  ChevronDown,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Investor {
  id: string;
  name: string;
  email: string;
  kycStatus: 'verified' | 'pending' | 'rejected' | 'not_started';
  activeDeals: number;
  totalInvested: string;
  joined: string;
  status: 'active' | 'suspended' | 'pending';
}

const mockInvestors: Investor[] = [
  { id: 'INV-001', name: 'Sarah Mitchell', email: 'sarah.m@email.com', kycStatus: 'verified', activeDeals: 3, totalInvested: '$425,000', joined: '2024-01-15', status: 'active' },
  { id: 'INV-002', name: 'David Chen', email: 'david.chen@email.com', kycStatus: 'verified', activeDeals: 5, totalInvested: '$1,250,000', joined: '2023-11-08', status: 'active' },
  { id: 'INV-003', name: 'Rachel Kim', email: 'r.kim@email.com', kycStatus: 'pending', activeDeals: 0, totalInvested: '$0', joined: '2024-03-01', status: 'pending' },
  { id: 'INV-004', name: 'James Wilson', email: 'jwilson@email.com', kycStatus: 'verified', activeDeals: 2, totalInvested: '$750,000', joined: '2023-09-20', status: 'active' },
  { id: 'INV-005', name: 'Emily Zhang', email: 'emily.z@email.com', kycStatus: 'not_started', activeDeals: 0, totalInvested: '$0', joined: '2024-03-10', status: 'pending' },
  { id: 'INV-006', name: 'Michael Brown', email: 'mbrown@email.com', kycStatus: 'rejected', activeDeals: 0, totalInvested: '$0', joined: '2024-02-14', status: 'suspended' },
  { id: 'INV-007', name: 'Lisa Anderson', email: 'l.anderson@email.com', kycStatus: 'verified', activeDeals: 4, totalInvested: '$980,000', joined: '2023-08-05', status: 'active' },
  { id: 'INV-008', name: 'Robert Taylor', email: 'rtaylor@email.com', kycStatus: 'verified', activeDeals: 1, totalInvested: '$200,000', joined: '2024-01-22', status: 'active' },
  { id: 'INV-009', name: 'Sophia Garcia', email: 'sgarcia@email.com', kycStatus: 'pending', activeDeals: 0, totalInvested: '$0', joined: '2024-03-05', status: 'pending' },
  { id: 'INV-010', name: 'Daniel Lee', email: 'dlee@email.com', kycStatus: 'verified', activeDeals: 6, totalInvested: '$2,100,000', joined: '2023-06-12', status: 'active' },
  { id: 'INV-011', name: 'Amanda White', email: 'awhite@email.com', kycStatus: 'verified', activeDeals: 2, totalInvested: '$550,000', joined: '2023-10-30', status: 'active' },
  { id: 'INV-012', name: 'Christopher Harris', email: 'charris@email.com', kycStatus: 'not_started', activeDeals: 0, totalInvested: '$0', joined: '2024-03-08', status: 'pending' },
  { id: 'INV-013', name: 'Jennifer Martinez', email: 'jmartinez@email.com', kycStatus: 'verified', activeDeals: 3, totalInvested: '$875,000', joined: '2023-07-18', status: 'active' },
  { id: 'INV-014', name: 'Kevin Thompson', email: 'kthompson@email.com', kycStatus: 'pending', activeDeals: 0, totalInvested: '$0', joined: '2024-02-28', status: 'pending' },
  { id: 'INV-015', name: 'Patricia Robinson', email: 'probinson@email.com', kycStatus: 'verified', activeDeals: 1, totalInvested: '$350,000', joined: '2023-12-01', status: 'active' },
];

const kycColors: Record<string, { bg: string; text: string; label: string }> = {
  verified: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50', label: 'Verified' },
  pending: { bg: 'rgba(255, 179, 0, 0.15)', text: '#FFB300', label: 'Pending' },
  rejected: { bg: 'rgba(229, 57, 53, 0.15)', text: '#E53935', label: 'Rejected' },
  not_started: { bg: 'rgba(139, 143, 163, 0.15)', text: '#8b8fa3', label: 'Not Started' },
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50', label: 'Active' },
  suspended: { bg: 'rgba(229, 57, 53, 0.15)', text: '#E53935', label: 'Suspended' },
  pending: { bg: 'rgba(255, 179, 0, 0.15)', text: '#FFB300', label: 'Pending' },
};

export default function InvestorsPage() {
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openAction, setOpenAction] = useState<string | null>(null);

  const filtered = mockInvestors.filter((inv) => {
    const matchSearch =
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.email.toLowerCase().includes(search.toLowerCase());
    const matchKyc = kycFilter === 'all' || inv.kycStatus === kycFilter;
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchKyc && matchStatus;
  });

  const handleAction = (action: string, investor: Investor) => {
    setOpenAction(null);
    if (action === 'approve') {
      toast.success(`KYC approved for ${investor.name}`);
    } else if (action === 'suspend') {
      toast.error(`Account suspended for ${investor.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>
            Investor Management
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8b8fa3' }}>
            Manage investor accounts, KYC verification, and access.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
          <Users className="w-4 h-4" />
          {filtered.length} investors
        </div>
      </div>

      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl"
        style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8b8fa3' }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: '#282A35',
              border: '1px solid #3a3c4e',
              color: '#CFD2E5',
            }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8b8fa3' }} />
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
            style={{
              backgroundColor: '#282A35',
              border: '1px solid #3a3c4e',
              color: '#CFD2E5',
            }}
          >
            <option value="all">All KYC Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="not_started">Not Started</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#8b8fa3' }} />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-4 pr-8 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
            style={{
              backgroundColor: '#282A35',
              border: '1px solid #3a3c4e',
              color: '#CFD2E5',
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#8b8fa3' }} />
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #3a3c4e' }}>
                {['Name', 'Email', 'KYC Status', 'Active Deals', 'Total Invested', 'Joined', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider"
                    style={{ color: '#8b8fa3' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const kyc = kycColors[inv.kycStatus];
                const st = statusColors[inv.status];
                return (
                  <tr
                    key={inv.id}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid #3a3c4e' }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: '#CFD2E5' }}>
                      {inv.name}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>
                      {inv.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: kyc.bg, color: kyc.text }}
                      >
                        {kyc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#CFD2E5' }}>
                      {inv.activeDeals}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: '#C6AB4E' }}>
                      {inv.totalInvested}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>
                      {inv.joined}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: st.bg, color: st.text }}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setOpenAction(openAction === inv.id ? null : inv.id)}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                          style={{ color: '#8b8fa3' }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openAction === inv.id && (
                          <div
                            className="absolute right-0 top-8 w-44 rounded-lg shadow-xl py-1 z-50"
                            style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
                          >
                            <Link
                              href={`/admin/investors/${inv.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                              style={{ color: '#CFD2E5' }}
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </Link>
                            {inv.kycStatus === 'pending' && (
                              <button
                                onClick={() => handleAction('approve', inv)}
                                className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-white/5 transition-colors"
                                style={{ color: '#4CAF50' }}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve KYC
                              </button>
                            )}
                            <button
                              onClick={() => handleAction('suspend', inv)}
                              className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-white/5 transition-colors"
                              style={{ color: '#E53935' }}
                            >
                              <UserX className="w-4 h-4" />
                              Suspend Account
                            </button>
                          </div>
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
