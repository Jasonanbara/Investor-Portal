'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  LayoutGrid,
  List,
  Filter,
  Building2,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

const mockDeals = [
  { id: 'd1', title: '145 King Street W', address: '145 King Street W, Toronto, ON M5H 1J8', propertyType: 'Commercial', status: 'Active', ltv: 65, rate: 9.5, term: 12, allocation: 350000, funded: 2100000, goal: 2500000, maturity: '2026-09-15' },
  { id: 'd2', title: 'Harbour View Condos', address: '88 Harbour St, Toronto, ON M5J 2Z4', propertyType: 'Multifamily', status: 'Active', ltv: 70, rate: 8.8, term: 18, allocation: 250000, funded: 1800000, goal: 1800000, maturity: '2027-03-01' },
  { id: 'd3', title: 'Lakeview Estates', address: '2100 Lake Shore Blvd, Mississauga, ON L5J 1K4', propertyType: 'Mixed-Use', status: 'Active', ltv: 60, rate: 10.2, term: 12, allocation: 200000, funded: 1500000, goal: 2000000, maturity: '2026-11-30' },
  { id: 'd4', title: 'Hamilton Industrial', address: '55 York Street, Hamilton, ON L8R 3K1', propertyType: 'Industrial', status: 'Active', ltv: 55, rate: 9.0, term: 24, allocation: 300000, funded: 3000000, goal: 3500000, maturity: '2027-08-15' },
  { id: 'd5', title: 'Ottawa Office Tower', address: '320 Bay St, Ottawa, ON K1R 5A3', propertyType: 'Office', status: 'Funding', ltv: 68, rate: 9.8, term: 12, allocation: 145000, funded: 800000, goal: 1500000, maturity: '2026-07-20' },
  { id: 'd6', title: 'Riverside Plaza', address: '450 Riverside Dr, Windsor, ON N9A 5K3', propertyType: 'Retail', status: 'Completed', ltv: 62, rate: 9.2, term: 12, allocation: 175000, funded: 1200000, goal: 1200000, maturity: '2025-12-30' },
  { id: 'd7', title: 'Bayview Estates', address: '1200 Bayview Ave, North York, ON M4G 3B1', propertyType: 'Multifamily', status: 'Completed', ltv: 72, rate: 8.5, term: 12, allocation: 100000, funded: 900000, goal: 900000, maturity: '2025-11-15' },
  { id: 'd8', title: 'Kitchener Gateway', address: '75 Queen St N, Kitchener, ON N2H 2H1', propertyType: 'Commercial', status: 'Matured', ltv: 58, rate: 10.0, term: 12, allocation: 225000, funded: 1600000, goal: 1600000, maturity: '2025-09-01' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

const statusColors: Record<string, string> = {
  Active: 'bg-[#4CAF50]/10 text-[#4CAF50]',
  Funding: 'bg-[#FFB300]/10 text-[#FFB300]',
  Completed: 'bg-[#5B8DEF]/10 text-[#5B8DEF]',
  Matured: 'bg-[#8b8fa3]/10 text-[#8b8fa3]',
};

const propertyTypeColors: Record<string, string> = {
  Commercial: 'bg-[#C6AB4E]/10 text-[#C6AB4E]',
  Multifamily: 'bg-[#5B8DEF]/10 text-[#5B8DEF]',
  'Mixed-Use': 'bg-[#AB47BC]/10 text-[#AB47BC]',
  Industrial: 'bg-[#FF9800]/10 text-[#FF9800]',
  Office: 'bg-[#26A69A]/10 text-[#26A69A]',
  Retail: 'bg-[#EF5350]/10 text-[#EF5350]',
};

export default function DealsPage() {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filtered = mockDeals
    .filter((d) => statusFilter === 'all' || d.status === statusFilter)
    .filter((d) => typeFilter === 'all' || d.propertyType === typeFilter)
    .sort((a, b) => {
      if (sortBy === 'amount') return b.allocation - a.allocation;
      if (sortBy === 'rate') return b.rate - a.rate;
      return new Date(b.maturity).getTime() - new Date(a.maturity).getTime();
    });

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6AB4E]/20">
            <Briefcase className="h-5 w-5 text-[#C6AB4E]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              My Deals
            </h1>
            <p className="text-sm text-[#8b8fa3]">{filtered.length} deals</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-[#3a3c4e] bg-[#2E3040] p-1">
          <button
            onClick={() => setViewMode('card')}
            className={`rounded-md px-3 py-1.5 text-sm ${viewMode === 'card' ? 'bg-[#C6AB4E]/15 text-[#C6AB4E]' : 'text-[#8b8fa3]'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`rounded-md px-3 py-1.5 text-sm ${viewMode === 'table' ? 'bg-[#C6AB4E]/15 text-[#C6AB4E]' : 'text-[#8b8fa3]'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-4">
        <Filter className="h-4 w-4 text-[#8b8fa3]" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Funding">Funding</option>
          <option value="Completed">Completed</option>
          <option value="Matured">Matured</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
        >
          <option value="all">All Types</option>
          <option value="Commercial">Commercial</option>
          <option value="Multifamily">Multifamily</option>
          <option value="Mixed-Use">Mixed-Use</option>
          <option value="Industrial">Industrial</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="rate">Sort by Rate</option>
        </select>
      </div>

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((deal) => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="group rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5 transition-all hover:border-[#C6AB4E]/30"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${propertyTypeColors[deal.propertyType] || 'bg-[#8b8fa3]/10 text-[#8b8fa3]'}`}>
                  {deal.propertyType}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[deal.status] || ''}`}>
                  {deal.status}
                </span>
              </div>

              <h3 className="mb-1 text-base font-semibold text-[#CFD2E5] group-hover:text-[#C6AB4E]" style={{ fontFamily: 'Volkhov, serif' }}>
                {deal.title}
              </h3>
              <p className="mb-4 flex items-center gap-1 text-xs text-[#8b8fa3]">
                <MapPin className="h-3 w-3" />
                {deal.address}
              </p>

              <div className="mb-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-[#8b8fa3]">LTV</p>
                  <p className="text-sm font-semibold text-[#CFD2E5]">{deal.ltv}%</p>
                </div>
                <div>
                  <p className="text-xs text-[#8b8fa3]">Rate</p>
                  <p className="text-sm font-semibold text-[#C6AB4E]">{deal.rate}%</p>
                </div>
                <div>
                  <p className="text-xs text-[#8b8fa3]">Term</p>
                  <p className="text-sm font-semibold text-[#CFD2E5]">{deal.term}mo</p>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-[#8b8fa3]">Your Allocation</span>
                <span className="font-medium text-[#CFD2E5]">{formatCurrency(deal.allocation)}</span>
              </div>

              {/* Funding Progress */}
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-[#8b8fa3]">Funded</span>
                <span className="text-[#8b8fa3]">{Math.round((deal.funded / deal.goal) * 100)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#3a3c4e]">
                <div
                  className="h-full rounded-full bg-[#C6AB4E] transition-all"
                  style={{ width: `${Math.min(100, (deal.funded / deal.goal) * 100)}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-[#3a3c4e] bg-[#2E3040]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#3a3c4e] text-left text-xs text-[#8b8fa3]">
                <th className="px-5 py-3 font-medium">Property</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">LTV</th>
                <th className="px-3 py-3 font-medium">Rate</th>
                <th className="px-3 py-3 font-medium">Allocation</th>
                <th className="px-3 py-3 font-medium">Maturity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3c4e]/30">
              {filtered.map((deal) => (
                <tr key={deal.id} className="text-sm transition-colors hover:bg-[#353748]">
                  <td className="px-5 py-3">
                    <Link href={`/deals/${deal.id}`} className="font-medium text-[#CFD2E5] hover:text-[#C6AB4E]">
                      {deal.title}
                    </Link>
                    <p className="text-xs text-[#8b8fa3]">{deal.address}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${propertyTypeColors[deal.propertyType] || ''}`}>
                      {deal.propertyType}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[deal.status] || ''}`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[#8b8fa3]">{deal.ltv}%</td>
                  <td className="px-3 py-3 text-[#C6AB4E]">{deal.rate}%</td>
                  <td className="px-3 py-3 text-[#CFD2E5]">{formatCurrency(deal.allocation)}</td>
                  <td className="px-3 py-3 text-[#8b8fa3]">{new Date(deal.maturity).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
