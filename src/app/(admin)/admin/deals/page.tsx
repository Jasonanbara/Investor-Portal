'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Users,
  Briefcase,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Deal {
  id: string;
  property: string;
  type: 'bridge' | 'construction' | 'term' | 'mezzanine';
  amount: string;
  ltv: string;
  rate: string;
  status: 'draft' | 'open' | 'funding' | 'funded' | 'closed' | 'defaulted';
  fundedPercent: number;
}

const mockDeals: Deal[] = [
  { id: 'NL-2024-001', property: '45 Wellington St W, Toronto', type: 'bridge', amount: '$2,500,000', ltv: '65%', rate: '8.5%', status: 'funded', fundedPercent: 100 },
  { id: 'NL-2024-002', property: '120 Adelaide St E, Toronto', type: 'construction', amount: '$5,000,000', ltv: '70%', rate: '9.2%', status: 'funding', fundedPercent: 72 },
  { id: 'NL-2024-003', property: '88 Queen St W, Toronto', type: 'bridge', amount: '$1,800,000', ltv: '60%', rate: '7.8%', status: 'closed', fundedPercent: 100 },
  { id: 'NL-2024-004', property: '200 Bay St, Toronto', type: 'term', amount: '$3,200,000', ltv: '75%', rate: '10.5%', status: 'open', fundedPercent: 0 },
  { id: 'NL-2024-005', property: '15 York St, Toronto', type: 'mezzanine', amount: '$4,100,000', ltv: '80%', rate: '11.0%', status: 'funding', fundedPercent: 45 },
  { id: 'NL-2024-006', property: '300 Front St W, Toronto', type: 'bridge', amount: '$1,500,000', ltv: '55%', rate: '7.5%', status: 'funded', fundedPercent: 100 },
  { id: 'NL-2024-007', property: '50 Bloor St W, Toronto', type: 'construction', amount: '$8,000,000', ltv: '68%', rate: '9.8%', status: 'draft', fundedPercent: 0 },
  { id: 'NL-2024-008', property: '77 King St W, Toronto', type: 'term', amount: '$2,200,000', ltv: '72%', rate: '8.0%', status: 'open', fundedPercent: 0 },
  { id: 'NL-2024-009', property: '400 University Ave, Toronto', type: 'bridge', amount: '$3,500,000', ltv: '62%', rate: '8.8%', status: 'funding', fundedPercent: 88 },
  { id: 'NL-2024-010', property: '10 Dundas St E, Toronto', type: 'mezzanine', amount: '$1,200,000', ltv: '78%', rate: '10.0%', status: 'defaulted', fundedPercent: 100 },
  { id: 'NL-2024-011', property: '250 Yonge St, Toronto', type: 'construction', amount: '$6,500,000', ltv: '71%', rate: '9.5%', status: 'open', fundedPercent: 0 },
  { id: 'NL-2024-012', property: '55 St Clair Ave W, Toronto', type: 'bridge', amount: '$2,800,000', ltv: '58%', rate: '7.2%', status: 'funded', fundedPercent: 100 },
  { id: 'NL-2024-013', property: '180 Eglinton Ave E, Toronto', type: 'term', amount: '$1,900,000', ltv: '66%', rate: '8.3%', status: 'draft', fundedPercent: 0 },
  { id: 'NL-2024-014', property: '33 Gerrard St W, Toronto', type: 'bridge', amount: '$2,100,000', ltv: '63%', rate: '8.1%', status: 'funding', fundedPercent: 55 },
  { id: 'NL-2024-015', property: '90 Sheppard Ave E, Toronto', type: 'construction', amount: '$7,200,000', ltv: '69%', rate: '9.0%', status: 'draft', fundedPercent: 0 },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'rgba(139, 143, 163, 0.15)', text: '#8b8fa3' },
  open: { bg: 'rgba(198, 171, 78, 0.15)', text: '#C6AB4E' },
  funding: { bg: 'rgba(255, 179, 0, 0.15)', text: '#FFB300' },
  funded: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50' },
  closed: { bg: 'rgba(33, 150, 243, 0.15)', text: '#2196F3' },
  defaulted: { bg: 'rgba(229, 57, 53, 0.15)', text: '#E53935' },
};

const typeLabels: Record<string, string> = {
  bridge: 'Bridge',
  construction: 'Construction',
  term: 'Term',
  mezzanine: 'Mezzanine',
};

export default function DealsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [openAction, setOpenAction] = useState<string | null>(null);

  const filtered = mockDeals.filter((deal) => {
    const matchSearch =
      deal.id.toLowerCase().includes(search.toLowerCase()) ||
      deal.property.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || deal.status === statusFilter;
    const matchType = typeFilter === 'all' || deal.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>Deal Management</h1>
          <p className="text-sm mt-1" style={{ color: '#8b8fa3' }}>Manage mortgage deals, funding, and commitments.</p>
        </div>
        <Link
          href="/admin/deals/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: '#C6AB4E', color: '#282A35' }}
        >
          <Plus className="w-4 h-4" />
          Create New Deal
        </Link>
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
            placeholder="Search by deal ID or property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8b8fa3' }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="funding">Funding</option>
            <option value="funded">Funded</option>
            <option value="closed">Closed</option>
            <option value="defaulted">Defaulted</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#8b8fa3' }} />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-4 pr-8 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          >
            <option value="all">All Types</option>
            <option value="bridge">Bridge</option>
            <option value="construction">Construction</option>
            <option value="term">Term</option>
            <option value="mezzanine">Mezzanine</option>
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
                {['Deal ID', 'Property', 'Type', 'Amount', 'LTV', 'Rate', 'Status', 'Funded %', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#8b8fa3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((deal) => {
                const sc = statusColors[deal.status];
                return (
                  <tr key={deal.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid #3a3c4e' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: '#C6AB4E' }}>{deal.id}</td>
                    <td className="px-4 py-3" style={{ color: '#CFD2E5' }}>{deal.property}</td>
                    <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>{typeLabels[deal.type]}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: '#CFD2E5' }}>{deal.amount}</td>
                    <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>{deal.ltv}</td>
                    <td className="px-4 py-3" style={{ color: '#4CAF50' }}>{deal.rate}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {deal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#282A35' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${deal.fundedPercent}%`,
                              backgroundColor: deal.fundedPercent === 100 ? '#4CAF50' : '#C6AB4E',
                            }}
                          />
                        </div>
                        <span className="text-xs w-10 text-right" style={{ color: '#8b8fa3' }}>{deal.fundedPercent}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setOpenAction(openAction === deal.id ? null : deal.id)}
                          className="p-1 rounded hover:bg-white/10"
                          style={{ color: '#8b8fa3' }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openAction === deal.id && (
                          <div className="absolute right-0 top-8 w-44 rounded-lg shadow-xl py-1 z-50" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
                            <Link
                              href={`/admin/deals/${deal.id}/commitments`}
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5"
                              style={{ color: '#CFD2E5' }}
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </Link>
                            <button
                              onClick={() => { setOpenAction(null); toast.success('Opening editor...'); }}
                              className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-white/5"
                              style={{ color: '#CFD2E5' }}
                            >
                              <Edit className="w-4 h-4" />
                              Edit Deal
                            </button>
                            <Link
                              href={`/admin/deals/${deal.id}/commitments`}
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5"
                              style={{ color: '#C6AB4E' }}
                            >
                              <Users className="w-4 h-4" />
                              Commitments
                            </Link>
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

      <div className="flex items-center justify-between text-sm" style={{ color: '#8b8fa3' }}>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Showing {filtered.length} of {mockDeals.length} deals
        </div>
      </div>
    </div>
  );
}
