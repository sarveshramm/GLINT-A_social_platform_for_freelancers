
import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { DataService } from '../services/dataService';
import { Hire, UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Check, X, Clock, MessageSquare, ExternalLink, Zap, ShieldCheck, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HireManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [hires, setHires] = useState<Hire[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setHires(DataService.getHires(user.id));
    }
  }, [user]);

  const updateStatus = (hireId: string, status: Hire['status']) => {
    DataService.updateHireStatus(hireId, status);
    setHires(DataService.getHires(user!.id));
  };

  const getOtherParty = (hire: Hire) => {
    const otherId = hire.hirerId === user?.id ? hire.creatorId : hire.hirerId;
    return DataService.getUserById(otherId);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-12 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
        >
          <ShieldCheck size={14} />
          <span>Active Contracts & Secure Payments</span>
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none">Projects <span className="text-gray-400">&</span> Hires</h2>
        <p className="text-gray-500 text-lg font-medium max-w-xl">Centralized mission control for all your professional collaborations on GLINT.</p>
      </div>

      <div className="flex items-center gap-8 mb-10 border-b border-gray-100 dark:border-white/5 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button className="px-2 py-5 border-b-4 border-primary text-[10px] font-black tracking-widest text-primary uppercase">ACTIVE MISSIONS</button>
        <button className="px-2 py-5 text-gray-400 text-[10px] font-black tracking-widest hover:text-white transition-colors uppercase">ARCHIVED</button>
        <button className="px-2 py-5 text-gray-400 text-[10px] font-black tracking-widest hover:text-white transition-colors uppercase">DISPUTES</button>
      </div>

      <div className="space-y-6">
        {hires.length > 0 ? (
          hires.map((hire, idx) => {
            const other = getOtherParty(hire);
            return (
              <motion.div 
                key={hire.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-8 md:p-12 rounded-[50px] flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-primary/30 transition-all shadow-sm hover:shadow-2xl"
              >
                <div className="flex flex-col md:flex-row items-center gap-8 flex-1 min-w-0 text-center md:text-left">
                  <div className="relative shrink-0">
                    <img src={other?.avatar} className="w-24 h-24 rounded-[32px] object-cover ring-4 ring-primary/5 shadow-xl" alt="" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-darkBg rounded-full flex items-center justify-center border border-gray-100 dark:border-white/10">
                      <Star size={18} className="text-primary fill-primary" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h3 className="text-3xl font-black truncate tracking-tighter group-hover:text-primary transition-colors">{hire.jobTitle}</h3>
                    </div>
                    <p className="text-lg text-gray-500 font-medium mb-4 italic">Collaborating with <span className="text-gray-900 dark:text-white font-black not-italic">@{other?.username}</span></p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{new Date(hire.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
                        <Zap size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{hire.budget}</span>
                      </div>
                      <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                        hire.status === 'active' ? 'bg-green-500/10 text-green-500' : 
                        hire.status === 'completed' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {hire.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                  <button 
                    onClick={() => {
                      DataService.startOrGetChat(user!.id, other!.id);
                      navigate('/messages');
                    }}
                    className="flex-1 md:flex-none h-16 w-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all text-gray-400"
                  >
                    <MessageSquare size={24} />
                  </button>

                  {hire.status === 'requested' && user?.role === UserRole.CREATOR && (
                    <div className="flex flex-1 md:flex-none gap-4">
                      <button 
                        onClick={() => updateStatus(hire.id, 'active')}
                        className="flex-1 px-8 h-16 bg-primary text-black font-black rounded-2xl glow-orange hover:scale-105 transition-all text-xs uppercase tracking-widest"
                      >
                        ACCEPT MISSION
                      </button>
                      <button 
                        onClick={() => updateStatus(hire.id, 'completed')} 
                        className="h-16 w-16 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  )}

                  {hire.status === 'active' && (
                    <button 
                      onClick={() => updateStatus(hire.id, 'completed')}
                      className="flex-1 md:flex-none px-10 h-16 bg-white dark:bg-white text-black font-black rounded-2xl hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-xl"
                    >
                      MARK FINISHED
                    </button>
                  )}

                  {hire.status === 'completed' && (
                    <button className="flex-1 md:flex-none px-10 h-16 bg-green-500/10 text-green-500 font-black rounded-2xl border border-green-500/20 text-xs uppercase tracking-widest cursor-default">
                      MISSION SUCCESS
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-40 text-center bg-gray-50 dark:bg-darkCard/30 rounded-[60px] border-2 border-dashed border-gray-200 dark:border-white/5">
            <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <Briefcase size={48} />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">No Active Contracts</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">Explore the discovery feed or respond to messages to start your next professional journey.</p>
            <button 
              onClick={() => navigate('/discover')}
              className="mt-10 px-10 py-5 bg-white text-black font-black rounded-3xl text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
            >
              EXPLORE TALENT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
