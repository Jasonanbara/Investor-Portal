'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Clock,
  DollarSign,
  Briefcase,
  UserX,
  UserCheck,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';

const investorData: Record<string, {
  id: string; name: string; email: string; phone: string; address: string;
  joined: string; kycStatus: string; status: string; totalInvested: string;
  activeDeals: number; accreditationType: string;
}> = {
  'INV-001': { id: 'INV-001', name: 'Sarah Mitchell', email: 'sarah.m@email.com', phone: '+1 (555) 234-5678', address: '123 Bay St, Toronto, ON M5J 2T3', joined: '2024-01-15', kycStatus: 'verified', status: 'active', totalInvested: '$425,000', activeDeals: 3, accreditationType: 'Individual' },
  'INV-002': { id: 'INV-002', name: 'David Chen', email: 'david.chen@email.com', phone: '+1 (555) 345-6789', address: '456 King St W, Toronto, ON M5V 1K4', joined: '2023-11-08', kycStatus: 'verified', status: 'active', totalInvested: '$1,250,000', activeDeals: 5, accreditationType: 'Institutional' },
  'INV-003': { id: 'INV-003', name: 'Rachel Kim', email: 'r.kim@email.com', phone: '+1 (555) 456-7890', address: '789 Yonge St, Toronto, ON M4W 2G8', joined: '2024-03-01', kycStatus: 'pending', status: 'pending', totalInvested: '$0', activeDeals: 0, accreditationType: 'Individual' },
};

const kycDocuments = [
  { name: 'Government ID (Passport)', status: 'approved', uploadedAt: '2024-01-16', file: 'passport_scan.pdf' },
  { name: 'Proof of Address', status: 'approved', uploadedAt: '2024-01-16', file: 'utility_bill.pdf' },
  { name: 'Accredited Investor Certificate', status: 'pending', uploadedAt: '2024-03-01', file: 'accreditation.pdf' },
  { name: 'Tax Identification (W-9)', status: 'approved', uploadedAt: '2024-01-17', file: 'w9_form.pdf' },
];

const investmentHistory = [
  { dealId: 'NL-2024-012', property: '45 Wellington St', amount: '$150,000', date: '2024-02-15', status: 'active', returnRate: '8.5%' },
  { dealId: 'NL-2024-008', property: '120 Adelaide St', amount: '$125,000', date: '2024-01-20', status: 'active', returnRate: '9.2%' },
  { dealId: 'NL-2023-045', property: '88 Queen St', amount: '$150,000', date: '2023-11-10', status: 'completed', returnRate: '7.8%' },
];

const activityLog = [
  { action: 'Logged in', timestamp: '2024-03-10 14:22:05', ip: '192.168.1.45', details: 'Chrome / macOS' },
  { action: 'Viewed Deal NL-2024-015', timestamp: '2024-03-10 14:25:12', ip: '192.168.1.45', details: 'Deal detail page' },
  { action: 'Signed NDA', timestamp: '2024-03-09 10:15:33', ip: '192.168.1.45', details: 'Platform NDA v2.1' },
  { action: 'Committed to Deal', timestamp: '2024-03-08 16:40:22', ip: '192.168.1.45', details: 'NL-2024-012 - $150,000' },
  { action: 'Updated Profile', timestamp: '2024-03-07 09:10:45', ip: '192.168.1.45', details: 'Changed phone number' },
  { action: 'Downloaded Report', timestamp: '2024-03-06 11:30:00', ip: '192.168.1.45', details: 'Q4 2023 Financial Report' },
  { action: 'KYC Document Upload', timestamp: '2024-03-01 08:22:15', ip: '192.168.1.45', details: 'Accredited Investor Cert' },
  { action: 'Logged in', timestamp: '2024-03-01 08:20:00', ip: '192.168.1.45', details: 'Chrome / macOS' },
];

const docStatusColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  approved: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50', icon: CheckCircle },
  pending: { bg: 'rgba(255, 179, 0, 0.15)', text: '#FFB300', icon: Clock },
  rejected: { bg: 'rgba(229, 57, 53, 0.15)', text: '#E53935', icon: XCircle },
};

