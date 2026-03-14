'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Headphones,
  Building2,
  Paperclip,
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'support' | 'deal';
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

const userId = 'usr_001';

const mockChats: ChatRoom[] = [
  {
    id: 'c1',
    name: 'NorthLend Support',
    type: 'support',
    lastMessage: 'Your distribution has been processed successfully.',
    lastTime: '10:30 AM',
    unread: 1,
    messages: [
      { id: 'm1', senderId: 'support', senderName: 'NorthLend Support', content: 'Hello James! How can we help you today?', timestamp: '9:00 AM' },
      { id: 'm2', senderId: userId, senderName: 'James Richardson', content: 'Hi, I have a question about my Q1 distribution for the King Street deal.', timestamp: '9:15 AM' },
      { id: 'm3', senderId: 'support', senderName: 'NorthLend Support', content: 'Of course! Let me pull up your account details. One moment please.', timestamp: '9:18 AM' },
      { id: 'm4', senderId: 'support', senderName: 'NorthLend Support', content: 'Your Q1 distribution of $8,312.50 for 145 King Street W was processed on March 10th. You should see it in your account within 2-3 business days.', timestamp: '9:22 AM' },
      { id: 'm5', senderId: userId, senderName: 'James Richardson', content: 'Great, thank you for the quick response!', timestamp: '9:25 AM' },
      { id: 'm6', senderId: 'support', senderName: 'NorthLend Support', content: 'Your distribution has been processed successfully. Is there anything else you need help with?', timestamp: '10:30 AM' },
    ],
  },
  {
    id: 'c2',
    name: '145 King Street W - Deal Chat',
    type: 'deal',
    lastMessage: 'The property inspection report has been uploaded.',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm7', senderId: 'sarah', senderName: 'Sarah Chen', content: 'Good morning everyone. Quick update on the King Street property.', timestamp: 'Mar 10, 9:00 AM' },
      { id: 'm8', senderId: 'sarah', senderName: 'Sarah Chen', content: 'The tenant renewal for floors 3-5 has been confirmed at a 4% rate increase.', timestamp: 'Mar 10, 9:02 AM' },
      { id: 'm9', senderId: userId, senderName: 'James Richardson', content: 'That is excellent news. What is the new lease term?', timestamp: 'Mar 10, 10:15 AM' },
      { id: 'm10', senderId: 'sarah', senderName: 'Sarah Chen', content: 'New 5-year term starting April 1. This significantly strengthens our exit strategy.', timestamp: 'Mar 10, 10:30 AM' },
      { id: 'm11', senderId: 'sarah', senderName: 'Sarah Chen', content: 'The property inspection report has been uploaded to the Documents section.', timestamp: 'Mar 11, 2:00 PM' },
    ],
  },
  {
    id: 'c3',
    name: 'Harbour View Condos - Deal Chat',
    type: 'deal',
    lastMessage: 'Construction is on schedule for Q3 completion.',
    lastTime: 'Mar 8',
    unread: 0,
    messages: [
      { id: 'm12', senderId: 'david', senderName: 'David Kim', content: 'Monthly construction update for Harbour View.', timestamp: 'Mar 8, 11:00 AM' },
      { id: 'm13', senderId: 'david', senderName: 'David Kim', content: 'Structural work is 85% complete. Interior finishing begins next week.', timestamp: 'Mar 8, 11:02 AM' },
      { id: 'm14', senderId: 'david', senderName: 'David Kim', content: 'Construction is on schedule for Q3 completion.', timestamp: 'Mar 8, 11:05 AM' },
    ],
  },
  {
    id: 'c4',
    name: 'Lakeview Estates - Deal Chat',
    type: 'deal',
    lastMessage: 'Appraisal update will be shared next week.',
    lastTime: 'Mar 5',
    unread: 0,
    messages: [
      { id: 'm15', senderId: 'mike', senderName: 'Mike Thompson', content: 'Hi investors, a brief update on Lakeview Estates.', timestamp: 'Mar 5, 3:00 PM' },
      { id: 'm16', senderId: 'mike', senderName: 'Mike Thompson', content: 'Appraisal update will be shared next week. The property value is trending positively.', timestamp: 'Mar 5, 3:03 PM' },
    ],
  },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(mockChats[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState(mockChats);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((c) => c.id === activeChat)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat, currentChat?.messages.length]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `m_${Date.now()}`,
      senderId: userId,
      senderName: 'James Richardson',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat
          ? { ...c, messages: [...c.messages, msg], lastMessage: newMessage, lastTime: 'Just now' }
          : c
      )
    );
    setNewMessage('');
  };

  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-10rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full overflow-hidden rounded-xl border border-[#3a3c4e] bg-[#2E3040]">
        {/* Chat List */}
        <div className="flex w-80 flex-shrink-0 flex-col border-r border-[#3a3c4e]">
          <div className="border-b border-[#3a3c4e] p-4">
            <h2 className="mb-3 text-base font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              Messages
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b8fa3]" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] py-2 pl-9 pr-3 text-sm text-[#CFD2E5] outline-none placeholder:text-[#8b8fa3]/50 focus:border-[#C6AB4E]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`flex w-full items-start gap-3 border-b border-[#3a3c4e]/50 px-4 py-3 text-left transition-colors hover:bg-[#353748] ${
                  activeChat === chat.id ? 'bg-[#C6AB4E]/5' : ''
                }`}
              >
                <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  chat.type === 'support' ? 'bg-[#5B8DEF]/10' : 'bg-[#C6AB4E]/10'
                }`}>
                  {chat.type === 'support' ? (
                    <Headphones className="h-5 w-5 text-[#5B8DEF]" />
                  ) : (
                    <Building2 className="h-5 w-5 text-[#C6AB4E]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#CFD2E5] truncate">{chat.name}</p>
                    <span className="ml-2 flex-shrink-0 text-[11px] text-[#8b8fa3]">{chat.lastTime}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#8b8fa3] truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="mt-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C6AB4E] px-1.5 text-[11px] font-bold text-white">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Chat */}
        <div className="flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-[#3a3c4e] px-5 py-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
              currentChat.type === 'support' ? 'bg-[#5B8DEF]/10' : 'bg-[#C6AB4E]/10'
            }`}>
              {currentChat.type === 'support' ? (
                <Headphones className="h-4 w-4 text-[#5B8DEF]" />
              ) : (
                <Building2 className="h-4 w-4 text-[#C6AB4E]" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#CFD2E5]">{currentChat.name}</p>
              <p className="text-xs text-[#8b8fa3]">
                {currentChat.type === 'support' ? 'Support Team' : 'Deal Discussion'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-4">
              {currentChat.messages.map((msg) => {
                const isOwn = msg.senderId === userId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-xl px-4 py-2.5 ${
                      isOwn
                        ? 'bg-[#C6AB4E]/15 text-[#CFD2E5]'
                        : 'bg-[#282A35] text-[#CFD2E5]'
                    }`}>
                      {!isOwn && (
                        <p className="mb-1 text-xs font-medium text-[#C6AB4E]">{msg.senderName}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`mt-1 text-[11px] ${isOwn ? 'text-[#C6AB4E]/60' : 'text-[#8b8fa3]/60'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-[#3a3c4e] px-5 py-3">
            <div className="flex items-center gap-3">
              <button className="rounded-lg p-2 text-[#8b8fa3] transition-colors hover:bg-[#3a3c4e] hover:text-[#CFD2E5]">
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-[#3a3c4e] bg-[#282A35] px-4 py-2.5 text-sm text-[#CFD2E5] outline-none placeholder:text-[#8b8fa3]/50 focus:border-[#C6AB4E]"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="rounded-lg bg-[#C6AB4E] p-2.5 text-white transition-colors hover:bg-[#b89b3e] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
