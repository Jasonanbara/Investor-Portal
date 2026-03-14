'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Commitment {
  id: string;
  investor: string;
  investorId: string;
  amount: string;
  amountNum: number;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  date: string;
  notes: string;
}

const dealInfo = {
  id: 'NL-2024-002',
  property: '120 Adelaide St E, Toronto',
  fundingGoal: 5000000,
  totalCommitted: 3600000,
};

const mockCommitments: Commitment[] = [
  { id: 'CMT-001', investor: 'David Chen', investorId: 'INV-002', amount: '$500,000', amountNum: 500000, status: 'approved', date: '2024-02-20', notes: 'Institutional allocation' },
  { id: 'CMT-002', investor: 'Lisa Anderson', investorId: 'INV-007', amount: '$300,000', amountNum: 300000, status: 'approved', date: '2024-02-22', notes: '' },
  { id: 'CMT-003', investor: 'Daniel Lee', investorId: 'INV-010', amount: '$750,000', amountNum: 750000, status: 'approved', date: '2024-02-25', notes: 'Priority investor' },
  { id: 'CMT-004', investor: 'Sarah Mitchell', investorId: 'INV-001', amount: '$200,000', amountNum: 200000, status: 'approved', date: '2024-03-01', notes: '' },
  { id: 'CMT-005', investor: 'Jennifer Martinez', investorId: 'INV-013', amount: '$450,000', amountNum: 450000, status: 'approved', date: '2024-03-03', notes: '' },
  { id: 'CMT-006', investor: 'Robert Taylor', investorId: 'INV-008', amount: '$150,000', amountNum: 150000, status: 'pending', date: '2024-03-08', notes: 'First deal commitment' },
  { id: 'CMT-007', investor: 'Amanda White', investorId: 'INV-011', amount: '$250,000', amountNum: 250000, status: 'pending', date: '2024-03-09', notes: '' },
  { id: 'CMT-008', investor: 'Patricia Robinson', investorId: 'INV-015', amount: '$350,000', amountNum: 350000, status: 'pending', date: '2024-03-10', notes: 'Conditional on KYC' },
  { id: 'CMT-009', investor: 'James Wilson', investorId: 'INV-004', amount: '$400,000', amountNum: 400000, status: 'withdrawn', date: '2024-02-28', notes: 'Investor withdrew' },
  { id: 'CMT-010', investor: 'Kevin Thompson', investorId: 'INV-014', amount: '$100,000', amountNum: 100000, status: 'rejected', date: '2024-03-02', notes: 'KYC not complete' },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'rgba(255, 179, 0, 0.15)', text: '#FFB300' },
  approved: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50' },
  rejected: { bg: 'rgba(229, 57, 53, 0.15)', text: '#E53935' },
  withdrawn: { bg: 'rgba(139, 143, 163, 0.15)', text: '#8b8fa3' },
};

