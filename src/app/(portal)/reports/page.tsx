'use client';

import { useState } from 'react';
import {
  FileText,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Receipt,
  FileSpreadsheet,
  Calendar,
} from 'lucide-react';

const reportTypeIcons: Record<string, React.ElementType> = {
  'Portfolio Statement': BarChart3,
  'Performance Report': PieChart,
  'Tax Document': Receipt,
  'Distribution Notice': FileSpreadsheet,
  'Deal Summary': FileText,
};

const reportTypeColors: Record<string, string> = {
  'Portfolio Statement': 'bg-[#5B8DEF]/10 text-[#5B8DEF]',
  'Performance Report': 'bg-[#C6AB4E]/10 text-[#C6AB4E]',
  'Tax Document': 'bg-[#4CAF50]/10 text-[#4CAF50]',
  'Distribution Notice': 'bg-[#AB47BC]/10 text-[#AB47BC]',
  'Deal Summary': 'bg-[#FF9800]/10 text-[#FF9800]',
};

const mockReports = [
  { id: 'r1', type: 'Portfolio Statement', title: 'February 2026 Portfolio Statement', period: 'Feb 2026', date: '2026-03-05', size: '2.4 MB' },
  { id: 'r2', type: 'Portfolio Statement', title: 'January 2026 Portfolio Statement', period: 'Jan 2026', date: '2026-02-05', size: '2.1 MB' },
  { id: 'r3', type: 'Performance Report', title: 'Q4 2025 Performance Report', period: 'Q4 2025', date: '2026-01-15', size: '4.8 MB' },
  { id: 'r4', type: 'Tax Document', title: '2025 T5 Tax Slip', period: '2025', date: '2026-03-01', size: '180 KB' },
  { id: 'r5', type: 'Tax Document', title: '2025 Investment Summary for Tax Filing', period: '2025', date: '2026-02-28', size: '320 KB' },
  { id: 'r6', type: 'Distribution Notice', title: 'Q1 2026 Distribution Notice - 145 King St', period: 'Q1 2026', date: '2026-03-10', size: '150 KB' },
  { id: 'r7', type: 'Distribution Notice', title: 'Q4 2025 Distribution Notice - Harbour View', period: 'Q4 2025', date: '2025-12-20', size: '145 KB' },
  { id: 'r8', type: 'Deal Summary', title: 'King Street West - Annual Review', period: '2025', date: '2026-01-20', size: '3.2 MB' },
  { id: 'r9', type: 'Deal Summary', title: 'Harbour View Condos - Progress Report', period: 'H2 2025', date: '2025-12-15', size: '2.8 MB' },
  { id: 'r10', type: 'Performance Report', title: 'Q3 2025 Performance Report', period: 'Q3 2025', date: '2025-10-15', size: '4.5 MB' },
  { id: 'r11', type: 'Portfolio Statement', title: 'December 2025 Portfolio Statement', period: 'Dec 2025', date: '2026-01-05', size: '2.3 MB' },
  { id: 'r12', type: 'Distribution Notice', title: 'Q3 2025 Distribution Notice - Lakeview', period: 'Q3 2025', date: '2025-09-20', size: '140 KB' },
  { id: 'r13', type: 'Deal Summary', title: 'Lakeview Estates - Mid-Term Review', period: 'H1 2025', date: '2025-07-15', size: '2.6 MB' },
  { id: 'r14', type: 'Performance Report', title: 'Q2 2025 Performance Report', period: 'Q2 2025', date: '2025-07-15', size: '4.2 MB' },
  { id: 'r15', type: 'Tax Document', title: '2024 T5 Tax Slip', period: '2024', date: '2025-03-01', size: '175 KB' },
];

export default function ReportsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = mockReports
    .filter((r) => typeFilter === 'all' || r.type === typeFilter)
    .filter((r) => !dateFrom || r.date >= dateFrom)
    .filter((r) => !dateTo || r.date <= dateTo);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6AB4E]/20">
          <FileText className="h-5 w-5 text-[#C6AB4E]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
            Reports
          </h1>
          <p className="text-sm text-[#8b8fa3]">{filtered.length} reports available</p>
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
          <option value="Portfolio Statement">Portfolio Statements</option>
          <option value="Performance Report">Performance Reports</option>
          <option value="Tax Document">Tax Documents</option>
          <option value="Distribution Notice">Distribution Notices</option>
          <option value="Deal Summary">Deal Summaries</option>
        </select>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#8b8fa3]" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
          />
          <span className="text-xs text-[#8b8fa3]">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
          />
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((report) => {
          const Icon = reportTypeIcons[report.type] || FileText;
          const colorClass = reportTypeColors[report.type] || 'bg-[#8b8fa3]/10 text-[#8b8fa3]';
          return (
            <div
              key={report.id}
              className="flex flex-col justify-between rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-5 transition-all hover:border-[#C6AB4E]/30"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass.split(' ')[0]}`}>
                    <Icon className={`h-5 w-5 ${colorClass.split(' ')[1]}`} />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
                    {report.type}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-[#CFD2E5]">{report.title}</h3>
                <p className="text-xs text-[#8b8fa3]">Period: {report.period}</p>
                <p className="text-xs text-[#8b8fa3]">
                  {new Date(report.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })} - {report.size}
                </p>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#3a3c4e] bg-[#282A35] px-4 py-2 text-sm text-[#CFD2E5] transition-colors hover:bg-[#353748]">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
