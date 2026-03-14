'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Filter,
  MapPin,
  FileSignature,
  Shield,
  X,
} from 'lucide-react';

const mockOpportunities = [
  { id: 'o1', title: 'Midtown Office Complex', address: '400 University Ave, Toronto, ON M5G 1S5', propertyType: 'Office', ltv: 65, rate: 10.5, term: 12, fundingGoal: 3000000, funded: 1800000, minAllocation: 50000, maxAllocation: 500000, riskRating: 'Moderate', status: 'Open' },
  { id: 'o2', title: 'Yorkville Luxury Condos', address: '100 Yorkville Ave, Toronto, ON M5R 1B9', propertyType: 'Multifamily', ltv: 70, rate: 9.0, term: 18, fundingGoal: 4500000, funded: 3200000, minAllocation: 100000, maxAllocation: 750000, riskRating: 'Low', status: 'Open' },
  { id: 'o3', title: 'Vancouver Industrial Park', address: '2500 Boundary Rd, Vancouver, BC V5M 3Z3', propertyType: 'Industrial', ltv: 55, rate: 11.0, term: 12, fundingGoal: 2000000, funded: 400000, minAllocation: 50000, maxAllocation: 400000, riskRating: 'Moderate-High', status: 'Open' },
  { id: 'o4', title: 'Montreal Mixed-Use Development', address: '800 Rue Sherbrooke O, Montreal, QC H3A 1G1', propertyType: 'Mixed-Use', ltv: 68, rate: 9.8, term: 24, fundingGoal: 5000000, funded: 2500000, minAllocation: 75000, maxAllocation: 600000, riskRating: 'Moderate', status: 'Open' },
  { id: 'o5', title: 'Calgary Retail Centre', address: '200 Barclay Parade SW, Calgary, AB T2P 4R5', propertyType: 'Retail', ltv: 60, rate: 10.2, term: 12, fundingGoal: 1800000, funded: 1600000, minAllocation: 50000, maxAllocation: 300000, riskRating: 'Moderate', status: 'Closing Soon' },
  { id: 'o6', title: 'Ottawa Student Housing', address: '150 Laurier Ave E, Ottawa, ON K1N 6N8', propertyType: 'Student Housing', ltv: 72, rate: 8.5, term: 12, fundingGoal: 2500000, funded: 500000, minAllocation: 25000, maxAllocation: 400000, riskRating: 'Low', status: 'Open' },
];