export default function DealCommitmentsPage() {
  const params = useParams();
  const dealId = params.id as string;
  const [commitments, setCommitments] = useState(mockCommitments);
  const [confirmModal, setConfirmModal] = useState<{ action: 'approve' | 'reject'; commitment: Commitment } | null>(null);

  const fundedPercent = Math.round((dealInfo.totalCommitted / dealInfo.fundingGoal) * 100);
  const pendingCount = commitments.filter((c) => c.status === 'pending').length;
  const approvedTotal = commitments.filter((c) => c.status === 'approved').reduce((sum, c) => sum + c.amountNum, 0);

  const handleConfirm = () => {
    if (!confirmModal) return;
    const { action, commitment } = confirmModal;
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === commitment.id ? { ...c, status: action === 'approve' ? 'approved' : 'rejected' } : c
      )
    );
    toast.success(`Commitment ${action === 'approve' ? 'approved' : 'rejected'}: ${commitment.investor} - ${commitment.amount}`);
    setConfirmModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md mx-4 p-6 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#CFD2E5' }}>
                {confirmModal.action === 'approve' ? 'Approve' : 'Reject'} Commitment
              </h3>
              <button onClick={() => setConfirmModal(null)} style={{ color: '#8b8fa3' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e' }}>
              <p className="text-sm" style={{ color: '#CFD2E5' }}>
                <strong>Investor:</strong> {confirmModal.commitment.investor}
              </p>
              <p className="text-sm mt-1" style={{ color: '#CFD2E5' }}>
                <strong>Amount:</strong> {confirmModal.commitment.amount}
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg mb-4" style={{ backgroundColor: 'rgba(255, 179, 0, 0.08)' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FFB300' }} />
              <p className="text-xs" style={{ color: '#FFB300' }}>
                This action will notify the investor via email. Are you sure?
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: '#8b8fa3', border: '1px solid #3a3c4e' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: confirmModal.action === 'approve' ? '#4CAF50' : '#E53935',
                  color: '#fff',
                }}
              >
                {confirmModal.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <Link href="/admin/deals" className="flex items-center gap-2 text-sm hover:underline mb-2" style={{ color: '#C6AB4E' }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Deals
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>
          Deal Commitments - {dealId || dealInfo.id}
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8b8fa3' }}>{dealInfo.property}</p>
      </div>

      {/* Stats + Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" style={{ color: '#C6AB4E' }} />
            <span className="text-xs uppercase tracking-wider" style={{ color: '#8b8fa3' }}>Funding Goal</span>
          </div>
          <p className="text-xl font-bold" style={{ color: '#CFD2E5' }}>${(dealInfo.fundingGoal / 1000000).toFixed(1)}M</p>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: '#4CAF50' }} />
            <span className="text-xs uppercase tracking-wider" style={{ color: '#8b8fa3' }}>Approved Committed</span>
          </div>
          <p className="text-xl font-bold" style={{ color: '#4CAF50' }}>${(approvedTotal / 1000000).toFixed(2)}M</p>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" style={{ color: '#FFB300' }} />
            <span className="text-xs uppercase tracking-wider" style={{ color: '#8b8fa3' }}>Pending Review</span>
          </div>
          <p className="text-xl font-bold" style={{ color: '#FFB300' }}>{pendingCount}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="p-4 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: '#CFD2E5' }}>Funding Progress</span>
          <span className="text-sm font-bold" style={{ color: '#C6AB4E' }}>{fundedPercent}%</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: '#282A35' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${fundedPercent}%`, backgroundColor: fundedPercent >= 100 ? '#4CAF50' : '#C6AB4E' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: '#8b8fa3' }}>
          <span>${(dealInfo.totalCommitted / 1000000).toFixed(2)}M committed</span>
          <span>${(dealInfo.fundingGoal / 1000000).toFixed(1)}M goal</span>
        </div>
      </div>

      {/* Commitments table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #3a3c4e' }}>
                {['Investor', 'Amount', 'Status', 'Date', 'Notes', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: '#8b8fa3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commitments.map((c) => {
                const sc = statusColors[c.status];
                return (
                  <tr key={c.id} className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid #3a3c4e' }}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/investors/${c.investorId}`} className="font-medium hover:underline" style={{ color: '#C6AB4E' }}>
                        {c.investor}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: '#CFD2E5' }}>{c.amount}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>{c.date}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#8b8fa3' }}>{c.notes || '-'}</td>
                    <td className="px-4 py-3">
                      {c.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmModal({ action: 'approve', commitment: c })}
                            className="p-1.5 rounded hover:bg-white/5"
                            style={{ color: '#4CAF50' }}
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmModal({ action: 'reject', commitment: c })}
                            className="p-1.5 rounded hover:bg-white/5"
                            style={{ color: '#E53935' }}
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {c.status !== 'pending' && (
                        <span className="text-xs" style={{ color: '#8b8fa3' }}>-</span>
                      )}
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
