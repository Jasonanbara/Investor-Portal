'use client';

import { useState } from 'react';
import {
  FolderOpen,
  Folder,
  FileText,
  Upload,
  Download,
  ArrowLeft,
  User,
  Briefcase,
  BarChart3,
  Shield,
  Receipt,
} from 'lucide-react';

interface DocFile {
  name: string;
  type: string;
  size: string;
  date: string;
}

interface DocFolder {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  count: number;
  files: DocFile[];
}

const folders: DocFolder[] = [
  {
    id: 'personal',
    name: 'Personal Docs',
    icon: User,
    color: '#5B8DEF',
    count: 4,
    files: [
      { name: 'Government ID - Passport', type: 'PDF', size: '2.1 MB', date: 'Jan 15, 2026' },
      { name: 'Proof of Address - Utility Bill', type: 'PDF', size: '1.3 MB', date: 'Jan 15, 2026' },
      { name: 'Accreditation Certificate', type: 'PDF', size: '890 KB', date: 'Mar 5, 2026' },
      { name: 'Investor Profile', type: 'PDF', size: '450 KB', date: 'Dec 1, 2025' },
    ],
  },
  {
    id: 'deal',
    name: 'Deal Docs',
    icon: Briefcase,
    color: '#C6AB4E',
    count: 6,
    files: [
      { name: 'King Street West - Loan Agreement', type: 'PDF', size: '3.2 MB', date: 'Sep 15, 2025' },
      { name: 'Harbour View - Subscription Agreement', type: 'PDF', size: '2.8 MB', date: 'Oct 1, 2025' },
      { name: 'Lakeview Estates - Term Sheet', type: 'PDF', size: '1.5 MB', date: 'Nov 20, 2025' },
      { name: 'Hamilton Industrial - Commitment Letter', type: 'PDF', size: '980 KB', date: 'Jan 10, 2026' },
      { name: 'Ottawa Office - Investment Memo', type: 'PDF', size: '4.1 MB', date: 'Feb 15, 2026' },
      { name: 'King Street - Property Appraisal', type: 'PDF', size: '5.6 MB', date: 'Sep 10, 2025' },
    ],
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: BarChart3,
    color: '#4CAF50',
    count: 5,
    files: [
      { name: 'Feb 2026 Portfolio Statement', type: 'PDF', size: '2.4 MB', date: 'Mar 5, 2026' },
      { name: 'Q4 2025 Performance Report', type: 'PDF', size: '4.8 MB', date: 'Jan 15, 2026' },
      { name: 'Jan 2026 Portfolio Statement', type: 'PDF', size: '2.1 MB', date: 'Feb 5, 2026' },
      { name: 'Q3 2025 Performance Report', type: 'PDF', size: '4.5 MB', date: 'Oct 15, 2025' },
      { name: 'Dec 2025 Portfolio Statement', type: 'PDF', size: '2.3 MB', date: 'Jan 5, 2026' },
    ],
  },
  {
    id: 'ndas',
    name: 'NDAs',
    icon: Shield,
    color: '#AB47BC',
    count: 2,
    files: [
      { name: 'Master NDA - Signed', type: 'PDF', size: '650 KB', date: 'Dec 1, 2025' },
      { name: 'Deal-Specific NDA - King Street', type: 'PDF', size: '580 KB', date: 'Sep 12, 2025' },
    ],
  },
  {
    id: 'tax',
    name: 'Tax Documents',
    icon: Receipt,
    color: '#FF9800',
    count: 3,
    files: [
      { name: '2025 T5 Tax Slip', type: 'PDF', size: '180 KB', date: 'Mar 1, 2026' },
      { name: '2025 Investment Summary', type: 'PDF', size: '320 KB', date: 'Feb 28, 2026' },
      { name: '2024 T5 Tax Slip', type: 'PDF', size: '175 KB', date: 'Mar 1, 2025' },
    ],
  },
];

export default function DocumentsPage() {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const currentFolder = folders.find((f) => f.id === activeFolder);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6AB4E]/20">
            <FolderOpen className="h-5 w-5 text-[#C6AB4E]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              Document Vault
            </h1>
            <p className="text-sm text-[#8b8fa3]">Securely stored documents</p>
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#C6AB4E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#b89b3e]">
          <Upload className="h-4 w-4" />
          Upload Document
          <input type="file" className="hidden" />
        </label>
      </div>

      {/* Folder View */}
      {!activeFolder && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {folders.map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id)}
                className="flex flex-col items-center gap-3 rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6 text-center transition-all hover:border-[#C6AB4E]/30 hover:bg-[#353748]"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${folder.color}15` }}
                >
                  <Icon className="h-7 w-7" style={{ color: folder.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#CFD2E5]">{folder.name}</p>
                  <p className="text-xs text-[#8b8fa3]">{folder.count} files</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* File List View */}
      {activeFolder && currentFolder && (
        <div>
          <button
            onClick={() => setActiveFolder(null)}
            className="mb-4 flex items-center gap-2 text-sm text-[#8b8fa3] transition-colors hover:text-[#C6AB4E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Folders
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${currentFolder.color}15` }}
            >
              <currentFolder.icon className="h-5 w-5" style={{ color: currentFolder.color }} />
            </div>
            <h2 className="text-lg font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              {currentFolder.name}
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#3a3c4e] bg-[#2E3040]">
            {currentFolder.files.map((file, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-5 py-4 transition-colors hover:bg-[#353748] ${
                  i < currentFolder.files.length - 1 ? 'border-b border-[#3a3c4e]/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#C6AB4E]" />
                  <div>
                    <p className="text-sm font-medium text-[#CFD2E5]">{file.name}</p>
                    <p className="text-xs text-[#8b8fa3]">{file.type} - {file.size} - {file.date}</p>
                  </div>
                </div>
                <button className="rounded-lg p-2 text-[#8b8fa3] transition-colors hover:bg-[#3a3c4e] hover:text-[#CFD2E5]">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
