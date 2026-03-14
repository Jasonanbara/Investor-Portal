'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Building2,
  TrendingUp,
  Shield,
  DollarSign,
  User,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const opportunity = {
  id: 'o1',
  title: 'Midtown Office Complex',
  address: '400 University Ave, Toronto, ON M5G 1S5',
  propertyType: 'Office',
  description: 'Class A office building in Toronto Midtown, featuring modern amenities, LEED Gold certification, and a strong tenant roster with 92% occupancy. The building has recently undergone $3M in capital improvements.',
  ltv: 65,
  loanAmount: 3000000,
  appraised: 4615385,
  interestRate: 10.5,
  term: 12,
  fundingGoal: 3000000,
  funded: 1800000,
  minAllocation: 50000,
  maxAllocation: 500000,
  riskRating: 'Moderate',
  status: 'Open',
  exitStrategy: 'Refinance with Schedule A bank upon lease renewal of anchor tenant (expires Q4 2026).',
  borrowerProfile: {
    name: 'Pinnacle Properties Inc.',
    experience: '20+ years in commercial real estate',
    portfolio: '$180M+ in managed assets',
    track: 'Zero defaults across 45 completed projects',
  },
  loanTerms: {
    type: 'First Mortgage',
    position: '1st Lien',
    interestType: 'Fixed',
    paymentFrequency: 'Monthly',
    prepaymentPenalty: '3 months interest',
    insurance: 'Full replacement cost',
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export default function OpportunityDetailPage() {
  const router = useRouter();
  const [commitAmount, setCommitAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = () => {
    const amount = Number(commitAmount);
    if (amount < opportunity.minAllocation || amount > opportunity.maxAllocation) {
      toast.error(`Amount must be between ${formatCurrency(opportunity.minAllocation)} and ${formatCurrency(opportunity.maxAllocation)}`);
      return;
    }
    if (!confirmed) {
      toast.error('Please confirm your commitment');
      return;
    }
    toast.success(`Commitment of ${formatCurrency(amount)} submitted successfully!`);
    setCommitAmount('');
    setConfirmed(false);
  };

  const fundingPercent = Math.round((opportunity.funded / opportunity.fundingGoal) * 100);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Back + Title */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/opportunities')}
          className="mb-3 flex items-center gap-2 text-sm text-[#8b8fa3] transition-colors hover:text-[#C6AB4E]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Opportunities
        </button>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              {opportunity.title}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-[#8b8fa3]">
              <MapPin className="h-3.5 w-3.5" />
              {opportunity.address}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-[#C6AB4E]/10 px-3 py-1 text-sm font-medium text-[#C6AB4E]">
              {opportunity.propertyType}
            </span>
            <span className="rounded-full bg-[#4CAF50]/10 px-3 py-1 text-sm font-medium text-[#4CAF50]">
              {opportunity.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Property Details */}
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5">
            <h3 className="mb-4 text-base font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              Property Details
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-[#8b8fa3]">{opportunity.description}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Appraised Value', value: formatCurrency(opportunity.appraised) },
                { label: 'LTV', value: `${opportunity.ltv}%` },
                { label: 'Loan Amount', value: formatCurrency(opportunity.loanAmount) },
                { label: 'Exit Strategy', value: 'Refinance' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-[#282A35] p-3 text-center">
                  <p className="text-xs text-[#8b8fa3]">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#CFD2E5]">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-[#8b8fa3]">
              <span className="font-medium text-[#CFD2E5]">Exit Strategy:</span> {opportunity.exitStrategy}
            </p>
          </div>

          {/* Borrower Profile */}
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              <User className="h-5 w-5 text-[#C6AB4E]" />
              Borrower Profile
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: 'Company', value: opportunity.borrowerProfile.name },
                { label: 'Experience', value: opportunity.borrowerProfile.experience },
                { label: 'Portfolio', value: opportunity.borrowerProfile.portfolio },
                { label: 'Track Record', value: opportunity.borrowerProfile.track },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-[#282A35] p-3">
                  <p className="text-xs text-[#8b8fa3]">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-[#CFD2E5]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Terms */}
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5">
            <h3 className="mb-4 text-base font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              Loan Terms
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-[#8b8fa3]">Interest Rate</p>
                <p className="mt-1 text-lg font-bold text-[#C6AB4E]">{opportunity.interestRate}%</p>
              </div>
              <div>
                <p className="text-xs text-[#8b8fa3]">Term</p>
                <p className="mt-1 text-lg font-bold text-[#CFD2E5]">{opportunity.term} months</p>
              </div>
              <div>
                <p className="text-xs text-[#8b8fa3]">Risk Rating</p>
                <p className="mt-1 text-lg font-bold text-[#FFB300]">{opportunity.riskRating}</p>
              </div>
              {Object.entries(opportunity.loanTerms).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-[#282A35] p-3">
                  <p className="text-xs text-[#8b8fa3]">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</p>
                  <p className="mt-1 text-sm font-medium text-[#CFD2E5]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Commitment Form */}
        <div className="space-y-6">
          {/* Funding Progress */}
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5">
            <h3 className="mb-4 text-base font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              Funding Progress
            </h3>
            <div className="mb-2 text-center">
              <p className="text-3xl font-bold text-[#C6AB4E]">{fundingPercent}%</p>
              <p className="text-sm text-[#8b8fa3]">{formatCurrency(opportunity.funded)} of {formatCurrency(opportunity.fundingGoal)}</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#3a3c4e]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C6AB4E] to-[#d4bc6a]"
                style={{ width: `${fundingPercent}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-[#8b8fa3]">
              {formatCurrency(opportunity.fundingGoal - opportunity.funded)} remaining
            </p>
          </div>

          {/* Commitment Form */}
          <div className="rounded-xl border border-[#C6AB4E]/20 bg-[#2E3040] p-5">
            <h3 className="mb-4 text-base font-semibold text-[#C6AB4E]" style={{ fontFamily: 'Volkhov, serif' }}>
              Make a Commitment
            </h3>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">
                Commitment Amount (CAD)
              </label>
              <input
                type="number"
                value={commitAmount}
                onChange={(e) => setCommitAmount(e.target.value)}
                placeholder={`Min ${formatCurrency(opportunity.minAllocation)}`}
                className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-4 py-3 text-lg text-[#CFD2E5] outline-none placeholder:text-[#8b8fa3]/50 focus:border-[#C6AB4E]"
              />
              <p className="mt-1 text-xs text-[#8b8fa3]">
                Min: {formatCurrency(opportunity.minAllocation)} / Max: {formatCurrency(opportunity.maxAllocation)}
              </p>
            </div>

            {commitAmount && Number(commitAmount) > 0 && (
              <div className="mb-4 rounded-lg bg-[#282A35] p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b8fa3]">Est. Monthly Interest</span>
                  <span className="font-medium text-[#4CAF50]">
                    ${(Number(commitAmount) * (opportunity.interestRate / 100) / 12).toFixed(2)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-[#8b8fa3]">Est. Total Return</span>
                  <span className="font-medium text-[#4CAF50]">
                    {formatCurrency(Number(commitAmount) * (opportunity.interestRate / 100) * (opportunity.term / 12))}
                  </span>
                </div>
              </div>
            )}

            <label className="mb-4 flex items-start gap-3">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#C6AB4E]"
              />
              <span className="text-xs text-[#8b8fa3]">
                I confirm this commitment and understand the terms. This is subject to review and approval by NorthLend Financial.
              </span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={!commitAmount || !confirmed}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C6AB4E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b89b3e] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <DollarSign className="h-4 w-4" />
              Submit Commitment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
