
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../components/AuthContext';
import { DataService } from '../services/dataService';
import { Chat, ChatMessage, Hire } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, MoreVertical, Phone, Video, Briefcase, Zap, CheckCircle } from 'lucide-react';

import { useNotifications } from '../components/NotificationContext';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshCounts } = useNotifications();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeProject, setActiveProject] = useState<Hire | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setChats(DataService.getChats(user.id));
      DataService.markNotificationsAsRead(user.id, 'message');
      refreshCounts();
    }
  }, [user]);

  useEffect(() => {
    if (activeChat && user) {
      setMessages(DataService.getMessages(activeChat.id));
      const otherId = activeChat.participants.find(p => p !== user.id);
      const hires = DataService.getHires(user.id);
      const project = hires.find(h => (h.creatorId === otherId || h.hirerId === otherId) && h.status !== 'completed');
      setActiveProject(project || null);
    }
  }, [activeChat, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !user || !newMessage.trim()) return;

    DataService.sendMessage(activeChat.id, user.id, user.name, newMessage);
    setMessages(DataService.getMessages(activeChat.id));
    setNewMessage('');
  };

  const getOtherParticipant = (chat: Chat) => {
    const otherId = chat.participants.find(p => p !== user?.id);
    return DataService.getUserById(otherId || '');
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-[48px] overflow-hidden flex shadow-2xl">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 dark:border-white/5 flex flex-col">
        <div className="p-8 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-2xl font-black mb-6 tracking-tighter">Messages</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Filter threads..."
              className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-primary border border-transparent font-medium"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {chats.map(chat => {
            const other = getOtherParticipant(chat);
            const isActive = activeChat?.id === chat.id;
            return (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full p-6 flex items-center gap-4 transition-all border-b border-gray-100 dark:border-white/5 text-left relative ${isActive ? 'bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}
                <div className="relative shrink-0">
                  <img src={other?.avatar} className="w-12 h-12 rounded-2xl object-cover border border-gray-100 dark:border-white/10" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-darkBg rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-black text-sm truncate">{other?.name}</p>
                    <span className="text-[9px] text-gray-400 font-bold">12:45 PM</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate font-medium">{chat.lastMessage || "Start a Glint mission..."}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/30 dark:bg-neutral-900/40 relative">
        {activeChat ? (
          <>
            <div className="p-6 px-10 bg-white dark:bg-darkCard border-b border-gray-100 dark:border-white/5 flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <img src={getOtherParticipant(activeChat)?.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                <div>
                  <p className="font-black text-lg tracking-tight">{getOtherParticipant(activeChat)?.name}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Active Collaboration</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-gray-400">
                <button className="hover:text-primary transition-colors"><Phone size={22} /></button>
                <button className="hover:text-primary transition-colors"><Video size={22} /></button>
                <button className="hover:text-primary transition-colors"><MoreVertical size={22} /></button>
              </div>
            </div>

            {/* Active Project Widget */}
            <AnimatePresence>
              {activeProject && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-darkCard mx-10 mt-6 p-6 rounded-[32px] border border-primary/20 flex items-center justify-between shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black tracking-tight">{activeProject.jobTitle}</h4>
                      <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{activeProject.status} MISSION</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase">Budget</p>
                      <p className="text-sm font-black">{activeProject.budget}</p>
                    </div>
                    <button className="px-6 py-3 bg-primary text-black font-black rounded-xl text-[10px] uppercase tracking-widest glow-orange hover:scale-105 transition-all">
                      MANAGE
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-hide">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md p-5 rounded-[28px] text-sm font-medium shadow-sm ${m.senderId === user?.id
                    ? 'bg-primary text-black rounded-br-none'
                    : 'bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-bl-none'
                    }`}>
                    {m.text}
                    <div className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-40 ${m.senderId === user?.id ? 'text-black' : 'text-gray-400'}`}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-8 bg-white dark:bg-darkCard border-t border-gray-100 dark:border-white/5">
              <form onSubmit={handleSend} className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Brief your next move..."
                    className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl px-8 py-5 focus:outline-none focus:border-primary border border-transparent font-medium pr-20"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-gray-400">
                    <button type="button" className="hover:text-primary"><Zap size={20} /></button>
                  </div>
                </div>
                <button type="submit" className="w-16 h-16 bg-primary text-black rounded-2xl flex items-center justify-center glow-orange shrink-0 hover:scale-105 transition-all shadow-xl">
                  <Send size={24} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
            <div className="w-32 h-32 bg-gray-100 dark:bg-white/5 rounded-[40px] flex items-center justify-center mb-10 text-gray-200 dark:text-white/5">
              <Zap size={64} />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">Direct Mission Control</h3>
            <p className="text-gray-500 max-w-sm font-medium leading-relaxed">Select a creator or hirer to begin discussing your next world-class collaboration.</p>
          </div>
        )}
      </div>
    </div>
  );
};