export default function InvestorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const investor = investorData[id] || investorData['INV-001'];
  const [activeTab, setActiveTab] = useState<'kyc' | 'investments' | 'activity'>('kyc');

  const handleApproveKyc = (docName: string) => {
    toast.success(`Approved: ${docName}`);
  };

  const handleRejectKyc = (docName: string) => {
    toast.error(`Rejected: ${docName}`);
  };

  return (
    <div className="space-y-6">
      {/* Back nav + actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/investors"
          className="flex items-center gap-2 text-sm hover:underline"
          style={{ color: '#C6AB4E' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Investors
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => toast.success('Message sent')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: 'rgba(198, 171, 78, 0.1)', color: '#C6AB4E', border: '1px solid #C6AB4E' }}
          >
            <Send className="w-4 h-4" />
            Message
          </button>
          {investor.status === 'active' ? (
            <button
              onClick={() => toast.error(`${investor.name} suspended`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: 'rgba(229, 57, 53, 0.1)', color: '#E53935', border: '1px solid #E53935' }}
            >
              <UserX className="w-4 h-4" />
              Suspend
            </button>
          ) : (
            <button
              onClick={() => toast.success(`${investor.name} activated`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', border: '1px solid #4CAF50' }}
            >
              <UserCheck className="w-4 h-4" />
              Activate
            </button>
          )}
        </div>
      </div>

      {/* Profile overview */}
      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ backgroundColor: '#C6AB4E', color: '#282A35' }}
          >
            {investor.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h2 className="text-xl font-bold" style={{ color: '#CFD2E5' }}>
                {investor.name}
              </h2>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
                <Mail className="w-4 h-4" />
                {investor.email}
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
                <Phone className="w-4 h-4" />
                {investor.phone}
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
                <MapPin className="w-4 h-4" />
                {investor.address}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
                <Calendar className="w-4 h-4" />
                Joined: {investor.joined}
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
                <Shield className="w-4 h-4" />
                KYC: <span style={{ color: investor.kycStatus === 'verified' ? '#4CAF50' : '#FFB300' }} className="font-medium capitalize">{investor.kycStatus}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
                <User className="w-4 h-4" />
                Type: {investor.accreditationType}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4" style={{ color: '#C6AB4E' }} />
                <span style={{ color: '#8b8fa3' }}>Total Invested:</span>
                <span className="font-bold" style={{ color: '#C6AB4E' }}>{investor.totalInvested}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
                <Briefcase className="w-4 h-4" />
                Active Deals: <span className="font-medium" style={{ color: '#CFD2E5' }}>{investor.activeDeals}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                  style={{
                    backgroundColor: investor.status === 'active' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 179, 0, 0.15)',
                    color: investor.status === 'active' ? '#4CAF50' : '#FFB300',
                  }}
                >
                  {investor.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        {[
          { key: 'kyc', label: 'KYC Documents' },
          { key: 'investments', label: 'Investment History' },
          { key: 'activity', label: 'Activity Log' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: activeTab === tab.key ? 'rgba(198, 171, 78, 0.15)' : 'transparent',
              color: activeTab === tab.key ? '#C6AB4E' : '#8b8fa3',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KYC Documents */}
      {activeTab === 'kyc' && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
        >
          <div className="p-4" style={{ borderBottom: '1px solid #3a3c4e' }}>
            <h3 className="font-semibold" style={{ color: '#CFD2E5' }}>KYC Verification Documents</h3>
          </div>
          <div className="divide-y" style={{ borderColor: '#3a3c4e' }}>
            {kycDocuments.map((doc) => {
              const st = docStatusColors[doc.status];
              const StatusIcon = st.icon;
              return (
                <div key={doc.name} className="p-4 flex items-center justify-between" style={{ borderColor: '#3a3c4e' }}>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" style={{ color: '#8b8fa3' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#CFD2E5' }}>{doc.name}</p>
                      <p className="text-xs" style={{ color: '#8b8fa3' }}>Uploaded: {doc.uploadedAt} &bull; {doc.file}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                      style={{ backgroundColor: st.bg, color: st.text }}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {doc.status}
                    </span>
                    <button className="p-1.5 rounded hover:bg-white/5" style={{ color: '#8b8fa3' }}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-white/5" style={{ color: '#8b8fa3' }}>
                      <Download className="w-4 h-4" />
                    </button>
                    {doc.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveKyc(doc.name)}
                          className="p-1.5 rounded hover:bg-white/5"
                          style={{ color: '#4CAF50' }}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRejectKyc(doc.name)}
                          className="p-1.5 rounded hover:bg-white/5"
                          style={{ color: '#E53935' }}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Investment History */}
      {activeTab === 'investments' && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #3a3c4e' }}>
                {['Deal ID', 'Property', 'Amount', 'Date', 'Return Rate', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: '#8b8fa3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {investmentHistory.map((inv) => (
                <tr key={inv.dealId} style={{ borderBottom: '1px solid #3a3c4e' }} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium" style={{ color: '#C6AB4E' }}>{inv.dealId}</td>
                  <td className="px-4 py-3" style={{ color: '#CFD2E5' }}>{inv.property}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#C6AB4E' }}>{inv.amount}</td>
                  <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>{inv.date}</td>
                  <td className="px-4 py-3" style={{ color: '#4CAF50' }}>{inv.returnRate}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: inv.status === 'active' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(139, 143, 163, 0.15)',
                        color: inv.status === 'active' ? '#4CAF50' : '#8b8fa3',
                      }}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Activity Log */}
      {activeTab === 'activity' && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #3a3c4e' }}>
                {['Action', 'Timestamp', 'IP Address', 'Details'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: '#8b8fa3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activityLog.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #3a3c4e' }} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium" style={{ color: '#CFD2E5' }}>{log.action}</td>
                  <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>{log.timestamp}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#8b8fa3' }}>{log.ip}</td>
                  <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
