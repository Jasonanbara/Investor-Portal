'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  FileText,
  Download,
  Clock,
  CheckCircle,
  Circle,
} from 'lucide-react';

const dealData = {
  id: 'd1',
  title: '145 King Street West',
  address: '145 King Street W, Toronto, ON M5H 1J8',
  propertyType: 'Commercial',
  status: 'Active',
  description: 'Class A commercial office building in the heart of Toronto financial district. Recently renovated with modern amenities and strong tenant mix.',
  ltv: 65,
  loanAmount: 2500000,
  appraised: 3846154,
  interestRate: 9.5,
  term: 12,
  maturityDate: '2026-09-15',
  fundingDate: '2025-09-15',
  exitStrategy: 'Refinance with institutional lender upon lease renewal',
  borrowerSummary: 'Established commercial property developer with 15+ years experience in GTA market.',
  yourAllocation: 350000,
  funded: 2100000,
  goal: 2500000,
};

const paymentSchedule = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2025, 9 + i, 15).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' }),
  principal: 0,
  interest: 2770.83,
  total: 2770.83,
  status: i < 5 ? 'paid' : i === 5 ? 'upcoming' : 'scheduled',
}));

const timeline = [
  { date: 'Sep 15, 2025', label: 'Deal Originated', status: 'completed' },
  { date: 'Sep 20, 2025', label: 'Funding Opened', status: 'completed' },
  { date: 'Oct 5, 2025', label: 'Your Commitment Approved', status: 'completed' },
  { date: 'Oct 15, 2025', label: 'Deal Fully Funded', status: 'completed' },
  { date: 'Oct 20, 2025', label: 'Loan Disbursed', status: 'completed' },
  { date: 'Mar 15, 2026', label: 'Q1 Distribution Paid', status: 'current' },
  { date: 'Jun 15, 2026', label: 'Q2 Distribution', status: 'pending' },
  { date: 'Sep 15, 2026', label: 'Maturity / Exit', status: 'pending' },
];

