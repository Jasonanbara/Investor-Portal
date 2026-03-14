'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Upload,
  FileText,
  Download,
  Eye,
  Calendar,
  X,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Report {
  id: string;
  title: string;
  investor: string;
  deal: string;
  type: 'financial' | 'tax' | 'performance' | 'compliance' | 'quarterly';
  uploadedAt: string;
  size: string;
  status: 'published' | 'draft';
}

const mockReports: Report[] = [
  { id: 'RPT-001', title: 'Q4 2023 Financial Report', investor: 'All Investors', deal: 'Platform-wide', type: 'quarterly', uploadedAt: '2024-01-15', size: '2.4 MB', status: 'published' },
  { id: 'RPT-002', title: 'Tax Summary 2023', investor: 'David Chen', deal: 'NL-2024-002', type: 'tax', uploadedAt: '2024-02-01', size: '1.1 MB', status: 'published' },
  { id: 'RPT-003', title: 'Deal Performance - Adelaide St', investor: 'All Deal Investors', deal: 'NL-2024-002', type: 'performance', uploadedAt: '2024-02-15', size: '3.2 MB', status: 'published' },
  { id: 'RPT-004', title: 'Compliance Report - Q1 2024', investor: 'All Investors', deal: 'Platform-wide', type: 'compliance', uploadedAt: '2024-03-01', size: '1.8 MB', status: 'published' },
  { id: 'RPT-005', title: 'Monthly Financial - Feb 2024', investor: 'Sarah Mitchell', deal: 'NL-2024-001', type: 'financial', uploadedAt: '2024-03-05', size: '950 KB', status: 'published' },
  { id: 'RPT-006', title: 'Deal Performance - Wellington St', investor: 'All Deal Investors', deal: 'NL-2024-001', type: 'performance', uploadedAt: '2024-03-06', size: '2.1 MB', status: 'draft' },
  { id: 'RPT-007', title: 'Tax Summary 2023', investor: 'Lisa Anderson', deal: 'NL-2023-045', type: 'tax', uploadedAt: '2024-02-01', size: '1.0 MB', status: 'published' },
  { id: 'RPT-008', title: 'Q1 2024 Quarterly Report', investor: 'All Investors', deal: 'Platform-wide', type: 'quarterly', uploadedAt: '2024-03-10', size: '4.5 MB', status: 'draft' },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  financial: { bg: 'rgba(198, 171, 78, 0.15)', text: '#C6AB4E' },
  tax: { bg: 'rgba(33, 150, 243, 0.15)', text: '#2196F3' },
  performance: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4CAF50' },
  compliance: { bg: 'rgba(255, 179, 0, 0.15)', text: '#FFB300' },
  quarterly: { bg: 'rgba(156, 39, 176, 0.15)', text: '#9C27B0' },
};

export default function ReportsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ investor: '', deal: '', type: 'financial', title: '', file: '' });

  const filtered = mockReports.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.investor.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.investor) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success('Report uploaded successfully');
    setShowUpload(false);
    setUploadForm({ investor: '', deal: '', type: 'financial', title: '', file: '' });
  };

  return (
    <div className="space-y-6">
      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg mx-4 p-6 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold" style={{ color: '#CFD2E5' }}>Upload New Report</h3>
              <button onClick={() => setShowUpload(false)} style={{ color: '#8b8fa3' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>Report Title <span style={{ color: '#E53935' }}>*</span></label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Q1 2024 Financial Report"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>Investor <span style={{ color: '#E53935' }}>*</span></label>
                <select
                  value={uploadForm.investor}
                  onChange={(e) => setUploadForm((p) => ({ ...p, investor: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none"
                  style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
                >
                  <option value="">Select investor...</option>
                  <option value="all">All Investors</option>
                  <option value="Sarah Mitchell">Sarah Mitchell</option>
                  <option value="David Chen">David Chen</option>
                  <option value="Lisa Anderson">Lisa Anderson</option>
                  <option value="Daniel Lee">Daniel Lee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>Deal</label>
                <select
                  value={uploadForm.deal}
                  onChange={(e) => setUploadForm((p) => ({ ...p, deal: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none"
                  style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
                >
                  <option value="">Platform-wide</option>
                  <option value="NL-2024-001">NL-2024-001 - 45 Wellington St</option>
                  <option value="NL-2024-002">NL-2024-002 - 120 Adelaide St</option>
                  <option value="NL-2024-003">NL-2024-003 - 88 Queen St</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>Report Type</label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none"
                  style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
                >
                  <option value="financial">Financial</option>
                  <option value="tax">Tax</option>
                  <option value="performance">Performance</option>
                  <option value="compliance">Compliance</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>File</label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-white/[0.02]"
                  style={{ borderColor: '#3a3c4e' }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#8b8fa3' }} />
                  <p className="text-sm" style={{ color: '#8b8fa3' }}>Click or drag file to upload</p>
                  <p className="text-xs mt-1" style={{ color: '#8b8fa3' }}>PDF, XLSX up to 25MB</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUpload(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#8b8fa3', border: '1px solid #3a3c4e' }}>
                Cancel
              </button>
              <button onClick={handleUpload} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#C6AB4E', color: '#282A35' }}>
                Upload Report
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>Report Management</h1>
          <p className="text-sm mt-1" style={{ color: '#8b8fa3' }}>Upload, manage, and distribute investor reports.</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#C6AB4E', color: '#282A35' }}
        >
          <Plus className="w-4 h-4" />
          Upload New Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8b8fa3' }} />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8b8fa3' }} />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          >
            <option value="all">All Types</option>
            <option value="financial">Financial</option>
            <option value="tax">Tax</option>
            <option value="performance">Performance</option>
            <option value="compliance">Compliance</option>
            <option value="quarterly">Quarterly</option>
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
                {['Title', 'Investor', 'Deal', 'Type', 'Uploaded', 'Size', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: '#8b8fa3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const tc = typeColors[r.type];
                return (
                  <tr key={r.id} className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid #3a3c4e' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 flex-shrink-0" style={{ color: '#8b8fa3' }} />
                        <span className="font-medium" style={{ color: '#CFD2E5' }}>{r.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>{r.investor}</td>
                    <td className="px-4 py-3" style={{ color: '#C6AB4E' }}>{r.deal}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: tc.bg, color: tc.text }}>
                        {r.type}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {r.uploadedAt}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#8b8fa3' }}>{r.size}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                        style={{
                          backgroundColor: r.status === 'published' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(139, 143, 163, 0.15)',
                          color: r.status === 'published' ? '#4CAF50' : '#8b8fa3',
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded hover:bg-white/5" style={{ color: '#8b8fa3' }} title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/5" style={{ color: '#8b8fa3' }} title="Download">
                          <Download className="w-4 h-4" />
                        </button>
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
