'use client';

import { useState } from 'react';
import {
  DollarSign,
  Briefcase,
  Clock,
  TrendingUp,
  ArrowUpRight,
  FileText,
  MessageSquare,
  Search,
  Plus,
  Building2,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';

const portfolioCards = [
  { label: 'Total Invested', value: '$1,245,000', icon: DollarSign, change: '+$125,000', changePositive: true },
  { label: 'Active Deals', value: '5', icon: Briefcase, change: '+1 this month', changePositive: true },
  { label: 'Pending Returns', value: '$18,750', icon: Clock, change: 'Next payout Mar 28', changePositive: true },
  { label: 'Yield-to-Date', value: '9.2%', icon: TrendingUp, change: '+0.3% vs Q3', changePositive: true },
];

const recentActivity = [
  { id: '1', type: 'payment', title: 'Distribution Received', description: '$4,125.00 from Lakeview Estates', time: '2 hours ago' },
  { id: '2', type: 'deal', title: 'New Opportunity Available', description: 'Midtown Office Complex - $2.1M', time: '5 hours ago' },
  { id: '3', type: 'report', title: 'Monthly Report Ready', description: 'February 2026 Portfolio Statement', time: '1 day ago' },
  { id: '4', type: 'commitment', title: 'Commitment Approved', description: '$250,000 - Harbour View Condos', time: '2 days ago' },
  { id: '5', type: 'message', title: 'Message from Sarah Chen', description: 'Re: Oak Street property update', time: '3 days ago' },
];

const activeDeals = [
  { id: 'd1', property: '145 King Street W, Toronto, ON', type: 'Commercial', ltv: 65, rate: 9.5, term: 12, allocation: 350000, maturity: '2026-09-15', status: 'Active' },
  { id: 'd2', property: '88 Harbour St, Toronto, ON', type: 'Multifamily', ltv: 70, rate: 8.8, term: 18, allocation: 250000, maturity: '2027-03-01', status: 'Active' },
  { id: 'd3', property: '2100 Lake Shore Blvd, Mississauga, ON', type: 'Mixed-Use', ltv: 60, rate: 10.2, term: 12, allocation: 200000, maturity: '2026-11-30', status: 'Active' },
  { id: 'd4', property: '55 York Street, Hamilton, ON', type: 'Industrial', ltv: 55, rate: 9.0, term: 24, allocation: 300000, maturity: '2027-08-15', status: 'Active' },
  { id: 'd5', property: '320 Bay St, Ottawa, ON', type: 'Office', ltv: 68, rate: 9.8, term: 12, allocation: 145000, maturity: '2026-07-20', status: 'Funding' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export default function DashboardPage() {
  const { user } = useCurrentUser();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="mb-8 rounded-xl border border-[#3a3c4e] bg-gradient-to-r from-[#2E3040] to-[#2E3040]/80 p-6">
        <h2
          className="text-2xl font-bold text-[#CFD2E5]"
          style={{ fontFamily: 'Volkhov, serif' }}
        >
          Welcome back, {user.name.split(' ')[0]}
        </h2>
        <p className="mt-1 text-sm text-[#8b8fa3]">
          Here is an overview of your investment portfolio as of today.
        </p>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {portfolioCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5 transition-all hover:border-[#C6AB4E]/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b8fa3]">{card.label}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C6AB4E]/10">
                  <Icon className="h-4 w-4 text-[#C6AB4E]" />
                </div>
              </div>
              <p
                className="mt-2 text-2xl font-bold text-[#CFD2E5]"
                style={{ fontFamily: 'Volkhov, serif' }}
              >
                {card.value}
              </p>
              <p className="mt-1 text-xs text-[#4CAF50]">{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        {[
          { label: 'Browse Opportunities', icon: Search, href: '/opportunities' },
          { label: 'View Reports', icon: FileText, href: '/reports' },
          { label: 'Messages', icon: MessageSquare, href: '/messages' },
          { label: 'New Commitment', icon: Plus, href: '/opportunities' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <a
              key={action.label}
              href={action.href}
              className="inline-flex items-center gap-2 rounded-lg border border-[#3a3c4e] bg-[#2E3040] px-4 py-2.5 text-sm text-[#CFD2E5] transition-colors hover:border-[#C6AB4E]/40 hover:bg-[#353748]"
            >
              <Icon className="h-4 w-4 text-[#C6AB4E]" />
              {action.label}
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Activity */}
        <div className="xl:col-span-1">
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040]">
            <div className="flex items-center justify-between border-b border-[#3a3c4e] px-5 py-4">
              <h3
                className="text-base font-semibold text-[#CFD2E5]"
                style={{ fontFamily: 'Volkhov, serif' }}
              >
                Recent Activity
              </h3>
              <a href="/notifications" className="text-xs text-[#C6AB4E] hover:underline">
                View All
              </a>
            </div>
            <div className="divide-y divide-[#3a3c4e]/50">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-[#353748]"
                >
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#C6AB4E]/10">
                    {item.type === 'payment' && <DollarSign className="h-4 w-4 text-[#4CAF50]" />}
                    {item.type === 'deal' && <Building2 className="h-4 w-4 text-[#C6AB4E]" />}
                    {item.type === 'report' && <FileText className="h-4 w-4 text-[#5B8DEF]" />}
                    {item.type === 'commitment' && <Briefcase className="h-4 w-4 text-[#C6AB4E]" />}
                    {item.type === 'message' && <MessageSquare className="h-4 w-4 text-[#AB47BC]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#CFD2E5]">{item.title}</p>
                    <p className="text-xs text-[#8b8fa3]">{item.description}</p>
                    <p className="mt-0.5 text-[11px] text-[#8b8fa3]/50">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Deals Table */}
        <div className="xl:col-span-2">
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040]">
            <div className="flex items-center justify-between border-b border-[#3a3c4e] px-5 py-4">
              <h3
                className="text-base font-semibold text-[#CFD2E5]"
                style={{ fontFamily: 'Volkhov, serif' }}
              >
                Active Deals Summary
              </h3>
              <a
                href="/deals"
                className="flex items-center gap-1 text-xs text-[#C6AB4E] hover:underline"
              >
                View All <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#3a3c4e]/50 text-left text-xs text-[#8b8fa3]">
                    <th className="px-5 py-3 font-medium">Property</th>
                    <th className="px-3 py-3 font-medium">Type</th>
                    <th className="px-3 py-3 font-medium">LTV</th>
                    <th className="px-3 py-3 font-medium">Rate</th>
                    <th className="px-3 py-3 font-medium">Allocation</th>
                    <th className="px-3 py-3 font-medium">Maturity</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3a3c4e]/30">
                  {activeDeals.map((deal) => (
                    <tr
                      key={deal.id}
                      className="text-sm transition-colors hover:bg-[#353748]"
                    >
                      <td className="px-5 py-3">
                        <a href={`/deals/${deal.id}`} className="font-medium text-[#CFD2E5] hover:text-[#C6AB4E]">
                          {deal.property}
                        </a>
                      </td>
                      <td className="px-3 py-3 text-[#8b8fa3]">{deal.type}</td>
                      <td className="px-3 py-3 text-[#8b8fa3]">{deal.ltv}%</td>
                      <td className="px-3 py-3 text-[#C6AB4E]">{deal.rate}%</td>
                      <td className="px-3 py-3 text-[#CFD2E5]">{formatCurrency(deal.allocation)}</td>
                      <td className="px-3 py-3 text-[#8b8fa3]">
                        {new Date(deal.maturity).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            deal.status === 'Active'
                              ? 'bg-[#4CAF50]/10 text-[#4CAF50]'
                              : 'bg-[#FFB300]/10 text-[#FFB300]'
                          }`}
                        >
                          {deal.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