const documents = [
  { name: 'Loan Agreement', type: 'PDF', date: 'Sep 15, 2025' },
  { name: 'Property Appraisal', type: 'PDF', date: 'Sep 10, 2025' },
  { name: 'Environmental Report', type: 'PDF', date: 'Sep 8, 2025' },
  { name: 'Title Insurance', type: 'PDF', date: 'Sep 12, 2025' },
  { name: 'Q4 2025 Performance Report', type: 'PDF', date: 'Jan 15, 2026' },
  { name: 'Q1 2026 Performance Report', type: 'PDF', date: 'Mar 10, 2026' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export default function DealDetailPage() {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button + Title */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/deals')}
          className="mb-3 flex items-center gap-2 text-sm text-[#8b8fa3] transition-colors hover:text-[#C6AB4E]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Deals
        </button>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              {dealData.title}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-[#8b8fa3]">
              <MapPin className="h-3.5 w-3.5" />
              {dealData.address}
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-[#4CAF50]/10 px-3 py-1 text-sm font-medium text-[#4CAF50]">
            {dealData.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Property Summary */}
        <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5">
          <h3 className="mb-4 text-base font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
            Property Summary
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Property Type', value: dealData.propertyType },
              { label: 'Appraised Value', value: formatCurrency(dealData.appraised) },
              { label: 'LTV', value: `${dealData.ltv}%` },
              { label: 'Exit Strategy', value: dealData.exitStrategy },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-[#8b8fa3]">{item.label}</span>
                <span className="text-right font-medium text-[#CFD2E5]">{item.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[#8b8fa3]">{dealData.description}</p>
        </div>

        {/* Loan Terms */}
        <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5">
          <h3 className="mb-4 text-base font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
            Loan Terms
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Loan Amount', value: formatCurrency(dealData.loanAmount) },
              { label: 'Interest Rate', value: `${dealData.interestRate}%`, highlight: true },
              { label: 'Term', value: `${dealData.term} months` },
              { label: 'Funding Date', value: new Date(dealData.fundingDate).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }) },
              { label: 'Maturity Date', value: new Date(dealData.maturityDate).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }) },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-[#8b8fa3]">{item.label}</span>
                <span className={`font-medium ${item.highlight ? 'text-[#C6AB4E]' : 'text-[#CFD2E5]'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-[#282A35] p-3">
            <p className="text-xs text-[#8b8fa3]">Borrower</p>
            <p className="mt-1 text-sm text-[#CFD2E5]">{dealData.borrowerSummary}</p>
          </div>
        </div>

        {/* Your Investment */}
        <div className="rounded-xl border border-[#C6AB4E]/20 bg-[#2E3040] p-5">
          <h3 className="mb-4 text-base font-semibold text-[#C6AB4E]" style={{ fontFamily: 'Volkhov, serif' }}>
            Your Investment
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#8b8fa3]">Allocation</span>
              <span className="text-xl font-bold text-[#CFD2E5]">{formatCurrency(dealData.yourAllocation)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8b8fa3]">Share of Deal</span>
              <span className="font-medium text-[#CFD2E5]">{((dealData.yourAllocation / dealData.goal) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8b8fa3]">Monthly Interest</span>
              <span className="font-medium text-[#4CAF50]">${(dealData.yourAllocation * (dealData.interestRate / 100) / 12).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8b8fa3]">Total Expected Return</span>
              <span className="font-medium text-[#4CAF50]">{formatCurrency(dealData.yourAllocation * (dealData.interestRate / 100))}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-[#8b8fa3]">Deal Funding</span>
              <span className="text-[#8b8fa3]">{Math.round((dealData.funded / dealData.goal) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#3a3c4e]">
              <div
                className="h-full rounded-full bg-[#C6AB4E]"
                style={{ width: `${Math.min(100, (dealData.funded / dealData.goal) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-[#8b8fa3]">{formatCurrency(dealData.funded)} of {formatCurrency(dealData.goal)}</p>
          </div>
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="mt-6 rounded-xl border border-[#3a3c4e] bg-[#2E3040]">
        <div className="border-b border-[#3a3c4e] px-5 py-4">
          <h3 className="text-base font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
            Payment Schedule
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#3a3c4e]/50 text-left text-xs text-[#8b8fa3]">
                <th className="px-5 py-3 font-medium">Month</th>
                <th className="px-3 py-3 font-medium">Interest</th>
                <th className="px-3 py-3 font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3c4e]/30">
              {paymentSchedule.map((payment, i) => (
                <tr key={i} className="text-sm hover:bg-[#353748]">
                  <td className="px-5 py-3 text-[#CFD2E5]">{payment.month}</td>
                  <td className="px-3 py-3 text-[#8b8fa3]">${payment.interest.toFixed(2)}</td>
                  <td className="px-3 py-3 text-[#CFD2E5]">${payment.total.toFixed(2)}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      payment.status === 'paid' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' :
                      payment.status === 'upcoming' ? 'bg-[#FFB300]/10 text-[#FFB300]' :
                      'bg-[#8b8fa3]/10 text-[#8b8fa3]'
                    }`}>
                      {payment.status === 'paid' && <CheckCircle className="h-3 w-3" />}
                      {payment.status === 'upcoming' && <Clock className="h-3 w-3" />}
                      {payment.status === 'paid' ? 'Paid' : payment.status === 'upcoming' ? 'Upcoming' : 'Scheduled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Timeline */}
        <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5">
          <h3 className="mb-5 text-base font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
            Deal Timeline
          </h3>
          <div className="space-y-0">
            {timeline.map((event, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {event.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#4CAF50]" />
                  ) : event.status === 'current' ? (
                    <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-[#C6AB4E] bg-[#C6AB4E]/20" />
                  ) : (
                    <Circle className="h-5 w-5 flex-shrink-0 text-[#3a3c4e]" />
                  )}
                  {i < timeline.length - 1 && (
                    <div className={`my-1 h-6 w-px ${event.status === 'completed' ? 'bg-[#4CAF50]/40' : 'bg-[#3a3c4e]'}`} />
                  )}
                </div>
                <div className="pb-4">
                  <p className={`text-sm font-medium ${event.status === 'pending' ? 'text-[#8b8fa3]' : 'text-[#CFD2E5]'}`}>
                    {event.label}
                  </p>
                  <p className="text-xs text-[#8b8fa3]/60">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5">
          <h3 className="mb-4 text-base font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
            Documents
          </h3>
          <div className="space-y-2">
            {documents.map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-[#3a3c4e] bg-[#282A35] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-[#C6AB4E]" />
                  <div>
                    <p className="text-sm font-medium text-[#CFD2E5]">{doc.name}</p>
                    <p className="text-xs text-[#8b8fa3]">{doc.type} - {doc.date}</p>
                  </div>
                </div>
                <button className="rounded-lg p-2 text-[#8b8fa3] transition-colors hover:bg-[#3a3c4e] hover:text-[#CFD2E5]">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