const riskColors: Record<string, string> = {
  Low: 'bg-[#4CAF50]/10 text-[#4CAF50]',
  Moderate: 'bg-[#FFB300]/10 text-[#FFB300]',
  'Moderate-High': 'bg-[#FF9800]/10 text-[#FF9800]',
  High: 'bg-[#E53935]/10 text-[#E53935]',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export default function OpportunitiesPage() {
  const [ndaSigned, setNdaSigned] = useState(false);
  const [ndaName, setNdaName] = useState('');
  const [ndaAgreed, setNdaAgreed] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleSignNda = () => {
    if (ndaAgreed && ndaName.trim()) {
      setNdaSigned(true);
    }
  };

  const filtered = mockOpportunities
    .filter((o) => typeFilter === 'all' || o.propertyType === typeFilter)
    .filter((o) => statusFilter === 'all' || o.status === statusFilter);

  // NDA Gate
  if (!ndaSigned) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C6AB4E]/10">
            <Shield className="h-8 w-8 text-[#C6AB4E]" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
            Non-Disclosure Agreement Required
          </h2>
          <p className="mb-6 text-sm text-[#8b8fa3]">
            To access detailed investment opportunities, you must sign our Master NDA.
            This protects confidential deal information shared on the platform.
          </p>

          <div className="mb-6 max-h-48 overflow-y-auto rounded-lg border border-[#3a3c4e] bg-[#282A35] p-4 text-left text-xs leading-relaxed text-[#8b8fa3]">
            <p className="mb-2 font-semibold text-[#CFD2E5]">NON-DISCLOSURE AGREEMENT</p>
            <p className="mb-2">
              This Non-Disclosure Agreement is entered into between NorthLend Financial Inc. and the undersigned Recipient.
              The Recipient agrees to maintain confidentiality of all non-public information, including deal structures,
              financial projections, and property valuations. This Agreement remains in effect for two (2) years and is
              governed by the laws of the Province of Ontario, Canada.
            </p>
          </div>

          <label className="mb-4 flex items-start gap-3 text-left">
            <input
              type="checkbox"
              checked={ndaAgreed}
              onChange={(e) => setNdaAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#C6AB4E]"
            />
            <span className="text-sm text-[#CFD2E5]">
              I have read and agree to the terms of this NDA
            </span>
          </label>

          <div className="mb-4">
            <input
              type="text"
              value={ndaName}
              onChange={(e) => setNdaName(e.target.value)}
              placeholder="Full Legal Name (E-Signature)"
              className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-4 py-2.5 text-sm text-[#CFD2E5] outline-none placeholder:text-[#8b8fa3]/50 focus:border-[#C6AB4E]"
              style={{ fontFamily: 'cursive' }}
            />
          </div>

          <button
            onClick={handleSignNda}
            disabled={!ndaAgreed || !ndaName.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C6AB4E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b89b3e] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileSignature className="h-4 w-4" />
            Sign NDA & Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6AB4E]/20">
          <TrendingUp className="h-5 w-5 text-[#C6AB4E]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
            Investment Opportunities
          </h1>
          <p className="text-sm text-[#8b8fa3]">{filtered.length} opportunities available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-4">
        <Filter className="h-4 w-4 text-[#8b8fa3]" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
        >
          <option value="all">All Types</option>
          <option value="Office">Office</option>
          <option value="Multifamily">Multifamily</option>
          <option value="Industrial">Industrial</option>
          <option value="Mixed-Use">Mixed-Use</option>
          <option value="Retail">Retail</option>
          <option value="Student Housing">Student Housing</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
        >
          <option value="all">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Closing Soon">Closing Soon</option>
        </select>
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((opp) => (
          <Link
            key={opp.id}
            href={`/opportunities/${opp.id}`}
            className="group rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5 transition-all hover:border-[#C6AB4E]/30"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-[#C6AB4E]/10 px-2.5 py-0.5 text-xs font-medium text-[#C6AB4E]">
                {opp.propertyType}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                opp.status === 'Closing Soon' ? 'bg-[#E53935]/10 text-[#E53935]' : 'bg-[#4CAF50]/10 text-[#4CAF50]'
              }`}>
                {opp.status}
              </span>
            </div>

            <h3 className="mb-1 text-base font-semibold text-[#CFD2E5] group-hover:text-[#C6AB4E]" style={{ fontFamily: 'Volkhov, serif' }}>
              {opp.title}
            </h3>
            <p className="mb-4 flex items-center gap-1 text-xs text-[#8b8fa3]">
              <MapPin className="h-3 w-3" />
              {opp.address}
            </p>

            <div className="mb-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-[#8b8fa3]">Rate</p>
                <p className="text-sm font-semibold text-[#C6AB4E]">{opp.rate}%</p>
              </div>
              <div>
                <p className="text-xs text-[#8b8fa3]">LTV</p>
                <p className="text-sm font-semibold text-[#CFD2E5]">{opp.ltv}%</p>
              </div>
              <div>
                <p className="text-xs text-[#8b8fa3]">Term</p>
                <p className="text-sm font-semibold text-[#CFD2E5]">{opp.term}mo</p>
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-[#8b8fa3]">Risk Rating</span>
              <span className={`rounded-full px-2 py-0.5 font-medium ${riskColors[opp.riskRating] || ''}`}>
                {opp.riskRating}
              </span>
            </div>

            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-[#8b8fa3]">Min / Max Allocation</span>
              <span className="text-[#CFD2E5]">{formatCurrency(opp.minAllocation)} - {formatCurrency(opp.maxAllocation)}</span>
            </div>

            {/* Funding Progress */}
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-[#8b8fa3]">{formatCurrency(opp.funded)} raised</span>
                <span className="text-[#8b8fa3]">{Math.round((opp.funded / opp.fundingGoal) * 100)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#3a3c4e]">
                <div
                  className="h-full rounded-full bg-[#C6AB4E]"
                  style={{ width: `${Math.min(100, (opp.funded / opp.fundingGoal) * 100)}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
