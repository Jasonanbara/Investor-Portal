'use client';

import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  Users,
  Clock,
  ChevronDown,
  Eye,
  UserPlus,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  assignedUnderwriter: string;
  type: 'deal' | 'support' | 'general';
}

const underwriters = [
  'Unassigned',
  'Mark Stevens',
  'Julia Parker',
  'Tom Richardson',
  'Anna Lopez',
];

const mockChatRooms: ChatRoom[] = [
  { id: 'CHAT-001', name: 'Deal NL-2024-002 Discussion', participants: ['David Chen', 'Lisa Anderson', 'Admin'], lastMessage: 'When will the funding close?', lastMessageTime: '5 min ago', unread: 3, assignedUnderwriter: 'Mark Stevens', type: 'deal' },
  { id: 'CHAT-002', name: 'Sarah Mitchell - Support', participants: ['Sarah Mitchell', 'Admin'], lastMessage: 'I need help with my KYC documents', lastMessageTime: '12 min ago', unread: 1, assignedUnderwriter: 'Julia Parker', type: 'support' },
  { id: 'CHAT-003', name: 'Deal NL-2024-005 Discussion', participants: ['Daniel Lee', 'James Wilson', 'Admin'], lastMessage: 'Updated the commitment amount', lastMessageTime: '25 min ago', unread: 0, assignedUnderwriter: 'Tom Richardson', type: 'deal' },
  { id: 'CHAT-004', name: 'General - Investor Q&A', participants: ['All Investors', 'Admin'], lastMessage: 'Next quarterly call is March 15th', lastMessageTime: '1 hr ago', unread: 0, assignedUnderwriter: 'Unassigned', type: 'general' },
  { id: 'CHAT-005', name: 'Rachel Kim - Onboarding', participants: ['Rachel Kim', 'Admin'], lastMessage: 'Welcome to the platform!', lastMessageTime: '2 hr ago', unread: 2, assignedUnderwriter: 'Anna Lopez', type: 'support' },
  { id: 'CHAT-006', name: 'Deal NL-2024-009 Discussion', participants: ['Jennifer Martinez', 'Robert Taylor', 'Admin'], lastMessage: 'Risk assessment looks good', lastMessageTime: '3 hr ago', unread: 0, assignedUnderwriter: 'Mark Stevens', type: 'deal' },
  { id: 'CHAT-007', name: 'Emily Zhang - Support', participants: ['Emily Zhang', 'Admin'], lastMessage: 'How do I start the KYC process?', lastMessageTime: '4 hr ago', unread: 1, assignedUnderwriter: 'Unassigned', type: 'support' },
  { id: 'CHAT-008', name: 'Deal NL-2024-001 Discussion', participants: ['Sarah Mitchell', 'Amanda White', 'Admin'], lastMessage: 'Congratulations on full funding!', lastMessageTime: '5 hr ago', unread: 0, assignedUnderwriter: 'Julia Parker', type: 'deal' },
  { id: 'CHAT-009', name: 'Kevin Thompson - KYC Help', participants: ['Kevin Thompson', 'Admin'], lastMessage: 'Documents uploaded for review', lastMessageTime: '1 day ago', unread: 0, assignedUnderwriter: 'Tom Richardson', type: 'support' },
  { id: 'CHAT-010', name: 'General - Platform Updates', participants: ['All Investors', 'Admin'], lastMessage: 'New features releasing next week', lastMessageTime: '1 day ago', unread: 0, assignedUnderwriter: 'Unassigned', type: 'general' },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  deal: { bg: 'rgba(198, 171, 78, 0.15)', text: '#C6AB4E' },
  support: { bg: 'rgba(33, 150, 243, 0.15)', text: '#2196F3' },
  general: { bg: 'rgba(139, 143, 163, 0.15)', text: '#8b8fa3' },
};

export default function ChatManagementPage() {
  const [search, setSearch] = useState('');
  const [rooms, setRooms] = useState(mockChatRooms);
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = rooms.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.participants.some((p) => p.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleAssign = (roomId: string, underwriter: string) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, assignedUnderwriter: underwriter } : r)));
    toast.success(`Assigned ${underwriter} to chat room`);
  };

  const totalUnread = rooms.reduce((sum, r) => sum + r.unread, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>Chat Management</h1>
          <p className="text-sm mt-1" style={{ color: '#8b8fa3' }}>Monitor and manage investor chat rooms and underwriter assignments.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#8b8fa3' }}>
            <MessageSquare className="w-4 h-4" />
            {rooms.length} rooms
          </div>
          {totalUnread > 0 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(229, 57, 53, 0.15)', color: '#E53935' }}>
              {totalUnread} unread
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8b8fa3' }} />
          <input
            type="text"
            placeholder="Search by room name or participant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-4 pr-8 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
            style={{ backgroundColor: '#282A35', border: '1px solid #3a3c4e', color: '#CFD2E5' }}
          >
            <option value="all">All Types</option>
            <option value="deal">Deal</option>
            <option value="support">Support</option>
            <option value="general">General</option>
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
                {['Room', 'Type', 'Participants', 'Last Message', 'Unread', 'Assigned Underwriter', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: '#8b8fa3' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((room) => {
                const tc = typeColors[room.type];
                return (
                  <tr key={room.id} className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid #3a3c4e' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 flex-shrink-0" style={{ color: '#C6AB4E' }} />
                        <span className="font-medium" style={{ color: '#CFD2E5' }}>{room.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: tc.bg, color: tc.text }}>
                        {room.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" style={{ color: '#8b8fa3' }} />
                        <span className="text-xs" style={{ color: '#8b8fa3' }}>{room.participants.join(', ')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-xs truncate" style={{ color: '#CFD2E5' }}>{room.lastMessage}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" style={{ color: '#8b8fa3' }} />
                        <span className="text-xs" style={{ color: '#8b8fa3' }}>{room.lastMessageTime}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {room.unread > 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold" style={{ backgroundColor: '#E53935', color: '#fff' }}>
                          {room.unread}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: '#8b8fa3' }}>0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={room.assignedUnderwriter}
                          onChange={(e) => handleAssign(room.id, e.target.value)}
                          className="w-full px-2 py-1.5 rounded text-xs outline-none appearance-none cursor-pointer"
                          style={{
                            backgroundColor: '#282A35',
                            border: '1px solid #3a3c4e',
                            color: room.assignedUnderwriter === 'Unassigned' ? '#8b8fa3' : '#CFD2E5',
                          }}
                        >
                          {underwriters.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toast.success(`Opening chat: ${room.name}`)}
                        className="p-1.5 rounded hover:bg-white/5"
                        style={{ color: '#C6AB4E' }}
                        title="View Chat"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
